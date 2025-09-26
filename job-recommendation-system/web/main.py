from fastapi import FastAPI
from .db_ping import ping_db

app = FastAPI(title="Job Recommendation API")

@app.get("/health")
def health():
    ping_db()
    return {"status": "ok", "db": "connected"}
