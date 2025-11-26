# API Documentation

## Base URLs

- **Core API**: `http://localhost:8000`
- **Web API**: `http://localhost:3000`

---

## Web API Endpoints

### 1. Submit Single Scraping Job

**Endpoint**: `POST /api/scrape`

**Request Body**:
```json
{
  "url": "https://example.com/jobs",
  "scraper_type": "requests",
  "selectors": {
    "title": ".job-title",
    "company": ".company-name",
    "description": ".job-description"
  },
  "headers": {
    "User-Agent": "Custom User Agent"
  },
  "cookies": {},
  "proxy": null,
  "javascript_enabled": false,
  "wait_time": 0,
  "max_retries": 3,
  "priority": 5,
  "metadata": {
    "source": "indeed",
    "category": "software"
  }
}
```

**Response**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Scrape job created successfully",
  "created_at": "2024-01-01T12:00:00Z"
}
```

---

### 2. Submit Bulk Scraping Jobs

**Endpoint**: `POST /api/scrape/bulk`

**Request Body**:
```json
{
  "urls": [
    "https://example.com/jobs/1",
    "https://example.com/jobs/2",
    "https://example.com/jobs/3"
  ],
  "scraper_type": "requests",
  "priority": 5,
  "batch_size": 10
}
```

**Response**:
```json
{
  "job_ids": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ],
  "total_jobs": 3,
  "status": "pending",
  "message": "Created 3 scrape jobs",
  "created_at": "2024-01-01T12:00:00Z"
}
```

---

### 3. Get Job Status

**Endpoint**: `GET /api/jobs/:id`

**Response**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "result": {
    "url": "https://example.com/jobs",
    "status_code": 200,
    "title": "Example Page",
    "extracted_data": {
      "title": ["Software Engineer", "Data Scientist"],
      "company": ["Tech Corp", "Data Inc"]
    }
  },
  "error": null,
  "created_at": "2024-01-01T12:00:00Z",
  "completed_at": "2024-01-01T12:01:00Z"
}
```

---

### 4. Cancel Job

**Endpoint**: `DELETE /api/jobs/:id`

**Response**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "cancelled": true,
  "message": "Job cancelled successfully"
}
```

---

### 5. List All Jobs

**Endpoint**: `GET /api/jobs`

**Query Parameters**:
- `status` (optional): Filter by status (pending, in_progress, completed, failed, cancelled)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort field (default: -createdAt)

**Example**: `GET /api/jobs?status=completed&page=1&limit=10`

**Response**:
```json
{
  "jobs": [
    {
      "jobId": "550e8400-e29b-41d4-a716-446655440000",
      "url": "https://example.com/jobs",
      "scraperType": "requests",
      "status": "completed",
      "priority": 5,
      "result": { ... },
      "error": null,
      "createdAt": "2024-01-01T12:00:00Z",
      "completedAt": "2024-01-01T12:01:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 6. List Job Listings

**Endpoint**: `GET /api/listings`

**Query Parameters**:
- `company` (optional): Filter by company name
- `location` (optional): Filter by location
- `search` (optional): Full-text search
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort field (default: -scrapedAt)

**Example**: `GET /api/listings?company=Google&location=Remote`

**Response**:
```json
{
  "listings": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Senior Software Engineer",
      "company": "Google",
      "location": "Remote",
      "description": "We are looking for...",
      "salary": "$150,000 - $200,000",
      "jobType": "Full-time",
      "experienceLevel": "Senior",
      "skills": ["Python", "JavaScript", "React"],
      "postedDate": "2024-01-01T00:00:00Z",
      "applicationUrl": "https://careers.google.com/apply/123",
      "sourceUrl": "https://example.com/jobs/123",
      "scrapedAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Scraper Types

### 1. **requests** (Default)
- Fast and lightweight
- No JavaScript execution
- Best for static pages
- Lowest resource usage

### 2. **selenium**
- Full browser automation
- JavaScript execution
- Good for dynamic content
- Higher resource usage

### 3. **playwright**
- Modern browser automation
- JavaScript execution
- Fast and reliable
- Moderate resource usage

---

## Status Values

- `pending`: Job is queued
- `in_progress`: Job is being processed
- `completed`: Job finished successfully
- `failed`: Job failed (check error field)
- `cancelled`: Job was cancelled

---

## Priority Levels

- `1-3`: Low priority
- `4-6`: Medium priority (default: 5)
- `7-10`: High priority

Higher priority jobs are processed first.

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message:
```json
{
  "error": "Error message description"
}
```

---

## Rate Limiting

The API implements rate limiting:
- **Window**: 15 minutes
- **Max Requests**: 100 per window

Exceeding the limit returns:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Examples

### cURL Examples

**Submit a job**:
```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/jobs",
    "scraper_type": "requests",
    "priority": 5
  }'
```

**Get job status**:
```bash
curl http://localhost:3000/api/jobs/550e8400-e29b-41d4-a716-446655440000
```

**List jobs**:
```bash
curl "http://localhost:3000/api/jobs?status=completed&page=1&limit=10"
```

**Cancel job**:
```bash
curl -X DELETE http://localhost:3000/api/jobs/550e8400-e29b-41d4-a716-446655440000
```

### JavaScript Examples

**Using Fetch API**:
```javascript
// Submit a scraping job
const response = await fetch('http://localhost:3000/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/jobs',
    scraper_type: 'requests',
    priority: 5,
  }),
});

const data = await response.json();
console.log('Job ID:', data.job_id);

// Check job status
const statusResponse = await fetch(`http://localhost:3000/api/jobs/${data.job_id}`);
const status = await statusResponse.json();
console.log('Status:', status);
```

### Python Examples

**Using requests library**:
```python
import requests

# Submit a scraping job
response = requests.post('http://localhost:3000/api/scrape', json={
    'url': 'https://example.com/jobs',
    'scraper_type': 'requests',
    'priority': 5
})

job_data = response.json()
job_id = job_data['job_id']
print(f'Job ID: {job_id}')

# Check job status
status_response = requests.get(f'http://localhost:3000/api/jobs/{job_id}')
status = status_response.json()
print(f'Status: {status["status"]}')
```

---

## WebSocket Support (Future)

Real-time job status updates via WebSocket will be added in a future version.

---

## Authentication (Future)

API key authentication will be added in a future version for production use.
