'use client'

import { JSX, useEffect, useState } from 'react';

export default function VideoHandler() {
    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const [response, setResponse] = useState<Response | null>(null);
    const [videoLink, setVideoLink] = useState<string | null>(null);

    useEffect(() => {
        const handleResponse = async () => {
            if (response != null) {
                const data = await response.json();
                const backendUrl = "http://localhost:8000";
                const videoPath = data.video_url
                const fullUrl = videoPath.startsWith("http") ? videoPath : `${backendUrl}${videoPath}`;
                setVideoLink(fullUrl);
            }
        };
        handleResponse();
    }, [response]);

    async function upload() {
        if (pickedFile == null || pickedFile == undefined) {
            return
        }
        const form = new FormData();
        form.append("video", pickedFile);
        setResponse(await fetch("http://localhost:8000/track", { method: "POST", body: form}))
    }


    return (
        <div>
            
            <h3>Upload a Video</h3>  
            <form>
                <label htmlFor="fileInput">Select a video file:</label>
                <input type="file" id="fileInput" accept="video/*" onChange={(e) => {
                        const file = e.target.files?.[0]

                        if (file)
                            setPickedFile(file)
                    }} >
                </input>
                <button type="button" onClick={upload}>Upload</button>
            </form>
            {videoLink && <video src={videoLink} controls width="400"></video>}
        </div>
        )
}
