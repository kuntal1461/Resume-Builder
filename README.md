# Job Recommendation System

An AI-driven platform that ingests resumes, runs a conversational Q&A round, scores candidates, and recommends jobs using LangChain-powered ranking.

## Highlights
- Guided onboarding: resume upload, 7–8 generated questions, instant scoring feedback.
- Hybrid scoring: 60% resume quality + 40% Q&A answers; prompts retries when the score falls below 60.
- Job sourcing: integrates with LinkedIn (or other providers) and reranks suggestions via LangChain.
- Modular architecture: FastAPI backend, Next.js frontend, reusable AI framework package.

## Architecture Snapshot
- **Frontend (Next.js)** – authentication, resume upload, Q&A experience, job explorer.
- **API (FastAPI)** – authentication, resume parsing, scoring orchestration, job endpoints.
- **Core services** – parsing fallbacks, business entities, scoring and recommendation pipelines.
- **Framework package** – LLM wrappers for extraction, question generation, scoring, reranking.
- **Job source adapters** – LinkedIn scraper/integrations with compliance safeguards.

`final_score = 0.6 * resume_score + 0.4 * qa_score`  
Scores below 60 trigger a retry prompt; higher scores unlock curated job recommendations.

![System overview](https://github.com/user-attachments/assets/d3c373ec-e120-40d3-9fb5-0204b513d93e)

## Tech Stack
| Layer | Technologies |
|-------|--------------|
| Backend | Python 3.9+, FastAPI, SQLAlchemy, Uvicorn |
| Frontend | Next.js, React, Tailwind CSS |
| AI | LangChain, LLM providers (OpenAI, etc.) |
| Data | MySQL/PostgreSQL, FAISS or PGVector, Redis |
| Tooling | Docker, Make, GitHub Actions |

## Getting Started

### 1. Run with Docker (recommended)
```bash
git clone https://github.com/your-org/job-recommendation-system.git
cd job-recommendation-system
cp .env.example .env    # update credentials
docker compose up -d --build
```

Access points once the stack is up:
- API health: http://localhost:8000/health
- Frontend: http://localhost:3000
- MySQL: localhost:3306 (credentials from `.env`)

Useful lifecycle commands:
```bash
docker compose logs -f        # tail all services
docker compose up db_migrator # run migrations
docker compose down -v        # stop and reset volumes
```

### 2. Local development (no Docker)

Backend:
```bash
cd job-recommendation-system
python3 -m venv .venv && source .venv/bin/activate
pip install -r web/requirements.txt
export DATABASE_URL="mysql+pymysql://user:pass@localhost:3306/resumes?charset=utf8mb4"
uvicorn web.main:app --reload
```

Frontend:
```bash
cd job-recommendation-system/front-end
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

Ensure MySQL 8.x (or compatible) is running and seeded with the SQL files under `job-recommendation-system/data/sql/`.

## Repository Layout
```
.
├── docker/                       # Dockerfiles and entrypoints
├── docker-compose.yml
├── job-recommendation-framework/ # Reusable LangChain helpers
├── job-recommendation-system/
│   ├── core/                     # Business logic & domain entities
│   ├── data/sql/                 # Schema + seed SQL
│   ├── frontend/                 # Next.js app
│   └── web/                      # FastAPI application
├── Makefile
└── README.md
```

## Development Workflow
- `make up` / `make down` – start or stop the Docker stack.
- `make logs` – follow container logs.
- `make mysql` – open a MySQL shell with project credentials.
- Backend quality checks: `python -m compileall core web`.
- Frontend quality checks: `npm run lint && npm run build` from `job-recommendation-system/front-end`.
- Insert a demo user for testing:
  ```bash
  docker compose exec mysql sh -lc '
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "
      INSERT INTO $MYSQL_DB.users (username,email,password_hash,first_name,last_name,is_active,signInBy)
      VALUES (\"demo\",\"demo@example.com\",\"hash\",\"Demo\",\"User\",1,\"email\");
    "'
  ```

## API Surface (selected)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create a new user |
| POST | `/auth/login/email` | Authenticate via email/password |
| POST | `/resume` | Upload and parse a resume |
| GET | `/qa/start` | Begin the interview round (7–8 questions) |
| POST | `/qa/answer` | Submit an answer, receive incremental score |
| GET | `/score` | Retrieve the final blended score |
| GET | `/jobs/recommend` | Fetch personalized job listings |

Explore interactive docs at http://localhost:8000/docs.

## Deployment Notes
- Use `.env.production` (or secrets manager) to supply production credentials.
- Containerized deployments are available via Docker Compose, ECS/EKS, Cloud Run, Azure Container Instances, or Heroku.
- Protect secrets, keep MySQL closed to the public internet, and store password hashes only.

## Monitoring & Troubleshooting
- Health checks:
  ```bash
  curl http://localhost:8000/health
  docker compose exec mysql mysqladmin ping
  docker compose ps
  ```
- Common fixes:
  - Port conflicts → adjust exposed ports in `docker-compose.yml`.
  - Database issues → `make reset && make up` to recreate volumes.
  - Repeat build failures → `docker compose build --no-cache`.

## Support & License
- Issues: https://github.com/your-org/job-recommendation-system/issues
- Docs placeholder: https://github.com/your-org/job-recommendation-system/docs
- Email: support@your-org.com
- License: MIT (see `LICENSE`).

## Contributing
We welcome pull requests and ideas! Review the guidelines in `CONTRIBUTING.md` before opening an issue or PR.

<div align="center">
Happy job hunting! 🎯  
[⭐ Star us on GitHub](https://github.com/your-org/job-recommendation-system)
</div>
