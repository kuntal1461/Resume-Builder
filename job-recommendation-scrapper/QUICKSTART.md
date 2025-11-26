# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Option 1: Docker (Recommended)

```bash
# 1. Start all services
docker-compose up -d

# 2. Open your browser
# Frontend: http://localhost:5173
# Web API: http://localhost:3000
# Core API: http://localhost:8000

# 3. Stop services
docker-compose down
```

### Option 2: Manual Setup

```bash
# 1. Make start script executable
chmod +x start.sh

# 2. Run the start script
./start.sh

# 3. Access the application
# Frontend: http://localhost:5173
```

---

## 📋 Prerequisites

### For Docker:
- Docker
- Docker Compose

### For Manual Setup:
- Python 3.9+
- Node.js 18+
- MongoDB
- Redis

---

## 🎯 Quick Test

### 1. Submit a Scraping Job

Open the frontend at `http://localhost:5173` and:
1. Enter a URL (e.g., `https://example.com`)
2. Select scraper type
3. Click "Submit Scrape Job"

### 2. Using API Directly

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "scraper_type": "requests"
  }'
```

### 3. Check Job Status

```bash
# Replace JOB_ID with the ID from step 1
curl http://localhost:3000/api/jobs/JOB_ID
```

---

## 📁 Project Structure

```
job-recommendation-scrapper/
├── core/          # Python scraping engine
├── web/           # Node.js API layer
├── frontend/      # React UI
├── docker-compose.yml
├── start.sh
├── README.md
├── API.md
└── STRUCTURE.md
```

---

## 🔧 Configuration

### Core (.env)
Located in `core/.env`:
```env
API_HOST=0.0.0.0
API_PORT=8000
REDIS_HOST=localhost
CELERY_BROKER_URL=redis://localhost:6379/0
```

### Web (.env)
Located in `web/.env`:
```env
PORT=3000
CORE_API_URL=http://localhost:8000
MONGODB_URI=mongodb://localhost:27017/job_scraper
```

### Frontend (.env)
Located in `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🛠️ Common Commands

### Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build

# View running containers
docker-compose ps
```

### Manual

```bash
# Core API
cd core
python main.py

# Celery Worker
cd core
celery -A tasks worker --loglevel=info

# Web API
cd web
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Web API | 3000 | http://localhost:3000 |
| Core API | 8000 | http://localhost:8000 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Redis | 6379 | redis://localhost:6379 |

---

## 🎨 Features

✅ **Multiple Scraper Types**
- Requests (fast, no JS)
- Selenium (full browser)
- Playwright (modern)

✅ **Async Processing**
- Celery task queue
- Redis message broker
- Priority-based scheduling

✅ **Modern UI**
- Dark theme
- Animated gradients
- Real-time updates
- Responsive design

✅ **API Features**
- RESTful endpoints
- Bulk operations
- Pagination
- Filtering
- Rate limiting

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 PID
```

### MongoDB Connection Error

```bash
# Start MongoDB
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Redis Connection Error

```bash
# Start Redis
brew services start redis
# or
sudo systemctl start redis
```

### Python Dependencies Error

```bash
cd core
pip install -r requirements.txt
```

### Node Dependencies Error

```bash
cd web  # or frontend
npm install
```

---

## 📚 Documentation

- **README.md** - Project overview and setup
- **API.md** - Complete API documentation
- **STRUCTURE.md** - Project structure details
- **QUICKSTART.md** - This file

---

## 🤝 Need Help?

1. Check the logs:
   - Docker: `docker-compose logs -f`
   - Manual: Check terminal output

2. Verify services are running:
   - `docker-compose ps` (Docker)
   - `ps aux | grep python` (Manual)

3. Check environment variables:
   - Ensure all `.env` files are configured

---

## 🎉 Next Steps

1. **Customize Scrapers**: Edit `core/scrapers.py`
2. **Add New Endpoints**: Edit `web/routes.js`
3. **Enhance UI**: Edit `frontend/src/components/`
4. **Add Authentication**: Implement API keys
5. **Deploy to Production**: Use Docker Compose with production configs

---

## 📝 Example Workflow

1. **Submit Job**: User submits URL via frontend
2. **Queue Task**: Web API forwards to Core API
3. **Process**: Celery worker picks up task
4. **Scrape**: Scraper extracts data
5. **Store**: Result saved to MongoDB
6. **Display**: Frontend shows updated status

---

Happy Scraping! 🚀
