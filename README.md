# Job Recommendation System 🚀

An **AI-driven job recommendation platform**.  
Users **log in**, **upload a resume**, and an **LLM generates 7–8 tailored questions**. Resume data + answers are scored:

- **Score < 60** → show popup warning, user may retry.  
- **Score ≥ 60** → system fetches jobs (e.g., from LinkedIn) and recommends them via **LangChain reranking**.


---

## ⚡ Quick Start in 1 Minute (with Docker)

```bash
git clone https://github.com/your-org/job-recommendation-system.git
cd job-recommendation-system
cp .env.example .env   # edit values
docker compose up -d   # build & start


---

API → http://localhost:8000/health
DB → auto-created (schema + seed from data/sql/)

## 📂 Repository Structure

.
├── job-recommendation-framework/      # Framework: AI & LangChain
│   └── framework/
│
├── job-recommendation-system/         # Main system
│   ├── core/                          # business logic & entities
│   ├── web/                           # FastAPI API layer
│   ├── frontend/                      # React/NxT.js UI
│   └── data/sql/                      # DB migrations & seeds
│       ├── Major_01/
│       │   ├── Major1_DDL.sql
│       │   └── Major1_DML.sql
│       └── Major_02/
│           ├── Major2_DDL.sql
│           └── Major2_DML.sql
│
├── docker/                            # Docker configs
│   ├── Dockerfile.api
│   ├── entrypoint.api.sh
│   └── db-seed.sh
│
├── docker-compose.yml
├── .env.example
├── .dockerignore
├── Makefile                           # dev shortcuts
└── README.md




---

## 🧭 High-Level Flow

Frontend (React/NxT.js) → login, resume upload, Q&A, jobs view
API (FastAPI) → /resume, /qa/*, /score, /jobs/recommend
Core → parsing, scoring, job recommendation
Framework → LangChain parsing assist, QGen, scoring, reranking
Job Source → LinkedIn scraper / adapter
Final Score = 0.6 × ResumeScore + 0.4 × QAScore
< 60 → retry
≥ 60 → job recommendations

<img width="3840" height="2656" alt="image" src="https://github.com/user-attachments/assets/d3c373ec-e120-40d3-9fb5-0204b513d93e" />


🔌 Module Responsibilities
job-recommendation-framework
LLM-based resume parsing, question generation, answer scoring, job reranking.
Independent package — plug & play with system.
job-recommendation-system
Core resume parser (non-LLM fallback).
Scoring logic (resume + answers).
Job fetching (LinkedIn scraper/integrator).
API layer (/api/v1/resumesystem/*).
React frontend (Login, Resume upload, Q&A, Jobs view).



⚙️ Tech Stack
Backend: Python 3.9.6, FastAPI (or Flask)
Frontend: Nxt.Js + Tailwind
AI: LangChain + LLMs
DBs: PostgreSQL/MySQL, FAISS/PGVector, Redis/Elastic
Scraping: LinkedIn (with compliance checks)
Infra: Docker optional, .env configs for secrets



🧪 Scoring Logic
Final Score = 0.6 × Resume Score + 0.4 × Q&A Score
Threshold:
< 60 → popup: “Your score is below 60”
≥ 60 → LinkedIn scraping + job recommendations



🧵 Sequence Diagram (Q&A Round)


sequenceDiagram
  autonumber
  participant FE as Frontend
  participant API as Web API
  participant CORE as Core
  participant FW as Framework
  participant DB as DB

  FE->>API: POST /resume (file)
  API->>CORE: parse_and_normalize(uri)
  CORE->>FW: LLM.extract_entities(text)
  FW-->>CORE: entities
  CORE->>DB: save profile
  API-->>FE: profileId

  FE->>API: GET /qa/start
  API->>CORE: generate_questions(profile)
  CORE->>FW: LLM.qgen(profile)
  FW-->>CORE: 7-8 questions
  CORE-->>API: questions
  API-->>FE: show questions

  loop For each answer
    FE->>API: POST /qa/answer
    API->>CORE: score_answer
    CORE->>FW: LLM.score(q,a,profile)
    FW-->>CORE: score
    CORE->>DB: save partial score
  end

  FE->>API: GET /score
  API->>CORE: compute_score
  CORE-->>API: score
  API-->>FE: final score + decision



⚙️ Local Installation
🐳 Option A — With Docker (recommended)
Install Docker Desktop / Engine.
Copy .env.example → .env and set your DB values.
Build & run:
docker compose up -d --build
API health: http://localhost:8000/health
Add new SQL in job-recommendation-system/data/sql/Major_XX/ → run:
docker compose up db_migrator --build
Stop/reset:
docker compose down         # stop
docker compose down -v      # stop + reset DB volume
💻 Option B — Without Docker
Install Python 3.9.6 and MySQL 8.x.
Create DB & user:
CREATE DATABASE your_db_name CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
Apply SQL from data/sql/.
Install dependencies:
python3 -m venv venv
source venv/bin/activate
pip install -r job-recommendation-system/web/requirements.txt
Run API:
cd job-recommendation-system/web
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
🔒 Security Notes
Use strong secrets in .env (never commit them).
Don’t expose MySQL port in production.
Use Docker secrets / Vault / Secret Manager in prod.
Always store hashed passwords.
🧪 Quick Test
Insert a test user:
docker compose exec mysql sh -lc '
  mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "
    INSERT INTO $MYSQL_DB.users (username,email,password_hash,first_name,last_name,is_active,signInBy)
    VALUES (\"demo\",\"demo@example.com\",\"hash\",\"Demo\",\"User\",1,\"email\");
  "'
Check it:
docker compose exec mysql sh -lc 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT id,username,email FROM $MYSQL_DB.users;"'
🛠 Developer Commands (Makefile)
The Makefile provides shortcuts for common tasks:
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
Usage:
make up        # start everything
make logs      # see logs
make mysql     # connect to DB
make reset     # nuke DB + start fresh

---

Would you like me to also generate a **`CONTRIBUTING.md`** (with PR flow, co
