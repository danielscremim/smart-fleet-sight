import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const API_KEY = "f9969cdf396f66c8f9d2b7434afe5b6e145b5028";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Recebendo requisição para processamento de placa");
    
    const contentType = req.headers.get('content-type');
    console.log(`Content-Type: ${contentType}`);
    
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados da requisição recebidos com sucesso");
    } catch (e) {
      console.error("Erro ao analisar JSON da requisição:", e);
      throw new Error(`Erro ao analisar JSON da requisição: ${e.message}`);
    }
    
    const { image } = requestData;
    if (!image) {
      console.error("Nenhuma imagem fornecida na requisição");
      throw new Error('Nenhuma imagem fornecida na requisição');
    }
    
    console.log("Preparando imagem para envio à API Plate Recognizer");
    
    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    try {
      console.log("Criando FormData para envio à API");
      
      const formData = new FormData();
      const blob = new Blob([binaryData], { type: 'image/jpeg' });
      
      formData.append('upload', blob, 'plate.jpg');
      formData.append('regions', 'br');
      
      console.log("Enviando requisição para API Plate Recognizer");
      
      const response = await fetch('https://api.platerecognizer.com/v1/plate-reader/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${API_KEY}`
        },
        body: formData
      });
      
      console.log("Status da resposta da API:", response.status);
      
      const data = await response.json();
      console.log("Resposta da API recebida:", JSON.stringify(data));
      
      if (!response.ok) {
        console.error("Erro na API Plate Recognizer:", data);
        throw new Error(`Erro na API: ${data.error || response.statusText}`);
      }
      
      console.log("Processando resultados da API");
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        console.log("Placa detectada:", result.plate);
        
        return new Response(
          JSON.stringify({
            plate: result.plate,
            confidence: result.score,
            format: result.region.code === 'br' ? 'mercosul' : 'other'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log("Nenhuma placa detectada na imagem");
        
        return new Response(
          JSON.stringify({
            error: 'Nenhuma placa detectada na imagem'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          }
        );
      }
    } catch (apiError) {
      console.error("Erro na comunicação com a API:", apiError);
      throw new Error(`Erro na comunicação com a API Plate Recognizer: ${apiError.message}`);
    }
  } catch (error) {
    console.error('Erro ao processar placa:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Erro ao processar a imagem da placa'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})


