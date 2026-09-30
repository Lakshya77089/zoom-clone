#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/zoom-clone}"
BACKEND_PORT="${ZOOM_BACKEND_PORT:-8750}"
FRONTEND_PORT="${ZOOM_FRONTEND_PORT:-3700}"
RELEASE="$APP_DIR/release.tgz"

cd "$APP_DIR"
rm -rf incoming
mkdir incoming
tar -xzf "$RELEASE" -C incoming

mkdir -p backend
rm -rf backend/app.previous
if [ -d backend/app ]; then mv backend/app backend/app.previous; fi
cp -r incoming/backend/app backend/app
cp incoming/backend/requirements.txt backend/requirements.txt
if [ ! -d backend/.venv ]; then python3 -m venv backend/.venv; fi
backend/.venv/bin/pip install --quiet --disable-pip-version-check -r backend/requirements.txt

rm -rf frontend.previous
if [ -d frontend ]; then mv frontend frontend.previous; fi
mv incoming/frontend frontend
cp incoming/deploy/ecosystem.config.cjs ecosystem.config.cjs

reload() {
  pm2 startOrReload ecosystem.config.cjs --update-env >/dev/null
}

healthy() {
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:$BACKEND_PORT/api/users/me" >/dev/null && curl -fsS "http://127.0.0.1:$FRONTEND_PORT/" >/dev/null; then
      return 0
    fi
    sleep 2
  done
  return 1
}

reload
if healthy; then
  pm2 save >/dev/null
  rm -rf incoming "$RELEASE"
  echo "Deployed $(cat frontend/REVISION 2>/dev/null || echo unknown)"
  exit 0
fi

echo "Health check failed, rolling back" >&2
if [ -d frontend.previous ]; then rm -rf frontend && mv frontend.previous frontend; fi
if [ -d backend/app.previous ]; then rm -rf backend/app && mv backend/app.previous backend/app; fi
reload
exit 1
