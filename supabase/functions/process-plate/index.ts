
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createWorker } from "https://esm.sh/tesseract.js@5.0.5"
import { getThreshold } from "https://esm.sh/tesseract.js-utils@1.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para limpar o texto e extrair o padrão da placa
function extractLicensePlate(text) {
  // Primeiro limpa o texto removendo espaços e quebras de linha
  const cleanText = text.replace(/\s+/g, '');
  
  // Padrão Mercosul: 3 letras, 1 número, 1 letra, 2 números (ABC1D23)
  const mercosulPattern = /[A-Z]{3}[0-9][A-Z][0-9]{2}/;
  const mercosulMatch = cleanText.match(mercosulPattern);
  
  if (mercosulMatch) {
    return {
      plate: mercosulMatch[0],
      format: 'mercosul',
      confidence: 0.95
    };
  }
  
  // Padrão antigo: 3 letras, 4 números (ABC1234)
  const oldPattern = /[A-Z]{3}[0-9]{4}/;
  const oldMatch = cleanText.match(oldPattern);
  
  if (oldMatch) {
    return {
      plate: oldMatch[0],
      format: 'old',
      confidence: 0.92
    };
  }
  
  // Se nenhum padrão for encontrado, retorna o texto limpo
  return {
    plate: cleanText.substring(0, 7).toUpperCase(),
    format: 'unknown',
    confidence: 0.7
  };
}

// Função para pré-processar a imagem antes do OCR
async function preprocessImage(imageBase64) {
  try {
    // Remover o cabeçalho do data URL se existir
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Criar uma resposta com a imagem processada
    return {
      success: true,
      image: base64Data
    };
  } catch (error) {
    console.error("Erro no pré-processamento da imagem:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

serve(async (req) => {
  // Lidar com requisições CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    if (!image) {
      throw new Error('Nenhuma imagem fornecida')
    }
    
    console.log("Iniciando processamento de imagem para leitura de placa")
    
    // Pré-processar a imagem
    const processedImage = await preprocessImage(image)
    if (!processedImage.success) {
      throw new Error(`Falha no pré-processamento da imagem: ${processedImage.error}`)
    }
    
    // Configurar o worker do Tesseract OCR
    const worker = await createWorker({
      logger: progress => console.log(progress),
    });
    
    // Carregar e configurar o worker para reconhecimento de caracteres
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // Configurações otimizadas para placas de veículos
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      tessedit_pageseg_mode: '7', // Tratando a imagem como uma única linha de texto
    });
    
    console.log("OCR configurado, iniciando reconhecimento de texto")
    
    // Reconhecer texto na imagem
    const result = await worker.recognize(image);
    console.log("Texto reconhecido:", result.data.text);
    
    // Extrair placa do texto reconhecido
    const plateInfo = extractLicensePlate(result.data.text);
    console.log("Informações da placa extraídas:", plateInfo);
    
    // Liberar recursos do worker
    await worker.terminate();
    
    return new Response(
      JSON.stringify({
        plate: plateInfo.plate,
        confidence: plateInfo.confidence,
        format: plateInfo.format
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Erro ao processar placa:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
