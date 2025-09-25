from fastapi import FastAPI

app = FastAPI(title="Job Recommendation System")

@app.get("/health")
def health():
    return {"status": "ok"}
