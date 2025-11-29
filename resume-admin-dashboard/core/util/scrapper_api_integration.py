"""Integration helpers for the job scrapper FastAPI service."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Dict, Iterable, Optional

import requests
from backend_common import get_server_environment

DEFAULT_LOCAL_SCRAPPER_API = "http://localhost:8200/api"


def _strip_trailing_slash(value: str) -> str:
    return value.rstrip("/")


def _normalize_base_url(raw_url: Optional[str]) -> Optional[str]:
    if not raw_url:
        return None
    return _strip_trailing_slash(raw_url.strip())


def _resolve_scrapper_base_url() -> str:
    explicit_env_vars: Iterable[str] = (
        "SCRAPPER_API_BASE_URL",
        "SCRAPPER_SERVICE_BASE_URL",
        "SCRAPPER_CORE_BASE_URL",
    )
    for var in explicit_env_vars:
        normalized = _normalize_base_url(os.getenv(var))
        if normalized:
            return normalized

    server_env = get_server_environment()
    if server_env.is_local:
        return DEFAULT_LOCAL_SCRAPPER_API

    raise RuntimeError(
        "SCRAPPER_API_BASE_URL is not configured. "
        "Set SCRAPPER_API_BASE_URL (or SCRAPPER_SERVICE_BASE_URL) for non-local deployments."
    )


class ScrapperApiError(RuntimeError):
    """Raised when the scrapper API returns a non-successful response."""

    def __init__(self, message: str, status_code: int, response_text: str | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_text = response_text


@dataclass(frozen=True)
class JobSourceRecord:
    id: int
    source_name_id: int
    source_name: str
    source_url: Optional[str]
    enabled_for_scrapping: bool

    @classmethod
    def from_payload(cls, payload: Dict[str, Any]) -> "JobSourceRecord":
        return cls(
            id=int(payload["id"]),
            source_name_id=int(payload["sourceNameId"]),
            source_name=str(payload.get("sourceName", "")),
            source_url=payload.get("sourceUrl"),
            enabled_for_scrapping=bool(payload.get("enabledForScrapping", False)),
        )


@dataclass(frozen=True)
class JobRawScrapeRecord:
    id: int
    source_id: int
    job_url: str
    status_code: Optional[int]
    status_label: Optional[str]
    raw_content: Optional[str]
    error_message: Optional[str]
    logged_in_time: Optional[str]
    last_update_time: Optional[str]

    @classmethod
    def from_payload(cls, payload: Dict[str, Any]) -> "JobRawScrapeRecord":
        return cls(
            id=int(payload["id"]),
            source_id=int(payload["sourceId"]),
            job_url=str(payload.get("jobUrl", "")),
            status_code=payload.get("statusCode"),
            status_label=payload.get("statusLabel"),
            raw_content=payload.get("rawContent"),
            error_message=payload.get("errorMessage"),
            logged_in_time=payload.get("loggedInTime"),
            last_update_time=payload.get("lastUpdateTime"),
        )


class ScrapperApiClient:
    """Thin wrapper around the scrapper service REST endpoints."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        *,
        session: Optional[requests.Session] = None,
        timeout_seconds: float = 10.0,
    ):
        self._base_url = _strip_trailing_slash(base_url) if base_url else _resolve_scrapper_base_url()
        self._session = session or requests.Session()
        self._timeout = timeout_seconds

    def _build_url(self, path: str) -> str:
        sanitized_path = path if path.startswith("/") else f"/{path}"
        return f"{self._base_url}{sanitized_path}"

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        url = self._build_url(path)
        response = self._session.request(
            method=method.upper(),
            url=url,
            params=params,
            json=json,
            timeout=self._timeout,
        )
        if not response.ok:
            raise ScrapperApiError(
                message=f"Scrapper API call to {path} failed.",
                status_code=response.status_code,
                response_text=response.text,
            )
        if not response.content:
            return {}
        return response.json()

    def list_job_sources(self, *, include_disabled: bool = False) -> list[JobSourceRecord]:
        payloads = self._request(
            "GET",
            "/job-sources",
            params={"includeDisabled": "true" if include_disabled else "false"},
        )
        if not isinstance(payloads, list):
            raise ScrapperApiError(
                "Unexpected payload while listing job sources.",
                500,
                str(payloads),
            )
        return [JobSourceRecord.from_payload(item) for item in payloads]

    def create_job_source(
        self,
        *,
        source_name: int,
        source_url: Optional[str] = None,
        enabled_for_scrapping: bool = True,
    ) -> JobSourceRecord:
        payload = self._request(
            "POST",
            "/job-sources",
            json={
                "sourceName": source_name,
                "sourceUrl": source_url,
                "enabledForScrapping": enabled_for_scrapping,
            },
        )
        return JobSourceRecord.from_payload(payload)

    def create_job_raw_scrape(
        self,
        *,
        source_id: int,
        job_url: str,
        raw_content: Optional[str] = None,
        status_code: Optional[int] = None,
        error_message: Optional[str] = None,
    ) -> JobRawScrapeRecord:
        payload = self._request(
            "POST",
            "/raw-scrapes",
            json={
                "sourceId": source_id,
                "jobUrl": job_url,
                "rawContent": raw_content,
                "status": status_code,
                "errorMessage": error_message,
            },
        )
        return JobRawScrapeRecord.from_payload(payload)

    def fetch_latest_raw_scrape(
        self,
        *,
        job_url: str,
        only_successful: bool = True,
    ) -> JobRawScrapeRecord:
        payload = self._request(
            "GET",
            "/raw-scrapes/latest",
            params={
                "jobUrl": job_url,
                "onlySuccessful": "true" if only_successful else "false",
            },
        )
        return JobRawScrapeRecord.from_payload(payload)


__all__ = [
    "ScrapperApiClient",
    "ScrapperApiError",
    "JobSourceRecord",
    "JobRawScrapeRecord",
]
