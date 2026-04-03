from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.utils.security import verify_token
from app.database.connection import get_db
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()
security = HTTPBearer()


class CameraCreate(BaseModel):
    name: str
    location: str
    stream_url: str
    type: str = "ip_camera"  # "ip_camera", "webcam", "rtsp"
    map_x: Optional[float] = None
    map_y: Optional[float] = None


class CameraUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    stream_url: Optional[str] = None
    status: Optional[str] = None
    map_x: Optional[float] = None
    map_y: Optional[float] = None


@router.get("/")
async def list_cameras(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    cursor = await db.execute("SELECT * FROM cameras ORDER BY created_at DESC")
    rows = await cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]
    cameras = [dict(zip(columns, row)) for row in rows]
    return {"cameras": cameras}


@router.get("/{camera_id}")
async def get_camera(camera_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    cursor = await db.execute("SELECT * FROM cameras WHERE id = ?", (camera_id,))
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Camera not found")

    columns = [desc[0] for desc in cursor.description]
    return dict(zip(columns, row))


@router.post("/")
async def create_camera(camera: CameraCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    camera_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    await db.execute(
        """INSERT INTO cameras (id, name, location, stream_url, type, status, map_x, map_y, created_at)
        VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?)""",
        (camera_id, camera.name, camera.location, camera.stream_url, camera.type,
         camera.map_x, camera.map_y, now),
    )
    await db.commit()

    return {"id": camera_id, "status": "created", "created_at": now}


@router.patch("/{camera_id}")
async def update_camera(
    camera_id: str, update: CameraUpdate, credentials: HTTPAuthorizationCredentials = Depends(security)
):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    updates = []
    params = []

    for field, value in update.dict(exclude_none=True).items():
        updates.append(f"{field} = ?")
        params.append(value)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    params.append(camera_id)
    await db.execute(f"UPDATE cameras SET {', '.join(updates)} WHERE id = ?", params)
    await db.commit()

    return {"id": camera_id, "status": "updated"}


@router.delete("/{camera_id}")
async def delete_camera(camera_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    await db.execute("DELETE FROM cameras WHERE id = ?", (camera_id,))
    await db.commit()

    return {"id": camera_id, "status": "deleted"}
