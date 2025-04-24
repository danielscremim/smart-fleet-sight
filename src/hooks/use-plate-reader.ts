
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
  };

  return {
    selectedImage,
    imageFile,
    isProcessing,
    isProcessed,
    plateText,
    confidence,
    error,
    handleImageChange,
    processImage,
    handleRegisterPlate,
    resetState
  };
};
