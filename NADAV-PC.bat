@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo AZToDev Nadav PC worker (no Telegram poll)
node hq\nadav-pc-worker.mjs
