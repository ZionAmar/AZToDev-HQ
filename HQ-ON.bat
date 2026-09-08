@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo AZToDev HQ starting...
node hq\index.mjs
