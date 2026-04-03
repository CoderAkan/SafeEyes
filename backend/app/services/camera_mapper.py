from app.database.connection import get_db


class CameraMapper:
    """Handles 2D map positioning and camera layout management."""

    @staticmethod
    async def get_map_layout() -> list:
        """Get all cameras with their map positions."""
        db = await get_db()
        cursor = await db.execute(
            "SELECT id, name, location, status, map_x, map_y FROM cameras WHERE map_x IS NOT NULL AND map_y IS NOT NULL"
        )
        rows = await cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        return [dict(zip(columns, row)) for row in rows]

    @staticmethod
    async def update_position(camera_id: str, x: float, y: float) -> bool:
        """Update camera position on the 2D map."""
        db = await get_db()
        await db.execute(
            "UPDATE cameras SET map_x = ?, map_y = ? WHERE id = ?",
            (x, y, camera_id),
        )
        await db.commit()
        return True

    @staticmethod
    async def get_camera_zones() -> list:
        """Get cameras grouped by location/zone."""
        db = await get_db()
        cursor = await db.execute(
            "SELECT location, COUNT(*) as camera_count, GROUP_CONCAT(name) as cameras FROM cameras GROUP BY location"
        )
        rows = await cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        return [dict(zip(columns, row)) for row in rows]
