
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { ImageUpload } from "@/components/plate-reader/ImageUpload";
import { PlateResult } from "@/components/plate-reader/PlateResult";
import { PageHeader } from "@/components/plate-reader/PageHeader";
import { PlateInstructions } from "@/components/plate-reader/PlateInstructions";
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
      <PageHeader />
      
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
      
      <PlateInstructions />
    </div>
  );
}
