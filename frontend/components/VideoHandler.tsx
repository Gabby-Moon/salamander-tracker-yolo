'use client'

import { useState } from 'react';

export default function VideoHandler() {
    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const [videoLink, setVideoLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tracks, setTracks] = useState<any[]>([]);

    async function upload() {
        if (!pickedFile) return;

        setIsLoading(true);
        setVideoLink(null);

        const form = new FormData();
        form.append("video", pickedFile);

        try {
            const res = await fetch("http://localhost:8000/track", {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();

            const backendUrl = "http://localhost:8000";
            const videoPath = data.video_url;
            const tracksData = data.tracks || [];

            const fullUrl = videoPath.startsWith("http")
                ? videoPath
                : `${backendUrl}${videoPath}`;


            setVideoLink(fullUrl);
            setTracks(tracksData);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h3>Upload a Video</h3>

            <form>
                <label htmlFor="fileInput">Select a video file:</label>

                <input
                    type="file"
                    id="fileInput"
                    accept="video/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPickedFile(file);
                    }}
                />

                <button
                    type="button"
                    onClick={upload}
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Upload"}
                </button>
            </form>

            <div style={{ marginTop: "20px" }}>
                {isLoading && (
                    <div
                        style={{
                            width: "400px",
                            height: "225px",
                            border: "1px solid #ccc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Loading tracked video...
                    </div>
                )}

                {!isLoading && videoLink && (
                    <div>
                        <video src={videoLink} controls width="400" />

                        <table
                            style={{
                                marginTop: "10px",
                                borderCollapse: "collapse",
                                width: "400px",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                                        Track ID
                                    </th>
                                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                                        Label
                                    </th>
                                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                                        Time on screen
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tracks.map((t, idx) => (
                                    <tr key={idx}>
                                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                                            {t.id}
                                        </td>
                                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                                            {t.label}
                                        </td>
                                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                                            {typeof t.time === "number"
                                                ? `${t.time.toFixed(2)}s`
                                                : t.time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}