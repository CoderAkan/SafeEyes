from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from app.utils.security import create_access_token, verify_token, hash_password, verify_password
from app.database.connection import get_db
from datetime import datetime
import uuid

router = APIRouter()
security = HTTPBearer()


class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    role: str = "viewer"


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    db = await get_db()

    existing = await db.execute(
        "SELECT id FROM users WHERE email = ?", (user_data.email,)
    )
    if await existing.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    hashed = hash_password(user_data.password)

    await db.execute(
        "INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, user_data.username, user_data.email, hashed, user_data.role, datetime.utcnow().isoformat()),
    )
    await db.commit()

    token = create_access_token({"sub": user_id, "email": user_data.email, "role": user_data.role})

    return TokenResponse(
        access_token=token,
        user={"id": user_id, "username": user_data.username, "email": user_data.email, "role": user_data.role},
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = await get_db()

    cursor = await db.execute(
        "SELECT id, username, email, password_hash, role FROM users WHERE email = ?",
        (credentials.email,),
    )
    user = await cursor.fetchone()

    if not user or not verify_password(credentials.password, user[3]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user[0], "email": user[2], "role": user[4]})

    return TokenResponse(
        access_token=token,
        user={"id": user[0], "username": user[1], "email": user[2], "role": user[4]},
    )


@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = await get_db()
    cursor = await db.execute(
        "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
        (payload["sub"],),
    )
    user = await cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user[0], "username": user[1], "email": user[2], "role": user[3], "created_at": user[4]}
