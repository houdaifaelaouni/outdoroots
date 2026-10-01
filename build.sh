#!/usr/bin/env bash
set -e

echo "=== Outdooroots Build Script for Render ==="

# Install backend dependencies
echo "--- Installing backend dependencies ---"
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies and build
echo "--- Installing frontend dependencies ---"
cd frontend

# Set the backend URL for the React build
# On Render, RENDER_EXTERNAL_URL is auto-set to your service URL
if [ -n "$RENDER_EXTERNAL_URL" ]; then
  export REACT_APP_BACKEND_URL="$RENDER_EXTERNAL_URL"
elif [ -n "$REACT_APP_BACKEND_URL" ]; then
  export REACT_APP_BACKEND_URL="$REACT_APP_BACKEND_URL"
else
  export REACT_APP_BACKEND_URL=""
fi

echo "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL"

yarn install --frozen-lockfile 2>/dev/null || yarn install
yarn build

cd ..

# Copy the React build into backend/static for FastAPI to serve
echo "--- Copying frontend build to backend/static ---"
rm -rf backend/static
cp -r frontend/build backend/static

echo "=== Build complete ==="
