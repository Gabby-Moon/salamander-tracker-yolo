'use client'

import { JSX, useEffect, useState } from 'react';

export default function VideoHandler() {
    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const [response, setResponse] = useState<Response | null>(null);
    const [preRender, setPreRender] = useState<JSON | null>(null)

    useEffect(async () => {
        if(response != null || response != undefined) {
            setPreRender(await response.json())
        }
        
    }, [response])

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
            {/* <video src={response.}></video> */}
            <pre>{JSON.stringify(response)}</pre>
        </div>
        )
}
