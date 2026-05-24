// cloudinary.js  —  drop-in replacement for firebase.js
// Free, no subscription needed — sign up at cloudinary.com

const CLOUDINARY_CLOUD_NAME = "dbvtzdtpc"; // e.g. "dxyz123abc"
const CLOUDINARY_UPLOAD_PRESET = "FIndYourStuff"; // e.g. "ml_default"

export async function uploadImage(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.floor((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url); // this is your image URL
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload error")));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    );
    xhr.send(formData);
  });
}
