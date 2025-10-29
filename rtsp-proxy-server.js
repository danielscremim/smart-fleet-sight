/**
 * Servidor Proxy RTSP para WebSocket
 * Converte stream RTSP em frames JPEG enviados via WebSocket
 * 
 * Uso:
 * node rtsp-proxy-server.js
 * 
 * Depois conecte o frontend em: ws://localhost:9999
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Armazena streams ativos
const activeStreams = new Map();

/**
 * Converte RTSP para JPEG frames usando FFmpeg
 */
function startRtspStream(rtspUrl, ws) {
  console.log('Iniciando stream RTSP:', rtspUrl);
  
  // FFmpeg command para converter RTSP para JPEG frames
  const ffmpeg = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',  // Usar TCP ao invés de UDP (mais confiável)
    '-i', rtspUrl,              // URL da câmera RTSP
    '-f', 'image2pipe',         // Formato: pipe de imagens
    '-vcodec', 'mjpeg',         // Codec: MJPEG
    '-q:v', '5',                // Qualidade (1-31, menor = melhor)
    '-vf', 'fps=10,scale=1280:720', // 10 FPS, escala para 1280x720
    '-'                         // Output para stdout
  ]);

  let frameBuffer = Buffer.alloc(0);
  const JPEG_START = Buffer.from([0xFF, 0xD8]); // JPEG Start marker
  const JPEG_END = Buffer.from([0xFF, 0xD9]);   // JPEG End marker

  // Receber dados do FFmpeg
  ffmpeg.stdout.on('data', (data) => {
    frameBuffer = Buffer.concat([frameBuffer, data]);

    // Procurar por frames JPEG completos
    let startIdx = 0;
    while (true) {
      const jpegStart = frameBuffer.indexOf(JPEG_START, startIdx);
      if (jpegStart === -1) break;

      const jpegEnd = frameBuffer.indexOf(JPEG_END, jpegStart + 2);
      if (jpegEnd === -1) break;

      // Extrair frame JPEG completo
      const frame = frameBuffer.slice(jpegStart, jpegEnd + 2);
      
      // Enviar frame para o cliente via WebSocket
      if (ws.readyState === WebSocket.OPEN) {
        const base64Frame = frame.toString('base64');
        ws.send(JSON.stringify({
          type: 'frame',
          data: `data:image/jpeg;base64,${base64Frame}`,
          timestamp: Date.now()
        }));
      }

      startIdx = jpegEnd + 2;
    }

    // Manter apenas dados após o último frame processado
    frameBuffer = frameBuffer.slice(startIdx);
  });

  // Log de erros do FFmpeg
  ffmpeg.stderr.on('data', (data) => {
    const message = data.toString();
    // Apenas log de erros importantes, não todos os outputs do FFmpeg
    if (message.includes('error') || message.includes('Error')) {
      console.error('FFmpeg Error:', message);
    }
  });

  ffmpeg.on('close', (code) => {
    console.log(`Stream FFmpeg encerrado com código ${code}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Stream encerrado'
      }));
    }
  });

  return ffmpeg;
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket estabelecida');
  let currentStream = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'start' && data.rtspUrl) {
        // Parar stream anterior se existir
        if (currentStream) {
          currentStream.kill();
        }

        // Validar URL RTSP
        if (!data.rtspUrl.startsWith('rtsp://') && !data.rtspUrl.startsWith('http://')) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'URL inválida. Use rtsp:// ou http://'
          }));
          return;
        }

        // Iniciar novo stream
        currentStream = startRtspStream(data.rtspUrl, ws);
        activeStreams.set(ws, currentStream);

        ws.send(JSON.stringify({
          type: 'started',
          message: 'Stream iniciado com sucesso'
        }));
      } else if (data.type === 'stop') {
        if (currentStream) {
          currentStream.kill();
          currentStream = null;
          activeStreams.delete(ws);
          
          ws.send(JSON.stringify({
            type: 'stopped',
            message: 'Stream parado'
          }));
        }
      }
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Erro ao processar comando'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Conexão WebSocket fechada');
    if (currentStream) {
      currentStream.kill();
      activeStreams.delete(ws);
    }
  });

  ws.on('error', (error) => {
    console.error('Erro WebSocket:', error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    activeStreams: activeStreams.size,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint para verificar FFmpeg
app.get('/test-ffmpeg', (req, res) => {
  const ffmpeg = spawn('ffmpeg', ['-version']);
  let output = '';

  ffmpeg.stdout.on('data', (data) => {
    output += data.toString();
  });

  ffmpeg.on('close', (code) => {
    if (code === 0) {
      res.json({
        status: 'ok',
        message: 'FFmpeg está instalado e funcionando',
        version: output.split('\n')[0]
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'FFmpeg não está funcionando corretamente'
      });
    }
  });

  ffmpeg.on('error', (err) => {
    res.status(500).json({
      status: 'error',
      message: 'FFmpeg não está instalado',
      error: err.message
    });
  });
});

const PORT = process.env.PORT || 9999;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Servidor Proxy RTSP iniciado com sucesso!              ║
║                                                           ║
║   WebSocket: ws://localhost:${PORT}                        ║
║   Health Check: http://localhost:${PORT}/health            ║
║   Test FFmpeg: http://localhost:${PORT}/test-ffmpeg        ║
║                                                           ║
║   Aguardando conexões...                                  ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando streams...');
  activeStreams.forEach((stream) => {
    stream.kill();
  });
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});
