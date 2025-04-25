
import { useState } from "react";
import { useTrucks } from "@/contexts/TruckContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePlateReader = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [plateText, setPlateText] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isManualEntryMode, setIsManualEntryMode] = useState(false);
  
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
      console.log("Enviando imagem para processamento...");
      
      const { data, error } = await supabase.functions.invoke('process-plate', {
        body: { image: selectedImage },
        options: {
          timeout: 30000 // Aumentar timeout para 30 segundos
        }
      });
  
      if (error) {
        console.error("Erro retornado pelo Supabase:", error);
        setError("Não foi possível processar a placa automaticamente. Por favor, insira manualmente.");
        setIsManualEntryMode(true);
        return;
      }
      
      console.log("Resposta recebida:", data);
      
      if (data && data.plate) {
        setPlateText(data.plate);
        setConfidence(data.confidence * 100);
        setIsProcessed(true);
        
        toast({
          title: "Placa identificada",
          description: `A placa ${data.plate} foi identificada com ${Math.round(data.confidence * 100)}% de confiança.`
        });
      } else if (data && data.error) {
        setError(data.error);
        setIsManualEntryMode(true);
        
        toast({
          variant: "destructive",
          title: "Erro no reconhecimento",
          description: data.error
        });
      } else {
        setError('Não foi possível ler a placa na imagem ou resposta inválida');
        setIsManualEntryMode(true);
        
        toast({
          variant: "destructive",
          title: "Placa não detectada",
          description: "Não foi possível identificar uma placa na imagem. Por favor, insira manualmente."
        });
      }
    } catch (err) {
      console.error("Erro detalhado no processamento:", err);
      setError(err.message || 'Erro ao processar a imagem');
      setIsManualEntryMode(true);
      
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Não foi possível processar a placa automaticamente. Por favor, insira manualmente."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegisterPlate = () => {
    if (plateText) {
      addTruck(plateText);
      resetState();
      
      toast({
        title: "Placa registrada com sucesso",
        description: `A placa ${plateText} foi adicionada ao sistema.`
      });
    }
  };

  const resetState = () => {
    setSelectedImage(null);
    setImageFile(null);
    setIsProcessed(false);
    setPlateText("");
    setConfidence(0);
    setIsManualEntryMode(false);
  };

  return {
    selectedImage,
    imageFile,
    isProcessing,
    isProcessed,
    plateText,
    confidence,
    error,
    isManualEntryMode,
    handleImageChange,
    processImage,
    handleRegisterPlate,
    resetState,
    setPlateText,
    setIsManualEntryMode
  };
};
