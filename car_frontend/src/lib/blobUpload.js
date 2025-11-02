// src/lib/blobUpload.js
// dynamic import from @vercel/blob/client to avoid bundler build-time issues

export async function uploadFileAndGetUrl(file) {
  // dynamic import so the module is loaded at runtime in the browser
  const { upload } = await import("@vercel/blob/client");

  // call upload as documented; this will call your server-side /api/uploads/handle route
  const res = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/uploads/handle",
  });

  return res?.url || null;
}
