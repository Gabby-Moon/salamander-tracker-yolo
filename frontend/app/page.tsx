import Link from 'next/link'


export default function Home() {
  
  return (
    <div className="launch-center">
      <main className="launch-card">
          <h1>Salamander Project</h1>
          <Link href="/videos" className='launch-link'>See Videos</Link>
      </main>
    </div>
  );
}
