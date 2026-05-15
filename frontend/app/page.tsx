// import Link from 'next/link'
// import { testFetch } from '../lib/fetch.js';
import VideoHandler from "../components/VideoHandler";

export default async function Home() {

  return (


    <div className="launch-center">
      <main className="launch-card">
          <h1>Salamander Project</h1>
          <VideoHandler/>
      </main>
    </div>

  );
}
