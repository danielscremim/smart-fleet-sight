@echo off
echo ==========================================
echo   Instalacao do Servidor Proxy RTSP
echo ==========================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale Node.js em https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js instalado

REM Verificar FFmpeg
echo.
echo [2/4] Verificando FFmpeg...
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo AVISO: FFmpeg nao encontrado!
    echo Por favor, instale FFmpeg:
    echo 1. Baixe em: https://www.gyan.dev/ffmpeg/builds/
    echo 2. Extraia o arquivo
    echo 3. Adicione o diretorio bin ao PATH do Windows
    echo 4. Reinicie o terminal e execute este script novamente
    pause
    exit /b 1
)
echo OK: FFmpeg instalado

REM Instalar dependencias
echo.
echo [3/4] Instalando dependencias Node.js...
call npm install express ws cors
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo OK: Dependencias instaladas

REM Iniciar servidor
echo.
echo [4/4] Iniciando servidor proxy RTSP...
echo.
echo ==========================================
echo   Servidor iniciado!
echo   Pressione Ctrl+C para parar
echo ==========================================
echo.

node rtsp-proxy-server.js
