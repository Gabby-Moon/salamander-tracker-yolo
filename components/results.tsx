'use client'
import { useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { processVideo, getJobStatus } from "@/lib/fetch"

// Todo: Make so it processes with YOLO

export default function Results({ video }) {
    const [processing, setProcessing] = useState(false)
    const [urls, setUrls] = useState<string[]>([])
    const [status, setStatus] = useState<string | null>(null)

    const addUrl = (newUrl: string) => {
        setUrls(prev => [...prev, newUrl])
    }

    async function process() {
        if (processing) return

        setProcessing(true)
        setStatus(`Processing video ${video}`)

        try {
            const job = await processVideo(video)
            const jobId = job.jobId || job.error

            setStatus(`Job in process with id: ${jobId}`)

            const interval = setInterval(async () => {
                try {
                    const updatedJob = await getJobStatus(jobId)

                    if (updatedJob.error) {
                        console.log(updatedJob.error)
                        clearInterval(interval)
                        setProcessing(false)
                        setStatus(`Processing error: ${updatedJob.error}`)
                        return
                    }

                    setStatus(`Current Job status: ${updatedJob.status}`)

                    if (updatedJob.status === "done") {
                        clearInterval(interval)
                        setStatus(`Job completed! URL: ${updatedJob.result}`)

                        addUrl(`http://localhost:3000${updatedJob.result}`)
                        setProcessing(false)
                    }
                } catch (err) {
                    setStatus("Error checking job status:", err)
                    clearInterval(interval)
                    setProcessing(false)
                }
            }, 2000)

        } catch (err) {
            console.error(err)
            setProcessing(false)
        }
    }

    function fileName(path: string) {
        return path.split("/").pop()?.split(".")[0]
    }

    return (
        <>
            <div className="preview-controls">
                {!processing ? (
                    <button className="preview-link" onClick={process}>
                        Start processing
                    </button>
                ) : (
                    <p className="pop-text">{status}</p>
                )}
            </div>

            <div className="job-list">
                {urls.length === 0 ? (
                    <p>No files available</p>
                ) : (
                    <ul className="url-links">
                        {urls.map((url) => (
                            <li key={url}>
                                Download results for <a href={url} className="csv-download">{fileName(url)}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}