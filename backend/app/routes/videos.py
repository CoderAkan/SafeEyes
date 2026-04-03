from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from app.utils.security import verify_token
from app.database.connection import get_db
from datetime import datetime
from typing import Optional
import uuid
import os

router = APIRouter()
security = HTTPBearer()

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage", "videos")


@router.get("/")
async def list_videos(
    camera_id: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    query = "SELECT * FROM videos WHERE 1=1"
    params = []

    if camera_id:
        query += " AND camera_id = ?"
        params.append(camera_id)

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor = await db.execute(query, params)
    rows = await cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    videos = [dict(zip(columns, row)) for row in rows]

    return {"videos": videos}


@router.get("/{video_id}")
async def get_video(video_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    cursor = await db.execute("SELECT * FROM videos WHERE id = ?", (video_id,))
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Video not found")

    columns = [desc[0] for desc in cursor.description]
    return dict(zip(columns, row))


@router.post("/upload")
async def upload_video(
    camera_id: str,
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    video_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] or ".mp4"
    filename = f"{video_id}{ext}"
    filepath = os.path.join(STORAGE_DIR, filename)

    os.makedirs(STORAGE_DIR, exist_ok=True)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    db = await get_db()
    now = datetime.utcnow().isoformat()
    file_size = len(content)

    await db.execute(
        """INSERT INTO videos (id, camera_id, filename, filepath, file_size, duration, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?)""",
        (video_id, camera_id, filename, filepath, file_size, now),
    )
    await db.commit()

    return {"id": video_id, "filename": filename, "size": file_size, "created_at": now}


@router.delete("/{video_id}")
async def delete_video(video_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    cursor = await db.execute("SELECT filepath FROM videos WHERE id = ?", (video_id,))
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Video not found")

    if row[0] and os.path.exists(row[0]):
        os.remove(row[0])

    await db.execute("DELETE FROM videos WHERE id = ?", (video_id,))
    await db.commit()

    return {"id": video_id, "status": "deleted"}
