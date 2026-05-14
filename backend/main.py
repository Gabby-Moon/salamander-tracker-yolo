from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from ultralytics import YOLO
import cv2
import tempfile
import os

app = FastAPI()

model = YOLO("best.pt")

@app.post("/annotate-video")
async def annotate_video(file: UploadFile = File(...)):
    input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    input_temp.write(await file.read())
    input_temp.close()

    output_path = input_temp.name.replace(".mp4", "_annotated.mp4")

    cap = cv2.VideoCapture(input_temp.name)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)[0]
        annotated = results.plot()
        writer.write(annotated)
    
    cap.release()
    writer.release()
    os.remove(input_temp.name)

    return FileResponse(
        output_path,
        media_type="video/mp4",
        filename="annotated_video.mp4"
    )