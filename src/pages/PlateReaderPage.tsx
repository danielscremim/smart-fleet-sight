import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Upload, RefreshCw, Check } from "lucide-react";
import { useTrucks } from "@/contexts/TruckContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PlateReaderPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [plateText, setPlateText] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const { addTruck } = useTrucks();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('image')) {
        setError("O arquivo selecionado não é uma imagem.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setImageFile(file);
        setIsProcessed(false);
        setPlateText("");
        setConfidence(0);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const processImage = async () => {
    if (!selectedImage) {
      setError("Nenhuma imagem selecionada para processamento.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-plate', {
        body: { image: selectedImage }
      });

      if (error) throw error;
      
      if (data.plate) {
        setPlateText(data.plate);
        setConfidence(data.confidence * 100);
        setIsProcessed(true);
      } else {
        throw new Error('Não foi possível ler a placa na imagem');
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar a imagem');
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: err.message || 'Erro ao processar a imagem'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRegisterPlate = () => {
    if (plateText) {
      addTruck(plateText);
      setSelectedImage(null);
      setImageFile(null);
      setIsProcessed(false);
      setPlateText("");
      setConfidence(0);
      
      toast({
        title: "Placa registrada com sucesso",
        description: `A placa ${plateText} foi adicionada ao sistema.`
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Teste de Leitura de Placa</h1>
        <p className="text-gray-500 mt-2">Faça upload da imagem de uma placa para testar o sistema ANPR</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image upload section */}
        <div className="space-y-6">
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
                    onClick={() => {
                      setSelectedImage(null);
                      setImageFile(null);
                      setIsProcessed(false);
                      setPlateText("");
                    }}
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
                onChange={handleImageChange}
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                className="w-full bg-anpr-blue hover:bg-anpr-darkBlue"
                onClick={processImage}
                disabled={!selectedImage || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {isProcessed ? "Reprocessar Imagem" : "Processar Imagem"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Results section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Leitura</CardTitle>
              <CardDescription>
                {isProcessed 
                  ? "A placa foi identificada com sucesso" 
                  : "Faça o upload de uma imagem para analisar"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isProcessed ? (
                <>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500 mb-1">Placa Identificada</p>
                    <h2 className="text-4xl font-bold tracking-wider">{plateText}</h2>
                    <div className="mt-2 text-sm text-gray-500">
                      Confiança: {confidence}%
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${confidence > 90 ? 'bg-green-500' : confidence > 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={processImage}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reprocessar
                    </Button>
                    <Button 
                      className="flex-1 bg-anpr-blue hover:bg-anpr-darkBlue"
                      onClick={handleRegisterPlate}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Registrar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    Nenhuma placa processada
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Faça o upload de uma imagem e clique em "Processar Imagem"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isProcessed && (
            <Alert className="bg-blue-50 border-blue-100">
              <AlertTitle className="text-blue-800">Dica</AlertTitle>
              <AlertDescription className="text-blue-700">
                Você pode registrar esta placa para rastrear a entrada e saída do caminhão na cidade.
              </AlertDescription>
            </Alert>
          )}
        </div>
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
