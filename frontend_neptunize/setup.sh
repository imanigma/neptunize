#!/bin/bash

echo "🎙️ Setting up Frontend Neptunize..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend_neptunize directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 Ready to start development!"
    echo ""
    echo "To start the development server, run:"
    echo "  npm run dev"
    echo ""
    echo "Then open http://localhost:3000 in your browser"
    echo ""
    echo "For mobile testing, use your local IP:"
    echo "  http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):3000"
    echo ""
    echo "📱 The app is optimized for mobile devices!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
