'use client'
import Link from "next/link"
import Image from "next/image"
import Results from "@/frontend/components/results"
import {useState, useEffect} from 'react'
import placeholderThumbnailImg from '@/mock/thumbnail/Thumbnail.jpg'
import binarizedThumbnailImg from '@/mock/thumbnail/Binarized.jpg'
import { useSearchParams } from "next/navigation"
import { fetchThumbnail } from "@/lib/fetch"
import processImage from "@/lib/binarizer"

export default function Preview() {
    const [videoThumbnail, setVideoThumbnail] = useState(<Image src={placeholderThumbnailImg} alt="video thumbnail" width={320} height={320} />)
    // Todo: Make binarized Thumbnail to YOLO image
    const [binarizedThumbnail, setBinarizedThumbnail] = useState(<Image src={binarizedThumbnailImg} alt="binarized thumbnail" width={320} height={320} />)
    const [thumbBlob, setThumbBlob] = useState<Blob | null>(null);

    const searchParam = useSearchParams()
    const videoParam = searchParam.get('video')
    
    useEffect(() => {
        //actual fetch
        if (!videoParam) return;

        async function loadThumbnail() {
            try{
                const thumbBlob = await fetchThumbnail(videoParam)
                console.log("Thumbnail fetched");
                const thumbImage = URL.createObjectURL(thumbBlob)
                setVideoThumbnail(<Image src={thumbImage} alt="video thumbnail" width={320} height={320} unoptimized />)
                setThumbBlob(thumbBlob)
            } catch {
                console.log("Couldn't get image from API")
            }
        }
        loadThumbnail()
    }, [videoParam])

    useEffect(() => {
        if (!thumbBlob) return;

        async function loadBinarized() {
            const binDataUrl = await processImage(thumbBlob)
            setBinarizedThumbnail(<Image src={binDataUrl} alt="binarized thumbnail" width={320} height={320} unoptimized />)
        }
        loadBinarized()
    }, [thumbBlob])

    return (
        <div id="preview-page">
            <div id="preview-page-cont">
                {videoThumbnail}
                {binarizedThumbnail}
            </div>
            
            <div className="preview-controls">
                <Results 
                    
                />
            </div>
        </div>
    )
}