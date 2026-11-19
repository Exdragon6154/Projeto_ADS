
@echo off
setlocal
title Diagnostico Vitrine Pro V24

echo ==========================================
echo   DIAGNOSTICO - VITRINE PRO V24
echo ==========================================
echo.

cd /d "%~dp0backend"
if errorlevel 1 (
  echo ERRO: Nao foi possivel localizar a pasta backend.
  pause
  exit /b 1
)

echo [1/4] Verificando Node.js...
where node
if errorlevel 1 (
  echo ERRO: Node.js nao foi encontrado.
  pause
  exit /b 1
)
node --version
echo.

echo [2/4] Verificando npm...
where npm
if errorlevel 1 (
  echo ERRO: npm nao foi encontrado.
  pause
  exit /b 1
)
npm --version
echo.

echo [3/4] Verificando dependencias...
if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias.
    pause
    exit /b 1
  )
) else (
  echo Dependencias encontradas.
)
echo.

echo [4/4] Iniciando o servidor...
echo Se houver erro, ele aparecera abaixo.
echo Para encerrar, pressione Ctrl+C.
echo.

node server.js

echo.
echo O servidor foi encerrado.
pause
