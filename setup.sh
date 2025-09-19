#!/bin/bash

echo "🚀 Starting BB84 QKD Demo..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo "✅ All dependencies installed successfully!"
echo ""
echo "🎯 To start the demo:"
echo "1. Run: npm run dev"
echo "2. Open Alice: http://localhost:3000?user=alice"
echo "3. Open Bob: http://localhost:3000?user=bob"
echo "4. Open Eve: http://localhost:3000?user=eve"
echo ""
echo "🌐 For multi-laptop demo:"
echo "1. Start server on one machine"
echo "2. Access from other laptops: http://[server-ip]:3000?user=[role]"
echo ""
echo "🔬 BB84 QKD Demo Ready!"
