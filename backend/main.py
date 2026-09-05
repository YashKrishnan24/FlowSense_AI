import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()

from models import AnalysisRequest, UXReport
from gemini_service import analyze_ui_screenshot

app = FastAPI(title="FlowSense AI Service")

# CORS setup
# Enforce restriction to actual deployed origin via env var, fallback to local dev
FRONTEND_URL = os.environ.get("FRONTEND_URL")
if FRONTEND_URL:
    origins = [FRONTEND_URL]
else:
    origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analysis", response_model=UXReport)
async def perform_analysis(request: AnalysisRequest):
    try:
        report = await analyze_ui_screenshot(request.image_url)
        return report
    except Exception as e:
        # In a real app, you'd log the exception and return a standard 500 error
        raise HTTPException(status_code=500, detail=str(e))
