CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'viewer',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cameras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    stream_url TEXT,
    type TEXT DEFAULT 'ip_camera',
    status TEXT DEFAULT 'active',
    map_x REAL,
    map_y REAL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    camera_id TEXT,
    type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    description TEXT,
    frame_url TEXT,
    video_url TEXT,
    confidence REAL DEFAULT 0.0,
    location TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    camera_id TEXT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    duration REAL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);
