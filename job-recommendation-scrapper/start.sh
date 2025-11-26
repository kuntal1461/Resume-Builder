#!/bin/bash

# Job Recommendation Scraper - Quick Start Script

echo "🚀 Starting Job Recommendation Scraper..."
echo ""

# Check if Docker is installed
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose found"
    echo "Starting all services with Docker Compose..."
    docker-compose up -d
    echo ""
    echo "Services started!"
    echo "- Core API: http://localhost:8000"
    echo "- Web API: http://localhost:3000"
    echo "- Frontend: http://localhost:5173"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
else
    echo "⚠️  Docker Compose not found. Starting services manually..."
    echo ""
    
    # Check prerequisites
    echo "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 not found. Please install Python 3.9+"
        exit 1
    fi
    echo "✅ Python found"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    echo "✅ Node.js found"
    
    # Check MongoDB
    if ! command -v mongod &> /dev/null; then
        echo "⚠️  MongoDB not found. Please install and start MongoDB"
    else
        echo "✅ MongoDB found"
    fi
    
    # Check Redis
    if ! command -v redis-server &> /dev/null; then
        echo "⚠️  Redis not found. Please install and start Redis"
    else
        echo "✅ Redis found"
    fi
    
    echo ""
    echo "Starting services..."
    echo ""
    
    # Start Core API
    echo "📦 Starting Core API..."
    cd core
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt > /dev/null 2>&1
    python main.py &
    CORE_PID=$!
    cd ..
    
    # Start Celery Worker
    echo "⚙️  Starting Celery Worker..."
    cd core
    celery -A tasks worker --loglevel=info &
    CELERY_PID=$!
    cd ..
    
    # Start Web API
    echo "🌐 Starting Web API..."
    cd web
    if [ ! -d "node_modules" ]; then
        echo "Installing Web API dependencies..."
        npm install > /dev/null 2>&1
    fi
    npm run dev &
    WEB_PID=$!
    cd ..
    
    # Start Frontend
    echo "💻 Starting Frontend..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing Frontend dependencies..."
        npm install > /dev/null 2>&1
    fi
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "✅ All services started!"
    echo ""
    echo "Services:"
    echo "- Core API: http://localhost:8000"
    echo "- Web API: http://localhost:3000"
    echo "- Frontend: http://localhost:5173"
    echo ""
    echo "Process IDs:"
    echo "- Core: $CORE_PID"
    echo "- Celery: $CELERY_PID"
    echo "- Web: $WEB_PID"
    echo "- Frontend: $FRONTEND_PID"
    echo ""
    echo "To stop all services, run: kill $CORE_PID $CELERY_PID $WEB_PID $FRONTEND_PID"
fi
