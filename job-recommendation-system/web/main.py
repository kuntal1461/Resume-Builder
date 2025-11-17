import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend_common import get_server_environment

from .database import init_db
from .db_ping import ping_db
from .RestController.AuthController import router as auth_router
from .RestController.ResumeDraftController import router as resume_router

app = FastAPI(title="Job Recommendation API")

server_env = get_server_environment()

primary_frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
extra_origins_env = os.getenv("CORS_EXTRA_ORIGINS", "")
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


app.include_router(auth_router)
app.include_router(resume_router)
