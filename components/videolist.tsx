import Link from 'next/link'
import {checkResultFile} from "@/lib/fetch"
import { useEffect, useState } from 'react';

type Props = {
  videos: string[];
  loading: boolean | null;
  error: string | null;
};

export default function VideoList({ videos, loading, error }: Props) {
  const [availableFiles, setAvailableFiles] = useState<Record<string, boolean>>({})

  useEffect(() => {
    videos.forEach(async (name) => {
      // Note:
      // \. looks for the . character
      // [^/.]+ makes sure it stops at the dot and separates the extension
      // $ starts from the back
      const exist = await checkResultFile(name.replace(/\.[^/.]+$/, ".csv"))
      if(exist) {
        setAvailableFiles((prev) => ({ ...prev, [name]: true}))
      }
    })
  }, [videos])

  if (loading == true) {
    return <ul><li>Loading ...</li></ul>
  } else {
    if (loading == false && (!videos || videos.length === 0)) {
      return <ul><li>There was an error loading videos or the videos directory was empty.</li></ul>
    }
  }

  return (
    <ul>
      {videos.map((name, index) => (
        <li key={index}>{name} &nbsp;
            <Link href={`/videos/preview?video=${encodeURIComponent(name)}`}>
            [Process]
            </Link>
            {/* Way to get download from results folder */}
            {availableFiles[name] && (
              <>
                &nbsp;
                <a href={`http://localhost:3000/results/${encodeURIComponent(name.replace(/\.[^/.]+$/, ".csv"))}`} className='csv-download'>[Download CSV]</a>
              </>
            )}
        </li>
      ))}
    </ul>
  );
}