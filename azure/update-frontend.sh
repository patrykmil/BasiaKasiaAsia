#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
FRONTEND_ZIP="$SCRIPT_DIR/frontend.zip"

BACKEND_WEB_APP_URL="$(terraform -chdir="$SCRIPT_DIR" output -raw backend_web_app_url)"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-$BACKEND_WEB_APP_URL}"

VITE_API_BASE_URL="$VITE_API_BASE_URL" npm --prefix "$FRONTEND_DIR" run build
rm -f "$FRONTEND_ZIP"
(cd "$FRONTEND_DIR/dist" && zip -qr "$FRONTEND_ZIP" .)

RESOURCE_GROUP_NAME="$(terraform -chdir="$SCRIPT_DIR" output -raw resource_group_name)"
FRONTEND_WEB_APP_NAME="$(terraform -chdir="$SCRIPT_DIR" output -raw frontend_web_app_name)"

az webapp deploy \
  --resource-group "$RESOURCE_GROUP_NAME" \
  --name "$FRONTEND_WEB_APP_NAME" \
  --src-path "$FRONTEND_ZIP" \
  --type zip
