import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "safeeyes.db")
_db = None


async def init_db():
    """Initialize the database with schema."""
    global _db
    _db = await aiosqlite.connect(DB_PATH)
    _db.row_factory = aiosqlite.Row

    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    with open(schema_path, "r") as f:
        schema = f.read()

    await _db.executescript(schema)
    await _db.commit()


async def get_db():
    """Get database connection."""
    global _db
    if _db is None:
        await init_db()
    return _db


async def close_db():
    """Close database connection."""
    global _db
    if _db:
        await _db.close()
        _db = None
