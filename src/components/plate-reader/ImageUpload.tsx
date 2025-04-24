
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Camera } from "lucide-react";
import { CardContent } from "@/components/ui/card";

interface ImageUploadProps {
  selectedImage: string | null;
  error: string | null;
  isProcessing: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onProcessImage: () => void;
}

export const ImageUpload = ({
  selectedImage,
  error,
  isProcessing,
  onImageChange,
  onImageRemove,
  onProcessImage,
}: ImageUploadProps) => {
  return (
    <CardContent className="space-y-4">
      {selectedImage ? (
        <div className="relative border rounded-lg overflow-hidden">
          <img 
            src={selectedImage} 
            alt="Placa para análise" 
            className="w-full h-auto object-cover"
          />
          <Button 
            variant="outline" 
            className="absolute top-2 right-2 bg-white"
            onClick={onImageRemove}
          >
            Remover
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Clique para selecionar uma imagem</p>
          <p className="text-gray-400 text-sm mt-1">ou arraste e solte aqui</p>
        </div>
      )}
      
      <Input 
        id="image-upload"
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={onImageChange}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        className="w-full bg-anpr-blue hover:bg-anpr-darkBlue"
        onClick={onProcessImage}
        disabled={!selectedImage || isProcessing}
      >
        {isProcessing ? (
          <>
            <Camera className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            {selectedImage ? "Reprocessar Imagem" : "Processar Imagem"}
          </>
        )}
      </Button>
    </CardContent>
  );
};
