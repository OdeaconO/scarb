// src/lib/blobUpload.js
import { upload } from "@vercel/blob";

export async function uploadFileAndGetUrl(file) {
  // file: File object from input
  // handleUploadUrl points to the deployed server-side handler
  // /api/uploads/handle (in the backend project)
  const res = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/uploads/handle",
  });
  // res.url contains the public URL of the uploaded blob
  return res?.url;
}
