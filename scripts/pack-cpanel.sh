#!/usr/bin/env bash
set -euo pipefail

# Build and package the app for cPanel on your local machine.
# Usage (locally): ./scripts/pack-cpanel.sh

echo "1/6: Installing clean deps (ci)..."
npm ci

echo "2/6: Building Next.js app (standalone)..."
npm run build

echo "3/6: Verify standalone output exists..."
if [ ! -d ".next/standalone" ]; then
  echo "Error: .next/standalone not found. Ensure next.config.ts has output: 'standalone' and the build succeeded." >&2
  exit 1
fi

TMP_DIR="deploy_tmp"
ZIP_NAME="deploy.zip"

echo "4/6: Preparing package contents in $TMP_DIR..."
rm -rf "$TMP_DIR" "$ZIP_NAME"
mkdir -p "$TMP_DIR"

# Copy standalone server bundle (includes minimal node_modules and server.js)
cp -r .next/standalone/* "$TMP_DIR/"

# Copy static assets required at runtime
if [ -d ".next/static" ]; then
  mkdir -p "$TMP_DIR/.next"
  cp -r .next/static "$TMP_DIR/.next/"
fi

if [ -d "public" ]; then
  cp -r public "$TMP_DIR/public"
fi

echo "5/6: Ensure package.json exists for runtime (copied for info)..."
cp package.json "$TMP_DIR/package.json"

echo "6/6: Creating $ZIP_NAME..."
cd "$TMP_DIR"
zip -r ../"$ZIP_NAME" . >/dev/null
cd ..

rm -rf "$TMP_DIR"

echo "Done. Upload $ZIP_NAME to cPanel File Manager and extract into your app root."
echo "Start command (cPanel): node server.js  # server.js within the extracted bundle"
