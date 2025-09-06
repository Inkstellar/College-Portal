#!/bin/bash

# Shell script to start API server, host, remote, and admin apps
# This script starts the API server first, then the remote app, admin app, then the host app

echo "Starting College Portal Applications..."

# Function to cleanup background processes
cleanup() {
    echo "Stopping applications..."
    kill $API_PID $REMOTE_PID $ADMIN_PID $HOST_PID 2>/dev/null
    echo "Applications stopped."
    exit
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start API server in background
echo "Starting API server on port 5001..."
cd api-server
npm start &
API_PID=$!
cd ..

# Wait a moment for API server to start
sleep 3

# Start remote app in background
echo "Building and starting remote app on port 5003..."
cd remote-app
npm run build
npm run preview --port 5003 &
REMOTE_PID=$!
cd ..

# Wait a moment for remote app to start
sleep 3

# Start admin app in background
echo "Building and starting admin app on port 5004..."
cd admin-app
npm run build
npm run preview --port 5004 &
ADMIN_PID=$!
cd ..

# Wait a moment for admin app to start
sleep 3

# Start host app in background
echo "Starting host app on port 5173..."
cd host-app
npm run dev &
HOST_PID=$!
cd ..

echo "All applications are starting up..."
echo "API Server: http://localhost:5001"
echo "Remote app: http://localhost:5003"
echo "Admin app: http://localhost:5004"
echo "Host app: http://localhost:5173"
echo "Press Ctrl+C to stop all applications"

# Keep the script running to maintain the background processes
wait
