import os
import shutil
from datetime import datetime

STORAGE_BASE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage")


class VideoSaver:
    """Handles saving and managing video files."""

    def __init__(self):
        self.videos_dir = os.path.join(STORAGE_BASE, "videos")
        self.frames_dir = os.path.join(STORAGE_BASE, "frames")
        os.makedirs(self.videos_dir, exist_ok=True)
        os.makedirs(self.frames_dir, exist_ok=True)

    def save_video(self, source_path: str, camera_id: str) -> str:
        """Save a video file to storage."""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        ext = os.path.splitext(source_path)[1] or ".mp4"
        filename = f"{camera_id}_{timestamp}{ext}"
        dest = os.path.join(self.videos_dir, filename)
        shutil.copy2(source_path, dest)
        return dest

    def save_frame(self, frame_data: bytes, camera_id: str, incident_id: str) -> str:
        """Save a frame image to storage."""
        filename = f"{camera_id}_{incident_id}.jpg"
        dest = os.path.join(self.frames_dir, filename)
        with open(dest, "wb") as f:
            f.write(frame_data)
        return dest

    def delete_video(self, filepath: str) -> bool:
        """Delete a video file."""
        if os.path.exists(filepath):
            os.remove(filepath)
            return True
        return False

    def get_storage_stats(self) -> dict:
        """Get storage usage statistics."""
        total_size = 0
        file_count = 0
        for root, dirs, files in os.walk(STORAGE_BASE):
            for f in files:
                filepath = os.path.join(root, f)
                total_size += os.path.getsize(filepath)
                file_count += 1
        return {"total_size_mb": round(total_size / (1024 * 1024), 2), "file_count": file_count}
