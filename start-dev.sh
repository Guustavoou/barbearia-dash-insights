#!/bin/bash

# Unclic Development Startup Script

echo "🚀 Starting Unclic Development Environment..."

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check if required ports are available
echo "🔍 Checking ports..."
check_port 3001 || exit 1
check_port 5173 || exit 1

# Start backend
echo "🔧 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend health
echo "🏥 Testing backend health..."
for i in {1..10}; do
    if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Backend failed to start properly"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    echo "⏳ Attempt $i/10 - waiting for backend..."
    sleep 2
done

# Start frontend
echo "🎨 Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

echo "
🎉 Unclic Development Environment Started!

📊 Backend:  http://localhost:3001
   ├── API:     http://localhost:3001/api
   ├── Health:  http://localhost:3001/api/health
   └── Docs:    http://localhost:3001

🎨 Frontend: http://localhost:5173

💡 Press Ctrl+C to stop both servers

Backend PID: $BACKEND_PID
Frontend PID: $FRONTEND_PID
"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Cleanup completed"
    exit 0
}

# Set trap to cleanup on script termination
trap cleanup SIGINT SIGTERM

# Keep script running
wait
