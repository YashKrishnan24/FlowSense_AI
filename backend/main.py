import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()

from models import AnalysisRequest, UXReport
from gemini_service import analyze_ui_screenshot, analyze_ui_screenshot_bytes

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
async def perform_analysis(
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        if file:
            image_bytes = await file.read()
            mime_type = file.content_type
            report = await analyze_ui_screenshot_bytes(image_bytes, mime_type)
        elif image_url:
            report = await analyze_ui_screenshot(image_url)
        else:
            raise HTTPException(status_code=400, detail="Must provide either image_url or file")
        return report
    except Exception as e:
        # In a real app, you'd log the exception and return a standard 500 error
        raise HTTPException(status_code=500, detail=str(e))
