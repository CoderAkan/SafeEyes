from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class User(BaseModel):
    id: str
    username: str
    email: str
    role: str = "viewer"
    created_at: str


class UserInDB(User):
    password_hash: str
