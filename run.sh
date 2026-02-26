#!/bin/bash

# Festronix Full Stack Startup Script

echo "🚀 Starting Festronix Full Stack Application"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Backend already running on port 8000${NC}"
else
    echo -e "${BLUE}📦 Starting Backend...${NC}"
    cd backend
    
    # Activate virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python -m venv venv
    fi
    
    source venv/bin/activate
    
    # Install dependencies if needed
    pip install -q -r requirements.txt
    
    # Run migrations
    echo "Running migrations..."
    python manage.py migrate --quiet
    
    # Start server in background
    python manage.py runserver 0.0.0.0:8000 > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    cd ..
fi

# Check if frontend is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 5173${NC}"
else
    echo -e "${BLUE}📦 Starting Frontend...${NC}"
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install -q
    fi
    
    # Copy .env if it doesn't exist
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo "Created .env file"
    fi
    
    # Start frontend in background
    npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
    cd ..
fi

echo ""
echo -e "${GREEN}✅ Festronix is running!${NC}"
echo ""
echo "📍 Access the application:"
echo -e "   Frontend:  ${BLUE}http://localhost:5173${NC}"
echo -e "   Backend:   ${BLUE}http://localhost:8000/api${NC}"
echo -e "   Admin:     ${BLUE}http://localhost:8000/admin${NC}"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email:    admin@example.com"
echo "   Password: admin123"
echo ""
echo "📝 View logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Keep script running
wait
