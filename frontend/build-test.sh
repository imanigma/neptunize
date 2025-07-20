#!/bin/bash
echo "=== Build Test Script ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""
echo "=== Installing dependencies ==="
npm ci
echo ""
echo "=== Building application ==="
npm run build
echo ""
echo "=== Build completed ==="
