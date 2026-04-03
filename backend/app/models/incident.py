from pydantic import BaseModel
from typing import Optional


class Incident(BaseModel):
    id: str
    camera_id: str
    type: str
    severity: str = "medium"
    description: str = ""
    frame_url: Optional[str] = None
    video_url: Optional[str] = None
    confidence: float = 0.0
    location: Optional[str] = None
    status: str = "new"
    notes: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
