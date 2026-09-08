#!/bin/bash
# Restart ONLY the thin desk on 127.0.0.1:8788. Never apache/mysql/Passenger.
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH
cd /home/aztodevc/aztodev-desk
mkdir -p logs
if [ -f logs/hq.pid ]; then
  pid=$(cat logs/hq.pid)
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    kill "$pid" || true
    sleep 1
  fi
fi
# only our health port
fuser -k 8788/tcp >/dev/null 2>&1 || true
sleep 1
nohup node hq/index.mjs >> logs/hq.log 2>&1 &
echo $! > logs/hq.pid
sleep 3
echo "pid=$(cat logs/hq.pid)"
curl -sS --max-time 5 http://127.0.0.1:8788/health | head -c 220
echo
