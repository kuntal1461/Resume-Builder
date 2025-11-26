# Job Recommendation Scraper - Project Summary
> **Current Status**: Core API Only (Python/FastAPI)

## 🏗️ Architecture

The project is now a focused **Python-based Scraping Microservice** that integrates with your existing infrastructure.

```
┌─────────────────────────────────────┐
│   Your Existing Infrastructure      │
│   (MySQL, Redis, etc.)              │
└──────────────────┬──────────────────┘
                   │
           ┌───────▼───────┐
           │ Scraper Core  │
           │ API (FastAPI) │
           │ Port: 8200    │
           └───────┬───────┘
                   │
           ┌───────▼───────┐
           │ Celery Worker │
           │ (Async Jobs)  │
           └───────────────┘
```

## 📦 Components

### 1. **Core (Python)**
- **Framework**: FastAPI
- **Task Queue**: Celery + Redis
- **Database**: SQLAlchemy (MySQL)
- **Scrapers**: Requests, Selenium, Playwright
- **Structure**:
    - `core/entity/`: Database Models
    - `core/repository/`: Data Access
    - `core/service/`: Business Logic
    - `core/enums/`: Enumerations
    - `core/constants/`: Configuration Constants

### 2. **Frontend**
- *Empty directory reserved for future use.*

## 🚀 How to Run

```bash
# Start the scraper service
docker-compose up -d scraper-core scraper-worker redis
```

## 🔗 API Endpoints (Port 8200)

- `POST /api/scrape`: Submit a new scraping job
- `GET /api/job/{job_id}`: Check job status
- `POST /api/job/{job_id}/cancel`: Cancel a job

## 🛠️ Configuration

Configuration is handled via the root `.env` file and `backend-common`.
