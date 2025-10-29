import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseRtspStreamOptions {
  serverUrl?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export const useRtspStream = (options: UseRtspStreamOptions = {}) => {
  const {
    serverUrl = 'ws://localhost:9999',
    autoReconnect = true,
    reconnectInterval = 5000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef<number>(0);
  const lastFpsCheckRef = useRef<number>(Date.now());

  // Calcular FPS
  const updateFps = useCallback(() => {
    frameCountRef.current++;
    const now = Date.now();
    const elapsed = now - lastFpsCheckRef.current;
    
    if (elapsed >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / elapsed));
      frameCountRef.current = 0;
      lastFpsCheckRef.current = now;
    }
  }, []);

  // Conectar ao servidor WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket já está conectado');
      return;
    }

    try {
      console.log('Conectando ao servidor RTSP proxy:', serverUrl);
      const ws = new WebSocket(serverUrl);

      ws.onopen = () => {
        console.log('WebSocket conectado com sucesso');
        setIsConnected(true);
        setError(null);
        
        toast({
          title: "Servidor conectado",
          description: "Conexão com servidor RTSP estabelecida",
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'frame':
              setCurrentFrame(message.data);
              updateFps();
              break;

            case 'started':
              setIsStreaming(true);
              toast({
                title: "Stream iniciado",
                description: message.message,
              });
              break;

            case 'stopped':
              setIsStreaming(false);
              setCurrentFrame(null);
              toast({
                title: "Stream parado",
                description: message.message,
              });
              break;

            case 'error':
              setError(message.message);
              toast({
                title: "Erro no stream",
                description: message.message,
                variant: "destructive"
              });
              break;
          }
        } catch (err) {
          console.error('Erro ao processar mensagem WebSocket:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('Erro WebSocket:', error);
        setError('Erro na conexão WebSocket');
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor RTSP",
          variant: "destructive"
        });
      };

      ws.onclose = () => {
        console.log('WebSocket desconectado');
        setIsConnected(false);
        setIsStreaming(false);
        setCurrentFrame(null);

        // Tentar reconectar automaticamente
        if (autoReconnect && !reconnectTimeoutRef.current) {
          console.log(`Tentando reconectar em ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Erro ao criar WebSocket:', err);
      setError('Erro ao conectar ao servidor');
    }
  }, [serverUrl, autoReconnect, reconnectInterval, updateFps]);

  // Desconectar do servidor
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsStreaming(false);
    setCurrentFrame(null);
    setFps(0);
  }, []);

  // Iniciar stream RTSP
  const startStream = useCallback((rtspUrl: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('WebSocket não está conectado. Conecte primeiro.');
      toast({
        title: "Erro",
        description: "Conecte ao servidor antes de iniciar o stream",
        variant: "destructive"
      });
      return;
    }

    if (!rtspUrl.trim()) {
      setError('URL RTSP não pode estar vazia');
      toast({
        title: "Erro",
        description: "Insira uma URL RTSP válida",
        variant: "destructive"
      });
      return;
    }

    console.log('Iniciando stream RTSP:', rtspUrl);
    setError(null);
    
    wsRef.current.send(JSON.stringify({
      type: 'start',
      rtspUrl: rtspUrl
    }));
  }, []);

  // Parar stream RTSP
  const stopStream = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    console.log('Parando stream RTSP');
    wsRef.current.send(JSON.stringify({
      type: 'stop'
    }));

    setIsStreaming(false);
    setCurrentFrame(null);
    setFps(0);
  }, []);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isStreaming,
    currentFrame,
    error,
    fps,
    connect,
    disconnect,
    startStream,
    stopStream
  };
};
