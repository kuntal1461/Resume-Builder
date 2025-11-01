import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .restController import router as resume_reader_router


def create_app() -> FastAPI:
    app = FastAPI(title="Resume Reader API")

    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin, "http://127.0.0.1:3000"],
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
