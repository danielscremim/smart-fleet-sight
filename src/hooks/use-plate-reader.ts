
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
  
  // Obter as funções necessárias do contexto
  const { createTruck, getTruckByPlate, updateTruckStatus, deleteTruck } = useTrucks();

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
        setPlateText(data.plate.toUpperCase());
        setConfidence(data.confidence * 100);
        setIsProcessed(true);
        
        toast({
          title: "Placa identificada",
          description: `A placa ${data.plate.toUpperCase()} foi identificada com ${Math.round(data.confidence * 100)}% de confiança.`
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

  const handleRegisterPlate = async () => {
    if (plateText) {
      try {
        // Verificar se o caminhão já existe
        const existingTruck = await getTruckByPlate(plateText.toUpperCase());
        
        if (existingTruck) {
          // Se o caminhão já existe, verificamos seu status
          if (existingTruck.status === 'outside') {
            // Se o status for 'outside', criamos um novo registro sem excluir o antigo
            try {
              // Armazenar informações do caminhão para o novo registro
              const { model, year, company, driver_name } = existingTruck;
              
              // Criar um novo registro com as mesmas informações, mas status 'entering'
              await createTruck({
                plate: plateText.toUpperCase(),
                status: 'entering',
                last_seen: new Date().toISOString(),
                model: model || 'Não especificado',
                year: year || new Date().getFullYear(),
                company: company || 'Não especificado',
                driver_name: driver_name || 'Não especificado'
              });
              
              toast({
                title: "Nova viagem iniciada",
                description: `Uma nova viagem foi iniciada para a placa ${plateText.toUpperCase()}.`
              });
            } catch (error) {
              console.error("Erro ao processar nova viagem:", error);
              throw error;
            }
          } else {
            // Se não for 'outside', atualizamos o status normalmente
            let newStatus: Truck['status'] = 'entering';
            
            // Lógica para alternar o status
            if (existingTruck.status === 'entering') {
              newStatus = 'in_city';
            } else if (existingTruck.status === 'in_city') {
              newStatus = 'leaving';
            } else if (existingTruck.status === 'leaving') {
              newStatus = 'outside';
            }
            
            // Atualiza o status do caminhão
            await updateTruckStatus(existingTruck.id, newStatus);
            
            toast({
              title: "Status do caminhão atualizado",
              description: `A placa ${plateText.toUpperCase()} foi atualizada para status: ${getStatusLabel(newStatus)}.`
            });
          }
        } else {
          // Se não existe, cria um novo caminhão
          await createTruck({
            plate: plateText.toUpperCase(),
            status: 'entering',
            last_seen: new Date().toISOString(),
            model: 'Não especificado',
            year: new Date().getFullYear(),
            company: 'Não especificado',
            driver_name: 'Não especificado'
          });
          
          toast({
            title: "Placa registrada com sucesso",
            description: `A placa ${plateText.toUpperCase()} foi adicionada ao sistema.`
          });
        }
        
        resetState();
      } catch (error) {
        console.error("Erro ao registrar placa:", error);
        toast({
          variant: "destructive",
          title: "Erro ao registrar",
          description: "Não foi possível registrar a placa. Tente novamente mais tarde."
        });
      }
    }
  };

// Função auxiliar para obter o rótulo do status em português
const getStatusLabel = (status: Truck['status']): string => {
  switch (status) {
    case 'entering': return 'Entrando';
    case 'in_city': return 'Na cidade';
    case 'leaving': return 'Saindo';
    case 'outside': return 'Fora da cidade';
    default: return status;
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
