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
    company_name: Optional[str]
    source_name_id: int
    source_name: str
    source_url: Optional[str]
    enabled_for_scrapping: bool
    scrape_type_id: Optional[int]
    scrape_type_label: Optional[str]
    scraping_schedule_id: Optional[int]
    scraping_schedule_label: Optional[str]
    api_endpoint: Optional[str]
    api_key: Optional[str]

    @classmethod
    def from_payload(cls, payload: Dict[str, Any]) -> "JobSourceRecord":
        return cls(
            id=int(payload["id"]),
            company_name=payload.get("companyName"),
            source_name_id=int(payload["sourceNameId"]),
            source_name=str(payload.get("sourceName", "")),
            source_url=payload.get("sourceUrl"),
            enabled_for_scrapping=bool(payload.get("enabledForScrapping", False)),
            scrape_type_id=(
                int(payload["scrapeTypeId"]) if payload.get("scrapeTypeId") is not None else None
            ),
            scrape_type_label=payload.get("scrapeType"),
            scraping_schedule_id=(
                int(payload["scrapingScheduleId"])
                if payload.get("scrapingScheduleId") is not None
                else None
            ),
            scraping_schedule_label=payload.get("scrapingSchedule"),
            api_endpoint=payload.get("apiEndpoint"),
            api_key=payload.get("apiKey"),
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

    def create_job_source(
        self,
        *,
        source_name: int,
        source_url: Optional[str] = None,
        enabled_for_scrapping: bool = True,
        scrape_type_id: Optional[int] = None,
        scraping_schedule_id: Optional[int] = None,
        api_endpoint: Optional[str] = None,
        api_key: Optional[str] = None,
        company_name: Optional[str] = None,
    ) -> JobSourceRecord:
        json_body: Dict[str, Any] = {
            "sourceName": source_name,
            "sourceUrl": source_url,
            "enabledForScrapping": enabled_for_scrapping,
        }
        if scrape_type_id is not None:
            json_body["scrapeTypeId"] = scrape_type_id
        if scraping_schedule_id is not None:
            json_body["scrapingScheduleId"] = scraping_schedule_id
        if api_endpoint is not None:
            json_body["apiEndpoint"] = api_endpoint
        if api_key is not None:
            json_body["apiKey"] = api_key
        if company_name:
            json_body["companyName"] = company_name

        payload = self._request("POST", "/job-sources", json=json_body)
        return JobSourceRecord.from_payload(payload)


__all__ = [
    "ScrapperApiClient",
    "ScrapperApiError",
    "JobSourceRecord",
]
