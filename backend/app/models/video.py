from pydantic import BaseModel
from typing import Optional


class Video(BaseModel):
    id: str
    camera_id: str
    filename: str
    filepath: str
    file_size: int = 0
    duration: float = 0
    created_at: str
