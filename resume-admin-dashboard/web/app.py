import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend_common import get_server_environment
from .database import init_db
from .restController import (
    admin_profile_router,
    template_categories_router,
    template_mutation_router,
)


def _build_allowed_origins() -> List[str]:
    server_env = get_server_environment()

    primary_frontend_origin = os.getenv(
        "RESUME_ADMIN_FRONTEND_ORIGIN", "http://localhost:3000"
    )
    extra_origins_env = os.getenv("CORS_EXTRA_ORIGINS", "")
    extra_origins = [
        origin.strip() for origin in extra_origins_env.split(",") if origin.strip()
    ]

    allowed = {primary_frontend_origin, *extra_origins}
    if server_env.is_local:
        allowed.update({"http://localhost:3000", "http://127.0.0.1:3000"})

    return list(allowed)


def create_app() -> FastAPI:
    app = FastAPI(title="Resume Admin Dashboard API")

    allowed_origins = _build_allowed_origins()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup():
        init_db()

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    app.include_router(template_categories_router)
    app.include_router(template_mutation_router)
    app.include_router(admin_profile_router)
    return app


app = create_app()
