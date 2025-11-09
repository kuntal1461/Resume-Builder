import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend_common import get_server_environment
from .restController import router as resume_reader_router


def _build_allowed_origins(server_env) -> List[str]:
    primary = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    extra = os.getenv("CORS_EXTRA_ORIGINS", "")
    extras = [origin.strip() for origin in extra.split(",") if origin.strip()]

    allowed = {primary, *extras}
    if server_env.is_local:
        allowed.update({"http://localhost:3000", "http://127.0.0.1:3000"})
    return list(allowed)


def create_app() -> FastAPI:
    app = FastAPI(title="Resume Reader API")

    server_env = get_server_environment()
    allowed_origins = _build_allowed_origins(server_env)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health():
        return {"status": "ok"}

    app.include_router(resume_reader_router)
    return app


app = create_app()
