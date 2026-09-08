@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Turning EMET ON (resume from last checkpoint)...
node runtime\emet.mjs on
timeout /t 2 /nobreak >nul
node runtime\emet.mjs status
echo.
echo Dashboard: http://localhost:8787
echo (window closes in 3s — EMET keeps running in background)
timeout /t 3 /nobreak >nul
