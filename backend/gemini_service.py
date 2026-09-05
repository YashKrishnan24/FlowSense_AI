import os
# pyrefly: ignore [missing-import]
import httpx
from google import genai
# pyrefly: ignore [missing-import]
from google.genai import types
from models import UXReport
import tempfile

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

async def analyze_ui_screenshot(image_url: str) -> UXReport:
    """
    Downloads the image asynchronously, uploads it to Gemini (or passes the content directly),
    and requests a structured UX report.
    """
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(image_url, follow_redirects=True)
        response.raise_for_status()
        image_data = response.content

    # We use a temporary file to upload to the Gemini API, 
    # or pass bytes directly using the genai types.
    # Since we have the bytes, we can pass them directly with the correct mime type.
    
    mime_type = response.headers.get('content-type', 'image/jpeg')
    
    prompt = """
You are an expert UX/UI designer and accessibility auditor.
Analyze this UI screenshot and provide a structured diagnostic report.
Identify strengths, weaknesses, and provide specific recommendations.
For each recommendation, give a severity, impact, category, description, suggested fix,
and estimate the (marker_x, marker_y) coordinates on the image where the issue occurs.
The coordinates MUST be floats between 0.0 and 1.0 inclusive.
NEVER output values below 0.0 or above 1.0.
(0,0) is the top-left and (1,1) is the bottom-right.
"""
    # Call Gemini API to generate structured output matching the UXReport schema
    # The `google-genai` client supports structured output via response_schema.
    result = await client.aio.models.generate_content(
        model='gemini-3.1-flash-lite',
        contents=[
            prompt,
            types.Part.from_bytes(data=image_data, mime_type=mime_type)
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=UXReport,
            temperature=0.2,
        ),
    )

    # The result.text will be a JSON string that matches UXReport.
    # We can parse it directly using Pydantic.
    report = UXReport.model_validate_json(result.text)
    return report
