from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.utils.security import verify_token
from app.database.connection import get_db
from datetime import datetime
from typing import Optional
import uuid

router = APIRouter()
security = HTTPBearer()


class IncidentCreate(BaseModel):
    camera_id: str
    type: str  # "ppe_violation", "fire", "unsafe_behavior"
    severity: str = "medium"  # "low", "medium", "high", "critical"
    description: str = ""
    frame_url: Optional[str] = None
    video_url: Optional[str] = None
    confidence: float = 0.0
    location: Optional[str] = None


class IncidentUpdate(BaseModel):
    status: Optional[str] = None  # "new", "acknowledged", "resolved"
    notes: Optional[str] = None


@router.get("/")
async def list_incidents(
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    query = "SELECT * FROM incidents WHERE 1=1"
    params = []

    if status:
        query += " AND status = ?"
        params.append(status)
    if type:
        query += " AND type = ?"
        params.append(type)
    if severity:
        query += " AND severity = ?"
        params.append(severity)

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor = await db.execute(query, params)
    rows = await cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]
    incidents = [dict(zip(columns, row)) for row in rows]

    count_cursor = await db.execute("SELECT COUNT(*) FROM incidents")
    total = (await count_cursor.fetchone())[0]

    return {"incidents": incidents, "total": total, "limit": limit, "offset": offset}


@router.get("/stats")
async def incident_stats(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()

    total_cursor = await db.execute("SELECT COUNT(*) FROM incidents")
    total = (await total_cursor.fetchone())[0]

    new_cursor = await db.execute("SELECT COUNT(*) FROM incidents WHERE status = 'new'")
    new_count = (await new_cursor.fetchone())[0]

    resolved_cursor = await db.execute("SELECT COUNT(*) FROM incidents WHERE status = 'resolved'")
    resolved_count = (await resolved_cursor.fetchone())[0]

    by_type_cursor = await db.execute("SELECT type, COUNT(*) as count FROM incidents GROUP BY type")
    by_type = dict(await by_type_cursor.fetchall())

    by_severity_cursor = await db.execute("SELECT severity, COUNT(*) as count FROM incidents GROUP BY severity")
    by_severity = dict(await by_severity_cursor.fetchall())

    return {
        "total": total,
        "new": new_count,
        "resolved": resolved_count,
        "by_type": by_type,
        "by_severity": by_severity,
    }


@router.get("/{incident_id}")
async def get_incident(incident_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    cursor = await db.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Incident not found")

    columns = [desc[0] for desc in cursor.description]
    return dict(zip(columns, row))


@router.post("/")
async def create_incident(incident: IncidentCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    incident_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    await db.execute(
        """INSERT INTO incidents (id, camera_id, type, severity, description, frame_url, video_url, confidence, location, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)""",
        (incident_id, incident.camera_id, incident.type, incident.severity, incident.description,
         incident.frame_url, incident.video_url, incident.confidence, incident.location, now),
    )
    await db.commit()

    return {"id": incident_id, "status": "created", "created_at": now}


@router.patch("/{incident_id}")
async def update_incident(
    incident_id: str, update: IncidentUpdate, credentials: HTTPAuthorizationCredentials = Depends(security)
):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = await get_db()
    updates = []
    params = []

    if update.status:
        updates.append("status = ?")
        params.append(update.status)
    if update.notes:
        updates.append("notes = ?")
        params.append(update.notes)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updates.append("updated_at = ?")
    params.append(datetime.utcnow().isoformat())
    params.append(incident_id)

    await db.execute(f"UPDATE incidents SET {', '.join(updates)} WHERE id = ?", params)
    await db.commit()

    return {"id": incident_id, "status": "updated"}
