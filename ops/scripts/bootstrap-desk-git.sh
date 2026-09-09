#!/usr/bin/env bash
# Bootstrap / convert aztodev-desk into a git mirror of private AZToDev-HQ.
# Run ONCE on ChemiCloud as aztodevc. Never touches customer sites.
set -euo pipefail
DESK="${DESK_DIR:-/home/aztodevc/aztodev-desk}"
REPO_URL="${HQ_GIT_URL:-https://github.com/ZionAmar/AZToDev-HQ.git}"
BACKUP="${DESK}.bak-$(date +%Y%m%d%H%M%S)"

export PATH="/opt/alt/alt-nodejs22/root/usr/bin:$PATH"

if [ ! -d "$DESK" ]; then
  echo "missing desk: $DESK" >&2
  exit 1
fi

cd "$DESK"
if [ -d .git ]; then
  echo "already a git repo"
  git remote -v
  git pull --ff-only origin main || git pull --ff-only origin HEAD || true
  exit 0
fi

echo "Backing up live desk to $BACKUP (keeps .env / runtime)"
mkdir -p "$BACKUP"
# Preserve secrets + runtime only into backup root; full tree also kept
cp -a .env "$BACKUP/.env" 2>/dev/null || true
cp -a ops/runtime "$BACKUP/ops-runtime" 2>/dev/null || true
cp -a logs "$BACKUP/logs" 2>/dev/null || true

TMP="${DESK}.git-new"
rm -rf "$TMP"
git clone --depth 50 "$REPO_URL" "$TMP"

# Restore desk-local secrets & runtime into the clone
[ -f "$BACKUP/.env" ] && cp -a "$BACKUP/.env" "$TMP/.env"
mkdir -p "$TMP/ops"
[ -d "$BACKUP/ops-runtime" ] && cp -a "$BACKUP/ops-runtime" "$TMP/ops/runtime"
[ -d "$BACKUP/logs" ] && cp -a "$BACKUP/logs" "$TMP/logs"

# Swap
mv "$DESK" "${DESK}.pre-git-$BACKUP"
mv "$TMP" "$DESK"
cd "$DESK"
echo "Desk is now a git mirror. Restart with: bash restart.sh"
curl -sS --max-time 5 http://127.0.0.1:8788/health | head -c 120 || true
echo
