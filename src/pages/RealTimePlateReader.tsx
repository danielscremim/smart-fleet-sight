import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Play, Square, Pause, RotateCcw, Settings, Video, Monitor } from 'lucide-react';
import { useCameraPlateReader } from '@/hooks/use-camera-plate-reader';
import { PlateDetectionList } from '@/components/plate-reader/PlateDetectionList';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RealTimePlateReader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [cameraUrl, setCameraUrl] = useState<string>('');
  const [cameraMode, setCameraMode] = useState<'local' | 'remote'>('local');

  const {
    isProcessing,
    isAutoCapture,
    detectedPlates,
    error: processingError,
    startAutoCapture,
    stopAutoCapture,
    clearDetections,
    manualCapture
  } = useCameraPlateReader();

  // Função para capturar frame atual
  const captureCurrentFrame = (): string => {
    if (!videoRef.current || !canvasRef.current) {
      throw new Error('Vídeo ou canvas não disponível');
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Contexto do canvas não disponível');
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Listar câmeras disponíveis
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
      }
    } catch (err) {
      console.error('Erro ao listar câmeras:', err);
    }
  };

  // Iniciar câmera local
  const startCamera = async () => {
    try {
      setCameraError(null);
      
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          facingMode: selectedCamera ? undefined : 'environment'
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
        
        toast({
          title: "Câmera iniciada",
          description: "Câmera conectada com sucesso!",
        });
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setCameraError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  // Iniciar câmera remota (RTSP, HTTP, etc.)
  const startRemoteCamera = async () => {
    try {
      setCameraError(null);
      
      if (!cameraUrl.trim()) {
        setCameraError('Por favor, insira o endereço da câmera.');
        toast({
          title: "Erro",
          description: "Insira o endereço da câmera",
          variant: "destructive"
        });
        return;
      }
      
      if (videoRef.current) {
        // Para câmeras IP/RTSP, usamos o elemento video diretamente
        // Nota: Navegadores não suportam RTSP diretamente, seria necessário um servidor intermediário
        // Por enquanto, vamos tentar com URLs HTTP diretas (MJPEG, HLS, etc.)
        videoRef.current.src = cameraUrl;
        videoRef.current.load();
        
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
          toast({
            title: "Câmera conectada",
            description: "Stream remoto conectado com sucesso!",
          });
        };
        
        videoRef.current.onerror = () => {
          setCameraError('Não foi possível conectar à câmera remota. Verifique o endereço e protocolo.');
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar à câmera remota.",
            variant: "destructive"
          });
        };
      }
    } catch (err) {
      console.error('Erro ao conectar à câmera remota:', err);
      setCameraError('Erro ao conectar à câmera remota.');
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (isAutoCapture) {
      stopAutoCapture();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
      videoRef.current.load();
    }
    
    setIsStreaming(false);
    
    toast({
      title: "Câmera parada",
      description: "Câmera desconectada.",
    });
  };

  // Alternar captura automática
  const toggleAutoCapture = () => {
    if (!isStreaming) {
      toast({
        title: "Erro",
        description: "Inicie a câmera primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    if (isAutoCapture) {
      stopAutoCapture();
    } else {
      startAutoCapture(captureCurrentFrame);
    }
  };

  // Captura manual
  const handleManualCapture = () => {
    if (!isStreaming) {
      toast({
        title: "Erro",
        description: "Inicie a câmera primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    manualCapture(captureCurrentFrame);
  };

  // Trocar câmera
  const switchCamera = async (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (isStreaming) {
      stopCamera();
      // Pequeno delay para garantir que a câmera anterior foi liberada
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  };

  useEffect(() => {
    getCameras();
    
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leitor de Placas em Tempo Real</h1>
          <p className="text-gray-600 mt-2">
            Sistema automático de reconhecimento de placas via câmera
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isStreaming ? "default" : "secondary"}>
            {isStreaming ? "Câmera Ativa" : "Câmera Inativa"}
          </Badge>
          {isAutoCapture && (
            <Badge variant="destructive" className="animate-pulse">
              Captura Automática
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel da Câmera */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Visualização da Câmera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(cameraError || processingError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {cameraError || processingError}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Abas para escolher tipo de câmera */}
            {!isStreaming && (
              <Tabs value={cameraMode} onValueChange={(value) => setCameraMode(value as 'local' | 'remote')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="local" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Câmera Local
                  </TabsTrigger>
                  <TabsTrigger value="remote" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Câmera IP/RTSP
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="local" className="space-y-4">
                  {/* Seletor de Câmera Local */}
                  {availableCameras.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="camera-select">Selecione a câmera</Label>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <select
                          id="camera-select"
                          value={selectedCamera}
                          onChange={(e) => setSelectedCamera(e.target.value)}
                          className="flex-1 p-2 border rounded"
                        >
                          {availableCameras.map((camera, index) => (
                            <option key={camera.deviceId} value={camera.deviceId}>
                              {camera.label || `Câmera ${index + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500">
                    Use a câmera integrada do seu dispositivo ou webcam USB conectada.
                  </p>
                </TabsContent>
                
                <TabsContent value="remote" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="camera-url">Endereço da Câmera</Label>
                    <Input
                      id="camera-url"
                      type="text"
                      placeholder="http://192.168.1.100:8080/video ou rtsp://..."
                      value={cameraUrl}
                      onChange={(e) => setCameraUrl(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      Formatos suportados: HTTP (MJPEG/HLS), RTSP (requer servidor intermediário)
                    </p>
                  </div>
                  
                  <Alert>
                    <AlertDescription className="text-sm">
                      <strong>Exemplos de URLs:</strong>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li>• HTTP: http://192.168.1.100:8080/video.mjpg</li>
                        <li>• RTSP: rtsp://usuario:senha@192.168.1.100:554/stream</li>
                        <li>• HLS: http://192.168.1.100/stream.m3u8</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            )}
            
            {/* Vídeo */}
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
                    <p className="text-gray-500">Configure e inicie a câmera acima</p>
                  </div>
                </div>
              )}
              
              {/* Indicador de processamento */}
              {isProcessing && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm animate-pulse">
                  Processando...
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Controles */}
            <div className="flex gap-2 justify-center flex-wrap">
              {!isStreaming ? (
                <Button 
                  onClick={cameraMode === 'local' ? startCamera : startRemoteCamera} 
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Iniciar Câmera
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={toggleAutoCapture}
                    variant={isAutoCapture ? "destructive" : "default"}
                    className="flex items-center gap-2"
                  >
                    {isAutoCapture ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Parar Auto
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Iniciar Auto
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleManualCapture}
                    disabled={isProcessing || isAutoCapture}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Captura Manual
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

        {/* Lista de Detecções */}
        <PlateDetectionList
          detections={detectedPlates}
          onClear={clearDetections}
        />
      </div>
    </div>
  );
}