# ChemiCloud — AZToDev thin desk

Host: `cvps1645.serverhostgroup.com`  
IP: `178.79.149.231`  
User: `aztodevc`  
Port: `1988`

**Live sites are sacred.** Desk lives only in `/home/aztodevc/aztodev-desk`.  
Never `/var/www`, never `public_html`, never nestube/workclock/pulsechannel.

Do not put SSH passwords, `.ppk`, or `.env` in git or chat.

```
ssh -p 1988 -i ops/secrets/aztodev-cpanel.nopass aztodevc@178.79.149.231
```

Run: `PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH`  
`HQ_CLOUD_ONLY=1` — no local Cursor on the VPS.  
Listen: `127.0.0.1:8788` (not public).

Swap is often full; confirm `free -m` (available) before start.
