// 'use client'
// import Image from "next/image"
// import sala1 from "@/public/VideoSala1.jpg"
// import sala2 from "@/public/VideoSala2.jpg"
// import VideoList from "@/frontend/components/videolist"
// import {useState, useEffect} from 'react'
// import {fetchVideos} from '@/lib/fetch'

// export default function Page() {
//     const [videos, setVideos] = useState<string[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         async function loadVideos() {
//             try {
//                 setLoading(true);
//                 const vids = await fetchVideos();
//                 console.log('Videos loaded in component:', vids);
//                 setVideos(vids);
//             } catch (err: PromiseRejectionEvent | unknown) {
//                 console.error('Error loading videos:', err);
//                 setError(err instanceof Error ? err.message : String(err));
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadVideos();
//     }, []);

//     return (
//         <main id="video-page">
//             <Image src={sala1} alt="" width={300} height={1000}></Image>
//             <div id="SalaList">
//                 <h1>Salamander Video List</h1>
//                 <VideoList 
//                     videos={videos}
//                     loading={loading}
//                     error={error}
//                 />
//             </div>
            
//             <Image src={sala2} alt="" width={300} height={1000}></Image>

//         </main>
//     );
// }