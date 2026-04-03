from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, incidents, camera, videos
from app.database.connection import init_db

app = FastAPI(
    title="SafeEyes API",
    description="AI-powered safety monitoring system API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost", "http://localhost:80", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(camera.router, prefix="/api/cameras", tags=["Cameras"])
app.include_router(videos.router, prefix="/api/videos", tags=["Videos"])


@app.on_event("startup")
async def startup():
    await init_db()


@app.get("/")
def home():
    return {"message": "SafeEyes API running", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}