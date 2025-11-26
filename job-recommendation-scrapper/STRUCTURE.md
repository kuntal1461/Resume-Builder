# Project Structure

```
job-recommendation-scrapper/
│
├── core/                           # Python Scraping Engine
│   ├── main.py                     # FastAPI application
│   ├── config.py                   # Configuration management
│   ├── models.py                   # Pydantic models
│   ├── scrapers.py                 # Scraper implementations
│   ├── tasks.py                    # Celery tasks
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example               # Environment template
│   └── Dockerfile                  # Docker configuration
│
├── web/                            # Node.js API Layer
│   ├── server.js                   # Express application
│   ├── config.js                   # Configuration
│   ├── models.js                   # Mongoose models
│   ├── routes.js                   # API routes
│   ├── logger.js                   # Winston logger
│   ├── package.json                # Node dependencies
│   └── Dockerfile                  # Docker configuration
│
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── App.tsx                 # Main component
│   │   ├── App.css                 # App styles
│   │   ├── index.css               # Global styles
│   │   ├── api.ts                  # API client
│   │   ├── components/
│   │   │   ├── ScrapeForm.tsx      # Form component
│   │   │   ├── ScrapeForm.css      # Form styles
│   │   │   ├── JobsList.tsx        # Jobs list component
│   │   │   └── JobsList.css        # Jobs list styles
│   │   └── main.tsx                # Entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Node dependencies
│   ├── vite.config.ts              # Vite configuration
│   └── Dockerfile                  # Docker configuration
│
├── docker-compose.yml              # Docker Compose configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # Documentation
├── start.sh                        # Quick start script
└── STRUCTURE.md                    # This file

```

## Component Details

### Core (Python)
- **FastAPI**: High-performance async web framework
- **Celery**: Distributed task queue for async scraping
- **Scrapers**: Multiple scraper types (Requests, Selenium, Playwright)
- **Redis**: Message broker and result backend
- **Pydantic**: Data validation and settings management

### Web (Node.js)
- **Express**: Web framework for API layer
- **MongoDB**: Document database for job persistence
- **Mongoose**: MongoDB ODM
- **Winston**: Logging library
- **Axios**: HTTP client for core API communication

### Frontend (React)
- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS**: Custom design system with animations
- **Fetch API**: HTTP client for API calls

## Data Flow

```
User → Frontend → Web API → Core API → Celery → Scraper
                     ↓          ↓         ↓
                  MongoDB    FastAPI    Redis
```

1. User submits scraping job via Frontend
2. Frontend sends request to Web API
3. Web API forwards to Core API
4. Core API queues task in Celery
5. Celery worker picks up task
6. Scraper executes and returns result
7. Result stored in Redis and MongoDB
8. Frontend polls for status updates

## Key Features

### Scraping
- Multiple scraper engines (Requests, Selenium, Playwright)
- JavaScript execution support
- Custom headers and cookies
- Proxy support
- CSS selector-based extraction
- Retry mechanism
- Priority queue

### API
- RESTful endpoints
- Job management (create, read, cancel)
- Bulk operations
- Pagination and filtering
- Rate limiting
- CORS support

### UI
- Modern dark theme
- Animated gradients
- Real-time status updates
- Responsive design
- Form validation
- Error handling

## Environment Variables

### Core (.env)
- API_HOST, API_PORT
- REDIS_HOST, REDIS_PORT
- CELERY_BROKER_URL
- DATABASE_URL
- MONGODB_URL

### Web (.env)
- PORT
- CORE_API_URL
- MONGODB_URI
- REDIS_HOST
- CORS_ORIGIN

### Frontend (.env)
- VITE_API_URL

## Deployment

### Docker (Recommended)
```bash
docker-compose up -d
```

### Manual
```bash
./start.sh
```

## Ports

- Core API: 8000
- Web API: 3000
- Frontend: 5173
- MongoDB: 27017
- Redis: 6379
