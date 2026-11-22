#!/usr/bin/env bash
set -e

echo "=== Outdooroots build ==="
npm install --include=dev
npm run build
echo "=== Build complete (frontend in dist/) ==="
