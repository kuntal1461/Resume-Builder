import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend_common import get_server_environment

from .controller.HomeController import router as home_router
from .database import init_db
from .db_ping import ping_db
from .RestController.JobSourceController import router as job_source_router
from .RestController.JobRawScrapeController import router as job_raw_scrape_router

app = FastAPI(title="Job Recommendation Scrapper API")

server_env = get_server_environment()

primary_frontend_origin = os.getenv("SCRAPPER_FRONTEND_ORIGIN", os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"))
extra_origins_env = os.getenv("SCRAPPER_CORS_EXTRA_ORIGINS", os.getenv("CORS_EXTRA_ORIGINS", ""))
extra_origins: List[str] = [
    origin.strip()
    for origin in extra_origins_env.split(",")
    if origin.strip()
]

allowed_origins = {primary_frontend_origin, *extra_origins}
if server_env.is_local:
    allowed_origins.update({"http://localhost:3000", "http://127.0.0.1:3000"})

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health():
    ping_db()
    return {"status": "ok", "db": "connected"}


app.include_router(home_router)
app.include_router(job_source_router)
app.include_router(job_raw_scrape_router)

