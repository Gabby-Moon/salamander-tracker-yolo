export const fakeVideos = [
    "fake-video-1.mov",
    "fake-video-2.mp4"
]

export const fakeVideosError = {
  "error": "Error reading video directory"
}

export const fakeThumbnailError = {
    "error": "Error generating thumbnail"
}

export const fakeJobSuccess = {
    "jobID": "123e4567-e89b-12d3-a456-426614174000"
}

export const fakeJobBadRequest = {
    "error": "Missing targetColor or threshold query parameter."
}

export const fakeJobStartError = {
  "error": "Error starting job"
}

export const jobProcessProcessing = {
  "status": "processing"
}

export const jobProcessDone = {
    "status": "done",
    "result": "/results/intro.mp4.csv"
}

export const jobProcessProcessError = {
  "status": "error",
  "error": "Error processing video: Unexpected ffmpeg error"
}

export const jobProcessNotFoundError = {
  "status": "error",
  "error": "Error processing video: Unexpected ffmpeg error"
}