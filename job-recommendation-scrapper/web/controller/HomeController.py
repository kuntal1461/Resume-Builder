"""Basic HTML-rendered controller for the scrapper service."""

from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter(tags=["ui"])


@router.get("/", response_class=HTMLResponse)
def homepage():
    """Simple landing page so the service has a default route."""
    return """
    <html>
        <head><title>Job Scrapper</title></head>
        <body style="font-family: sans-serif;">
            <h1>Job Recommendation Scrapper</h1>
            <p>The API is live. Use the REST endpoints under <code>/api</code> paths to interact with job sources and scrapes.</p>
        </body>
    </html>
    """

