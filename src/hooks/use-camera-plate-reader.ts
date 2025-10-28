import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface PlateDetection {
  plate: string;
  confidence: number;
  timestamp: Date;
}

export const useCameraPlateReader = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoCapture, setIsAutoCapture] = useState(false);
  const [detectedPlates, setDetectedPlates] = useState<PlateDetection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedRef = useRef<number>(0);

  const processImage = async (imageData: string): Promise<{ plate: string; confidence: number } | null> => {
    try {
      console.log('Enviando imagem para processamento...');
      
      const { data, error } = await supabase.functions.invoke('process-plate', {
        body: { image: imageData },
        options: {
          timeout: 15000 // Timeout menor para captura contínua
        }
      });

      if (error) {
        console.error('Erro retornado pelo Supabase:', error);
        return null;
      }

      if (data && data.plate && data.confidence) {
        return {
          plate: data.plate.toUpperCase(),
          confidence: parseFloat(data.confidence)
        };
      }

      return null;
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      return null;
    }
  };

  const captureAndProcess = useCallback(async (captureFunction: () => string) => {
    // Evitar processamento muito frequente
    const now = Date.now();
    if (now - lastProcessedRef.current < 2000) { // Mínimo 2 segundos entre capturas
      return;
    }
    
    lastProcessedRef.current = now;
    setIsProcessing(true);
    setError(null);

    try {
      const imageData = captureFunction();
      const result = await processImage(imageData);
      
      if (result && result.confidence > 0.7) { // Só aceitar placas com alta confiança
        const newDetection: PlateDetection = {
          plate: result.plate,
          confidence: result.confidence,
          timestamp: new Date()
        };
        
        // Verificar se não é uma placa duplicada recente
        const isDuplicate = detectedPlates.some(
          detection => 
            detection.plate === result.plate && 
            (now - detection.timestamp.getTime()) < 10000 // 10 segundos
        );
        
        if (!isDuplicate) {
          setDetectedPlates(prev => [newDetection, ...prev.slice(0, 9)]); // Manter apenas as 10 mais recentes
          
          toast({
            title: "Placa detectada!",
            description: `${result.plate} (${(result.confidence * 100).toFixed(1)}% confiança)`,
          });
        }
      }
    } catch (err) {
      console.error('Erro na captura automática:', err);
      setError('Erro ao processar imagem da câmera');
    } finally {
      setIsProcessing(false);
    }
  }, [detectedPlates]);

  const startAutoCapture = (captureFunction: () => string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsAutoCapture(true);
    setError(null);
    
    // Capturar a cada 3 segundos
    intervalRef.current = setInterval(() => {
      if (!isProcessing) {
        captureAndProcess(captureFunction);
      }
    }, 3000);
    
    toast({
      title: "Captura automática iniciada",
      description: "O sistema está monitorando placas automaticamente.",
    });
  };

  const stopAutoCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsAutoCapture(false);
    setIsProcessing(false);
    
    toast({
      title: "Captura automática parada",
      description: "O monitoramento automático foi interrompido.",
    });
  };

  const clearDetections = () => {
    setDetectedPlates([]);
  };

  const manualCapture = async (captureFunction: () => string) => {
    await captureAndProcess(captureFunction);
  };

  return {
    isProcessing,
    isAutoCapture,
    detectedPlates,
    error,
    startAutoCapture,
    stopAutoCapture,
    clearDetections,
    manualCapture
  };
};