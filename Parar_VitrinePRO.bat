@echo off
setlocal
set "PORT=3000"
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
  set "PID=%%P"
  goto :found
)
echo Vitrine Pro nao esta em execucao na porta %PORT%.
pause
exit /b 0
:found
echo Encerrando somente o processo que esta escutando na porta %PORT% (PID %PID%)...
taskkill /F /PID %PID% >nul 2>&1
if errorlevel 1 (echo Nao foi possivel encerrar o processo.) else (echo Vitrine Pro encerrada.)
pause
