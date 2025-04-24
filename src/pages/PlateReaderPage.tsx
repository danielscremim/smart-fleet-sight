
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { ImageUpload } from "@/components/plate-reader/ImageUpload";
import { PlateResult } from "@/components/plate-reader/PlateResult";
import { usePlateReader } from "@/hooks/use-plate-reader";

export default function PlateReaderPage() {
  const {
    selectedImage,
    isProcessing,
    isProcessed,
    plateText,
    confidence,
    error,
    handleImageChange,
    processImage,
    handleRegisterPlate,
    resetState
  } = usePlateReader();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Teste de Leitura de Placa</h1>
        <p className="text-gray-500 mt-2">Faça upload da imagem de uma placa para testar o sistema ANPR</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image upload section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" /> 
              Upload de Imagem
            </CardTitle>
            <CardDescription>
              Selecione uma imagem com placa de caminhão
            </CardDescription>
          </CardHeader>
          <ImageUpload
            selectedImage={selectedImage}
            error={error}
            isProcessing={isProcessing}
            onImageChange={handleImageChange}
            onImageRemove={resetState}
            onProcessImage={processImage}
          />
        </Card>
        
        {/* Results section */}
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Leitura</CardTitle>
            <CardDescription>
              {isProcessed 
                ? "A placa foi identificada com sucesso" 
                : "Faça o upload de uma imagem para analisar"}
            </CardDescription>
          </CardHeader>
          <PlateResult
            isProcessed={isProcessed}
            plateText={plateText}
            confidence={confidence}
            onReprocess={processImage}
            onRegister={handleRegisterPlate}
          />
        </Card>
      </div>
      
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como utilizar o leitor ANPR</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-gray-600">
            <li>Faça upload da foto de uma placa de caminhão (formatos aceitos: JPG, PNG).</li>
            <li>Clique em "Processar Imagem" para iniciar o reconhecimento automático.</li>
            <li>Verifique o resultado da leitura e o nível de confiança.</li>
            <li>Se necessário, clique em "Reprocessar" para tentar novamente.</li>
            <li>Quando o resultado estiver correto, clique em "Registrar" para adicionar ao sistema.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
