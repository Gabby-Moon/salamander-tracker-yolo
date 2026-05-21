"""
Simple FastAPI backend for a salamander tracking YOLO model.

Users can upload a video, which is saved to the server.
The application also exposes an endpoint to access uploaded videos.

The YOLO model loads at startup and prints class names to the console.

CORS middleware is enabled to allow cross-origin requests, and
static files are served from the "videos" directory.
"""
import os
import time
from pathlib import Path
from threading import Thread

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import cv2 # type: ignore
from ultralytics import YOLO

from collections import defaultdict

VIDEOS_DIR = Path(__file__).parent / "videos"
VIDEOS_DIR.mkdir(exist_ok=True)

final_output = VIDEOS_DIR / "output.mp4"
temp_output = VIDEOS_DIR / "output_tmp.mp4"

model = YOLO("best.pt")
print(model.names)

app = FastAPI(title="Salamander Tracker POC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/videos", StaticFiles(directory=str(VIDEOS_DIR)), name="videos")
job = {"status": "idle"}

@app.get("/")
def root():
    """ 
    A simple root endpoint that returns a JSON response indicating that the server is running.
    This can be used for health checks or to verify that the server is up and running.
    """
    return {"ok": True}

def run_track_job():
    input_path = VIDEOS_DIR / "input.mp4"
    cap = cv2.VideoCapture(str(input_path))
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or fps <= 0:
        fps = 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"fps={fps} dims={width}x{height} frames={total}")
    output_path = VIDEOS_DIR / "output.mp4"
    writer = cv2.VideoWriter(
        str(temp_output),
        cv2.VideoWriter_fourcc(*"avc1"),
        fps,
        (width, height),
    )

    frames_seen = defaultdict(int)
    label_for = {}

    for frame_idx in range(total):
        ok, frame = cap.read()
        if not ok:
            break
        result = model.track(frame, persist=True, verbose=False)[0]
        writer.write(result.plot())
        boxes = result.boxes
        if boxes is not None and boxes.id is not None:
            for tid, cls_id in zip(boxes.id.tolist(), boxes.cls.tolist()):
                frames_seen[int(tid)] += 1
                label_for[int(tid)] = model.names[int(cls_id)]
        if frame_idx % 30 == 0:
            print(f"frame {frame_idx}/{total}")
            job["percent"] = int((frame_idx + 1) / total * 100)

    cap.release()
    writer.release()

    os.replace(temp_output, final_output)

    tracks = [
        {
            "track_id": tid,
            "time_on_screen": round(count / fps, 2),
            "label": label_for[tid],
        }
        for tid, count in frames_seen.items()
    ]

    job.clear()
    job["status"] = "done"
    job["percent"] = 100
    job["result"] = {
        "video_url": f"http://localhost:8000/videos/output.mp4?t={int(time.time())}",
        "tracks": tracks,
    }

@app.post("/track")
def start_track(video: UploadFile = File(...)):
    """Endpoint to receive a video file, save it, and return a URL."""
    (VIDEOS_DIR / "input.mp4").write_bytes(video.file.read())
    job.clear()
    job["status"] = "processing"
    job["percent"] = 0
    run_track_job()
    return {
        "status": "processing",
    }

@app.get("/track")
def get_track():
    return job

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
