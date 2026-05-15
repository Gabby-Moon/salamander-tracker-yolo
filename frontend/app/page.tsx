// import Link from 'next/link'
// import { testFetch } from '../lib/fetch.js';
import { useEffect, useState } from 'react';

export default async function Home() {
  const [pickedFile, setPickedFile] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  function upload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      setPickedFile(file.name);

      const formData = new FormData();
      formData.append('file', file);
    }


  }

  return (


    <div className="launch-center">
      <main className="launch-card">
          <h1>Salamander Project</h1>

      </main>
    </div>

  );
}
