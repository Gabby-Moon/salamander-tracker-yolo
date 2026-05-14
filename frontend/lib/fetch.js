const serverURL = 'http://localhost:3000'

export async function fetchVideos() {
  try {
    const res = await fetch(`${serverURL}/api/videos`); // full API URL
    if (res.ok) {
      const data = await res.json();
      console.log('Fetched videos:', data);
      return data;
    }  else {
      return Promise.reject(`Error fetching videos: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(err);
    return Promise.reject(err.message);
  }
}

export async function fetchThumbnail(filename) {
  try {
    const res = await fetch(`${serverURL}/thumbnail/${filename}`);
    if (res.ok) {
      const image = await res.blob();
      return image;
    } else {
      return Promise.reject(`Error fetching thumbnail: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(err);
    return Promise.reject(err.message);
  }
}

export async function getJobStatus(jobId) {
  try {
    const res = await fetch(`${serverURL}/process/${jobId}/status`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return Promise.reject(`Error fetching job status: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(err);
    return Promise.reject(err.message);
  }
}

export async function processVideo(filename, color, threshold) {
  try {
    const res = await fetch(`${serverURL}/process/${filename}?targetColor=${color}&threshold=${threshold}`, {
      method: 'POST'
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return Promise.reject(`Error processing video: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(err);
    return Promise.reject(err.message);
  }
}

export async function checkResultFile(filename) {
  try {
    const res = await fetch(`${serverURL}/results/${filename}`, {method: "HEAD"});
    return res.ok;
  } catch(err) {
    console.log("Error fetching file condition: ", err);
    return false;
  }
}