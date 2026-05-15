// import Link from 'next/link'
import { testFetch } from '../lib/fetch.js';

export default async function Home() {
  const data = await testFetch();
  return (
    // <div className="launch-center">
    //   <main className="launch-card">
    //       <h1>Salamander Project</h1>
    //       <Link href="/videos" className='launch-link'>See Videos</Link>
    //   </main>
    // </div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}
