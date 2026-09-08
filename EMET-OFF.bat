@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Turning EMET OFF (saving exact checkpoint)...
node runtime\emet.mjs off
timeout /t 2 /nobreak >nul
node runtime\emet.mjs status
echo.
echo Saved. Next ON will continue from this point.
pause
