import { createHash } from "node:crypto";

export const CLOUDINARY_FOLDER = "hassaneditz/videos";

function credentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary video uploads are not configured");
  }
  return { cloudName, apiKey, apiSecret };
}

export function createUploadSignature(timestamp: number) {
  const { cloudName, apiKey, apiSecret } = credentials();
  const signature = createHash("sha1")
    .update(`folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  return { cloudName, apiKey, timestamp, folder: CLOUDINARY_FOLDER, signature };
}

export async function deleteManagedVideos(publicIds: string[]) {
  const ids = [...new Set(publicIds)].filter((id) =>
    id.startsWith(`${CLOUDINARY_FOLDER}/`),
  );
  if (!ids.length) return;

  try {
    const { cloudName, apiKey, apiSecret } = credentials();
    await Promise.all(ids.map(async (publicId) => {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createHash("sha1")
        .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
        .digest("hex");
      const form = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: apiKey, signature });
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/destroy`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      });
      if (!response.ok) throw new Error(`Cloudinary delete failed (${response.status})`);
    }));
  } catch (error) {
    // Content is already safely published. A transient cleanup failure must not roll it back.
    console.error("Cloudinary cleanup failed:", error);
  }
}
