import { handleUpload } from "@vercel/blob/client";

/**
 * Serverless handler for Vercel Blob direct upload flow.
 * - Client will call handleUpload(...) from @vercel/blob (client-side) which hits this endpoint.
 * - This endpoint generates a short-lived token for the browser to upload directly to Blob.
 *
 * Requirements:
 * - BLOB_READ_WRITE_TOKEN must be set in this project's Vercel env vars.
 */

export default async function handler(req, res) {
  try {
    // handleUpload expects the client body; for POST we use req.body
    const body = req.method === "POST" ? req.body : await req.json?.();

    const result = await handleUpload({
      body,
      request: req,
      // Optional hook to validate/limit uploads or require auth
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Example: enforce only images and a 10 MB max size.
        // You can also verify req.headers.authorization here to restrict tokens to logged-in users.
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maxSize: 10 * 1024 * 1024, // 10 MB
          addRandomSuffix: true, // append a random suffix to filename for collision safety
          tokenPayload: clientPayload ?? null,
        };
      },
      // Optional: called by Vercel after the upload completes (server-side)
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // blob contains { id, url, size, metadata, ... }
        // Useful if you want to immediately record the blob URL in the DB from server-side.
        // Keep this light — long-running work may be better handled asynchronously.
        console.log("Blob uploaded:", blob.url);
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("handle upload error:", err);
    res.status(400).json({ error: err.message || "Upload handling failed" });
  }
}
