#!/bin/bash

echo "🚀 Starting BB84 QKD Demo for Hackathon..."
echo

echo "📦 Installing dependencies..."
npm install
cd frontend && npm install
cd ../backend && pip install -r requirements.txt
cd ..

echo
echo "🎯 Starting services..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo

echo "🌐 HACKATHON SETUP:"
echo "1. Note your IP address:"
ifconfig | grep inet
echo
echo "2. Share these URLs with other laptops:"
echo "   Alice: http://[YOUR_IP]:3000?user=alice"
echo "   Bob:   http://[YOUR_IP]:3000?user=bob"
echo "   Eve:   http://[YOUR_IP]:3000?user=eve"
echo

echo "Starting backend server..."
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "✅ BB84 QKD Demo is running!"
echo
echo "🌐 Access the interfaces:"
echo "  Alice: http://localhost:3000?user=alice"
echo "  Bob:   http://localhost:3000?user=bob"
echo "  Eve:   http://localhost:3000?user=eve"
echo
echo "🔥 HACKATHON READY! Share your IP with other laptops."
echo
echo "Press Ctrl+C to stop all services..."

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
