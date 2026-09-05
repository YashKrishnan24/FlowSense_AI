from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class Recommendation(BaseModel):
    severity: Literal["Critical", "Moderate", "Minor"]
    impact: Literal["High", "Medium", "Low"]
    category: str = Field(description="E.g., Typography, Contrast, Hierarchy, CTA, etc.")
    description: str
    suggested_fix: str
    marker_x: Optional[float] = Field(None, description="X coordinate (0.0 to 1.0) of the issue on the image")
    marker_y: Optional[float] = Field(None, description="Y coordinate (0.0 to 1.0) of the issue on the image")

class UXReport(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    accessibility_score: int = Field(ge=0, le=100)
    visual_clarity_score: int = Field(ge=0, le=100)
    conversion_score: int = Field(ge=0, le=100)
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[Recommendation]

class AnalysisRequest(BaseModel):
    image_url: str
