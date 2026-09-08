@echo off
chcp 65001 >nul
cd /d "%~dp0"
node runtime\emet.mjs status
pause
