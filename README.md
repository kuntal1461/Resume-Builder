# Job Recommendation System 🚀

This repository powers an **AI-driven job recommendation platform**.  
The system lets a user **log in**, **upload a resume**, then an **LLM generates 7–8 tailored questions**. The answers, combined with resume data, decide the **user’s score**:

- If **score < 60** → show popup warning, user can retry.
- If **score ≥ 60** → system scrapes job data from **LinkedIn** and uses **LangChain-powered LLMs** to **recommend jobs**.

---

## 📂 Repository Structure


.
├── job-recommendation-framework/ # Framework: AI & LangChain
│ ├── framework/
│ │ ├── llm/ # LLM prompts, chains, providers
│ │ ├── parsers/ # LLM-assisted parsing
│ │ ├── qna/ # Question generation & scoring
│ │ ├── recsys/ # Job reranking logic
│ │ └── interfaces/ # Clean contracts for the system
│ └── README.md
│
├── job-recommendation-system/ # Main system (core, API, frontend)
│ ├── core/ # Resume parsing, scoring, jobs logic
│ ├── web/ # FastAPI/Flask APIs (/api/v1/resumesystem/*)
│ ├── frontend/ # React-based UI (login, Q&A, jobs)
│ ├── integrators/ # LinkedIn scraper / API adapter
│ ├── data/ # DB migrations, seeds
│ ├── configs/ # Configs & env files
│ └── README.md
│
└── README.md # Root project overview (this file)



---

## 🧭 High-Level Flow

flowchart TD
  subgraph FE["Frontend (React)"]
    FE1["Login"]
    FE2["Upload Resume"]
    FE3["Interactive Q&A (7-8 questions)"]
    FE4["Show Score & Decision"]
    FE5["Popup: Score < 60"]
    FE6["Jobs UI (Recommendations >= 60)"]
  end

  subgraph API["Web API (FastAPI/Flask)"]
    A1["Auth & Session"]
    A2["POST /resume"]
    A3["POST /qa/answer"]
    A4["GET /score"]
    A5["GET /jobs/recommend"]
  end

  subgraph CORE["Core Business Logic"]
    C1["Resume Parser (PDF/DOCX → JSON)"]
    C2["Profile Normalizer"]
    C3["Question Generator Orchestrator"]
    C4["Q&A Evaluator"]
    C5["Scoring Engine"]
    C6["Job Recommender Orchestrator"]
  end

  subgraph FW["Framework (LangChain + LLMs)"]
    F1["LLM Parsing Assist"]
    F2["LLM Question Generator"]
    F3["LLM Answer Scoring"]
    F4["LLM Job Reranker"]
  end

  subgraph SRC["Job Source"]
    S1["LinkedIn Scraper / API"]
  end

  FE1 --> A1 --> FE2
  FE2 -->|Upload file| A2 --> C1
  C1 --> C2 --> A2
  C1 -. assist .-> F1
  A2 --> C3 -. uses .-> F2
  C3 --> FE3
  FE3 -->|Answers| A3 --> C4 -. uses .-> F3
  C4 --> C5 --> FE4
  FE4 -->|Score < 60| FE5
  FE4 -->|Score >= 60| A5 --> C6
  C6 -->|Fetch jobs| S1
  C6 -. rerank .-> F4
  C6 --> FE6

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
