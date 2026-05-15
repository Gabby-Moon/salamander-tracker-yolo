import { useEffect, useState } from 'react';

export default async function VideoHandler() {
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
    <div>
        
        <h3>Upload a Video</h3>  
        <form>
            <label htmlFor="fileInput">Select a video file:</label>
            <input type="file" id="fileInput" accept="video/*" onChange={upload}></input>
            <button type="button" onClick={upload}>Upload</button>
        </form>
    )
}
