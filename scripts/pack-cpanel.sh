#!/usr/bin/env bash
set -euo pipefail

# Build and package the app for cPanel on your local machine.
# Usage (locally): ./scripts/pack-cpanel.sh

echo "1/5: Installing clean deps (ci)..."
npm ci

echo "2/5: Building Next.js app..."
npm run build

echo "3/5: Pruning dev dependencies to keep only production modules..."
npm prune --production

TMP_DIR="deploy_tmp"
ZIP_NAME="deploy.zip"

echo "4/5: Preparing package contents in $TMP_DIR..."
rm -rf "$TMP_DIR" "$ZIP_NAME"
mkdir -p "$TMP_DIR"

# Copy runtime files
cp package.json server.js "$TMP_DIR/"

# Copy built output and public/static assets if present
if [ -d ".next" ]; then
  cp -r .next "$TMP_DIR/.next"
fi
if [ -d "public" ]; then
  cp -r public "$TMP_DIR/public"
fi

# Copy production node_modules
if [ -d "node_modules" ]; then
  cp -r node_modules "$TMP_DIR/node_modules"
fi

echo "5/5: Creating $ZIP_NAME..."
cd "$TMP_DIR"
zip -r ../"$ZIP_NAME" . >/dev/null
cd ..

rm -rf "$TMP_DIR"

echo "Done. Upload $ZIP_NAME to cPanel File Manager and extract into your app root."
echo "Then in cPanel: ensure Node >=18, set startup file to server.js, and start the app."
