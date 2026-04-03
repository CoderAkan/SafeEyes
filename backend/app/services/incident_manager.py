from app.database.connection import get_db
from datetime import datetime
import uuid


class IncidentManager:
    """Manages incident creation and processing from AI detections."""

    @staticmethod
    async def create_from_detection(
        camera_id: str,
        detection_type: str,
        confidence: float,
        frame_url: str = None,
        location: str = None,
    ) -> dict:
        """Create an incident from an AI detection result."""
        severity = IncidentManager._calculate_severity(detection_type, confidence)

        db = await get_db()
        incident_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        await db.execute(
            """INSERT INTO incidents (id, camera_id, type, severity, confidence, frame_url, location, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)""",
            (incident_id, camera_id, detection_type, severity, confidence, frame_url, location, now),
        )
        await db.commit()

        return {"id": incident_id, "type": detection_type, "severity": severity, "created_at": now}

    @staticmethod
    def _calculate_severity(detection_type: str, confidence: float) -> str:
        """Calculate incident severity based on type and confidence."""
        if detection_type == "fire":
            return "critical" if confidence > 0.7 else "high"
        elif detection_type == "ppe_violation":
            if confidence > 0.85:
                return "high"
            elif confidence > 0.6:
                return "medium"
            return "low"
        elif detection_type == "unsafe_behavior":
            return "high" if confidence > 0.8 else "medium"
        return "medium"
