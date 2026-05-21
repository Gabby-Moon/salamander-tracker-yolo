'use client'

import { useState } from 'react';

type Track = {
    track_id: number | string
    time_on_screen: number
    label: string
}

export default function VideoHandler() {
    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const [videoLink, setVideoLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [percent, setPercent] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    async function upload() {
        if (!pickedFile) return;

        setIsLoading(true);
        setVideoLink(null);
        setError(null);
        setPercent(0);

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

            const pollInterval = setInterval(async () => {
                const statusRes = await fetch("http://localhost:8000/track");
                const job = await statusRes.json();

                if (job.percent !== undefined) {
                    setPercent(job.percent);
                }

                if (job.status === "done") {
                    clearInterval(pollInterval);
                    setIsLoading(false);

                    setVideoLink(job.result.video_url);
                    setTracks(job.result.tracks || []);

                    setPercent(100);
                }

                if (job.status === "error") {
                    clearInterval(pollInterval);
                    setIsLoading(false);
                    setError(job.message || "An error occurred during processing.");
                }
            }, 1500);
        } catch (err) {
            console.error(err);
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
                {(isLoading || error) && (
                    <div
                        style={{
                            width: "400px",
                            height: "225px",
                            border: "1px solid #ccc",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        {error ? (
                            <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
                                <strong>Error:</strong>
                                <br />
                                {error}
                            </div>
                        ) : (
                            <>
                                Loading tracked video...
                                {percent !== undefined && (
                                    <progress value={percent} max={100} />
                                )}
                            </>
                        )}
                    </div>
                )}

                {!isLoading && !error && videoLink && (
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
                                            {t.track_id}
                                        </td>
                                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                                            {t.label}
                                        </td>
                                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                                            {typeof t.time_on_screen === "number"
                                                ? `${t.time_on_screen.toFixed(2)}s`
                                                : t.time_on_screen}
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