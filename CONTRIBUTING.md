# Contributing Guidelines

Thanks for your interest in improving the Job Recommendation System! This guide explains how to get started, develop features, and submit changes.

## Getting Set Up
- Fork the repository and clone your fork locally.
- Install dependencies using either Docker (`docker compose up -d --build`) or the manual instructions from the README.
- Copy `.env.example` to `.env` (or `.env.local` for the frontend) and update credentials.
- Run `make up` or start the backend/frontend services individually to confirm everything works before you begin coding.
---

## ⚙️ Local Installation

### 🐳 Option A — With Docker (recommended)

1. **Install Docker Desktop / Engine.**
2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```
   Set your database values in `.env`.
3. **Build & run:**
   ```bash
   docker compose up -d --build
   ```
4. **Verify:**
   - API health: http://localhost:8000/health
5. **Database migrations:**
   - Add new SQL in `job-recommendation-system/data/sql/Major_XX/`
   - Run migrations:
     ```bash
     docker compose up db_migrator --build
     ```
6. **Stop/reset:**
   ```bash
   docker compose down         # stop
   docker compose down -v      # stop + reset DB volume
   ```

### 💻 Option B — Without Docker

1. **Install Python 3.9.6 and MySQL 8.x.**
2. **Create database & user:**
   ```sql
   CREATE DATABASE your_db_name CHARACTER SET utf8 COLLATE utf8_general_ci;
   CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. **Apply SQL from `data/sql/`.**
4. **Install dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r job-recommendation-system/web/requirements.txt
   ```
5. **Run API:**
   ```bash
   cd job-recommendation-system/web
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
   ```

---

## 🔒 Security Notes

- 🔑 Use strong secrets in `.env` (never commit them)
- 🚫 Don't expose MySQL port in production
- 🔐 Use Docker secrets / Vault / Secret Manager in prod
- 🔒 Always store hashed passwords

---

## 🧪 Quick Test

**Insert a test user:**
```bash
docker compose exec mysql sh -lc '
  mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "
    INSERT INTO $MYSQL_DB.users (
      username,email,password_hash,first_name,last_name,phone_number,dob,is_active,is_admin,signInBy
    )
    VALUES (
      \"demo\",\"demo@example.com\",\"hash\",\"Demo\",\"User\",\"+10000000000\",\"1990-01-01 00:00:00\",1,0,\"email\"
    );
  "'
```

**Check the user:**
```bash
docker compose exec mysql sh -lc 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT id,username,email,is_admin FROM $MYSQL_DB.users;"'
```

---

## 🛠 Developer Commands (Makefile)

The Makefile provides shortcuts for common tasks:

```makefile
.PHONY: build up down reset logs api mysql migrator

build:      ## Build images
	docker compose build

up:         ## Start all services
	docker compose up -d

down:       ## Stop all services
	docker compose down

reset:      ## Stop and remove volumes (clean DB)
	docker compose down -v

logs:       ## Tail logs
	docker compose logs -f --tail=200

api:        ## Open shell in API container
	docker compose exec api bash

mysql:      ## Open MySQL CLI
	docker compose exec mysql mysql -u$$MYSQL_USER -p$$MYSQL_PASSWORD $$MYSQL_DB

migrator:   ## Run migrator only
	docker compose up db_migrator --build
```

**Usage:**
```bash
make up        # start everything
make logs      # see logs
make mysql     # connect to DB
make reset     # nuke DB + start fresh
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/logout` | User logout |

### Resume Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/upload` | Upload and parse resume |
| `GET` | `/api/resume/{id}` | Get resume analysis results |

### Q&A Session

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/qa/start` | Start Q&A session (7-8 questions) |
| `POST` | `/api/qa/answer` | Submit answer and get score |
| `GET` | `/api/qa/session/{id}` | Get session progress |

### Scoring & Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/score/final` | Get final combined score |
| `GET` | `/api/jobs/recommend` | Get job recommendations |
| `POST` | `/api/jobs/feedback` | Provide job feedback |

---

## 🐳 Docker Configuration

### Services

- **api**: FastAPI application (port 8000)
- **mysql**: MySQL database (port 3306)
- **db_migrator**: Database migration service (runs once)

### Environment Variables

```env
# Database
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=job_recommendation
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password

# API
API_SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_key
LINKEDIN_API_KEY=your_linkedin_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🔧 Development Setup

### Prerequisites

- Docker and Docker Compose
- Python 3.9.6+ (for local development)
- MySQL 8.x (for local development)
- Node.js 16+ (for frontend development)

### Development Workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/job-recommendation-system.git
   cd job-recommendation-system
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development services**
   ```bash
   make up
   ```

4. **Access development tools**
   - API: http://localhost:8000/docs
   - Frontend: http://localhost:3000
   - Database: localhost:3306

---

## 🚀 Deployment

### Production Deployment

1. **Setup production environment**
   ```bash
   cp .env.production.example .env.production
   # Configure production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Monitor deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

### Cloud Deployment

The system supports deployment on:
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances
- Heroku Container Registry

## Branching Model
- Create feature branches from `main` using a descriptive name, e.g. `feature/add-resume-parser`.
- Keep branches focused on a single concern; open additional branches for unrelated work.

## Coding Standards
- **Python**: follow PEP 8; run `python -m compileall core web` before pushing.
- **JavaScript/TypeScript**: adhere to the repository ESLint configuration; run `npm run lint` inside `job-recommendation-system/front-end`.
- **SQL**: include indexes and constraints; place schema/data changes in `job-recommendation-system/data/sql/Major_XX/`.
- **Docker**: favor multi-stage builds and minimal base images when updating containers.

## Testing & Verification
- Cover new features or fixes with unit/integration tests when feasible.
- Manually test critical user flows (sign-up, resume upload, Q&A submission, job recommendation) when they might be impacted.
- For database migrations, provide seed data or rollback instructions when appropriate.

## Commit & PR Checklist
- Sign every commit: `git commit -s` adds the required `Signed-off-by` trailer.
- Write clear messages describing what changed and why.
- Rebase onto the latest `main` before opening a PR to minimize merge conflicts.
- Confirm CI passes locally (linting, builds, migrations) where possible.
- Fill out the pull request template, reference related issues, and list any manual testing performed.

## Review Expectations
- Expect maintainers to review within a few business days; respond promptly to feedback.
- Address review comments with follow-up commits or rebase/amend if the changes are small.
- Maintainers may request additional tests or documentation updates prior to merge.

## Community Standards
- Treat other contributors respectfully; assume best intent.
- Report security vulnerabilities privately via the contact listed in the README.
- Use GitHub Issues for bugs and feature requests; include reproduction steps and environment details.

We appreciate your contributions—thank you for helping build a better job search experience!
