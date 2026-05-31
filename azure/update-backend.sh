#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
BACKEND_ZIP="$SCRIPT_DIR/backend.zip"
TEMP_DEPLOY_DIR="$BACKEND_DIR/.azure-deploy"

npm --prefix "$BACKEND_DIR" ci
npm --prefix "$BACKEND_DIR" run build

rm -rf "$TEMP_DEPLOY_DIR"
mkdir -p "$TEMP_DEPLOY_DIR"

cp -r "$BACKEND_DIR/dist" "$TEMP_DEPLOY_DIR/dist"
cp "$BACKEND_DIR/package.json" "$TEMP_DEPLOY_DIR/package.json"
cp "$BACKEND_DIR/package-lock.json" "$TEMP_DEPLOY_DIR/package-lock.json"

npm --prefix "$TEMP_DEPLOY_DIR" ci --omit=dev

mkdir -p "$TEMP_DEPLOY_DIR/logs"

rm -f "$BACKEND_ZIP"
(cd "$TEMP_DEPLOY_DIR" && zip -qr "$BACKEND_ZIP" .)
rm -rf "$TEMP_DEPLOY_DIR"

RESOURCE_GROUP_NAME="$(terraform -chdir="$SCRIPT_DIR" output -raw resource_group_name)"
BACKEND_WEB_APP_NAME="$(terraform -chdir="$SCRIPT_DIR" output -raw backend_web_app_name)"

az webapp deploy \
  --resource-group "$RESOURCE_GROUP_NAME" \
  --name "$BACKEND_WEB_APP_NAME" \
  --src-path "$BACKEND_ZIP" \
  --type zip
