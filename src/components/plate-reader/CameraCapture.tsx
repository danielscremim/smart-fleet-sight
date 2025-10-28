import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Square, Play, Pause } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  isProcessing: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageCapture,
  isProcessing
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Preferir câmera traseira em dispositivos móveis
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Definir dimensões do canvas baseado no vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Desenhar o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter para base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onImageCapture(imageData);
  };

  useEffect(() => {
    return () => {
      // Cleanup: parar a câmera quando o componente for desmontado
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Captura por Câmera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full rounded-lg border ${isStreaming ? 'block' : 'hidden'}`}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          
          {!isStreaming && (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Clique em "Iniciar Câmera" para começar</p>
              </div>
            </div>
          )}
        </div>
        
        <canvas
          ref={canvasRef}
          className="hidden"
        />
        
        <div className="flex gap-2 justify-center">
          {!isStreaming ? (
            <Button onClick={startCamera} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Iniciar Câmera
            </Button>
          ) : (
            <>
              <Button 
                onClick={captureImage} 
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                {isProcessing ? 'Processando...' : 'Capturar Placa'}
              </Button>
              <Button 
                onClick={stopCamera} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Parar Câmera
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};