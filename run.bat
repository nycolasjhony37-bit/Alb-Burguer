@echo off
echo Iniciando servidor local para Alb'Burguer...
echo.

:: Tenta iniciar com Python se disponível
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Usando Python para hospedar o site...
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo Python nao encontrado. Abrindo arquivo index.html diretamente...
    start index.html
)

pause
