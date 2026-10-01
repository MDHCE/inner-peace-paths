#!/usr/bin/env bash
# Read-only survey of how the site is deployed, plus a backup of the live
# content. Changes nothing about the running app.
#
# Run on the server:  bash scripts/server-inspect.sh
#
# Produces ~/rendelo-backup-<timestamp>/ containing the current therapists.json
# and site-content.json — the authoritative copy of both sites' content, which
# may be newer than what is committed in git.

set -uo pipefail

STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP="$HOME/rendelo-backup-$STAMP"

echo "=============================================="
echo " Rendelo deployment survey — $STAMP"
echo "=============================================="

echo
echo "--- containers ---"
if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found — is the app run another way? (systemd / pm2 / bare node)"
  echo
  echo "systemd units mentioning node:"
  systemctl list-units --type=service --no-pager 2>/dev/null | grep -iE 'node|rendelo|zuglo|gellert' || echo "  none"
  echo "pm2:"; command -v pm2 >/dev/null && pm2 list || echo "  not installed"
  echo "listening ports:"; ss -tlnp 2>/dev/null | grep -E ':(3001|80|443)' || echo "  none seen"
  exit 0
fi

docker ps --format '{{.ID}}  {{.Image}}  {{.Names}}  {{.Status}}  {{.Ports}}'

CID=$(docker ps -q --filter "publish=3001" | head -1)
[ -z "$CID" ] && CID=$(docker ps --format '{{.ID}} {{.Image}}' | grep -iE 'rendelo|inner-peace|zuglo|gellert' | awk '{print $1}' | head -1)
[ -z "$CID" ] && CID=$(docker ps -q | head -1)

if [ -z "$CID" ]; then
  echo "No running container found."
  exit 1
fi

NAME=$(docker inspect -f '{{.Name}}' "$CID" | tr -d '/')
echo
echo "--- inspecting: $NAME ($CID) ---"

echo
echo "--- volume mounts (does /app/data persist?) ---"
docker inspect -f '{{range .Mounts}}{{.Type}}  {{.Source}} -> {{.Destination}}{{println}}{{end}}' "$CID"
docker inspect -f '{{range .Mounts}}{{.Destination}}{{println}}{{end}}' "$CID" | grep -q '^/app/data$' \
  && echo ">> /app/data IS mounted — admin edits already survive redeploys." \
  || echo ">> /app/data is NOT mounted — admin edits are LOST on every redeploy. This needs fixing."

echo
echo "--- admin auth env (values masked) ---"
for v in ADMIN_USER ADMIN_PASSWORD_HASH SESSION_SECRET DATA_DIR SEED_DIR NODE_ENV; do
  val=$(docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$CID" | grep "^$v=" | cut -d= -f2-)
  if [ -z "$val" ]; then echo "  $v = (unset)"
  elif [ "$v" = "ADMIN_PASSWORD_HASH" ] || [ "$v" = "SESSION_SECRET" ]; then echo "  $v = (set, ${#val} chars)"
  else echo "  $v = $val"; fi
done

echo
echo "--- compose files on disk ---"
find / -name 'docker-compose*.y*ml' -o -name 'compose*.y*ml' 2>/dev/null \
  | grep -v -e '/node_modules/' -e '/var/lib/docker/' | head -10 || echo "  none found"

echo
echo "--- is the admin currently exposed? ---"
printf "  /api/admin/therapists -> "
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/api/admin/therapists 2>/dev/null || echo "(no local answer)"
echo "  (200 = wide open, 401 = protected)"

echo
echo "--- backing up live content to $BACKUP ---"
mkdir -p "$BACKUP"
for f in therapists.json site-content.json social-posts.json gellert-social-posts.json; do
  if docker cp "$CID:/app/data/$f" "$BACKUP/$f" 2>/dev/null; then
    echo "  saved $f ($(wc -c < "$BACKUP/$f") bytes)"
  else
    echo "  $f not found in container"
  fi
done
if docker cp "$CID:/app/data/uploads" "$BACKUP/uploads" 2>/dev/null; then
  echo "  saved uploads/ ($(find "$BACKUP/uploads" -type f 2>/dev/null | wc -l) files)"
fi

echo
echo "=============================================="
echo " Backup: $BACKUP"
echo " Send the output above (it contains no secrets) to continue."
echo "=============================================="
