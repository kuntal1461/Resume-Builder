import os

from pydantic import BaseModel, Field

from core.constants import app_constants


class Settings(BaseModel):
    """Application level configuration with sane defaults."""

    API_HOST: str = Field(
        default=os.getenv("SCRAPER_API_HOST", app_constants.DEFAULT_API_HOST)
    )
    API_PORT: int = Field(
        default=int(os.getenv("SCRAPER_API_PORT", app_constants.DEFAULT_API_PORT))
    )
    USER_AGENT: str = Field(
        default=os.getenv("SCRAPER_USER_AGENT", app_constants.DEFAULT_USER_AGENT)
    )
    REQUEST_TIMEOUT: int = Field(
        default=int(
            os.getenv("SCRAPER_REQUEST_TIMEOUT", app_constants.DEFAULT_REQUEST_TIMEOUT)
        )
    )
    MAX_RETRIES: int = Field(
        default=int(os.getenv("SCRAPER_MAX_RETRIES", app_constants.DEFAULT_MAX_RETRIES))
    )
    DEFAULT_PRIORITY: int = Field(
        default=int(os.getenv("SCRAPER_PRIORITY", app_constants.DEFAULT_PRIORITY))
    )
    CELERY_BROKER_URL: str = Field(
        default=os.getenv("SCRAPER_CELERY_BROKER", "redis://localhost:6379/0")
    )
    CELERY_RESULT_BACKEND: str = Field(
        default=os.getenv("SCRAPER_CELERY_BACKEND", "redis://localhost:6379/0")
    )
    TASK_TIME_LIMIT: int = Field(
        default=int(os.getenv("SCRAPER_TASK_TIME_LIMIT", app_constants.TASK_TIME_LIMIT))
    )
    TASK_SOFT_TIME_LIMIT: int = Field(
        default=int(
            os.getenv("SCRAPER_TASK_SOFT_TIME_LIMIT", app_constants.TASK_SOFT_TIME_LIMIT)
        )
    )


settings = Settings()

