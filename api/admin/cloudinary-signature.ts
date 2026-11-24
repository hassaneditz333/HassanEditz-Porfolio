import type { IncomingMessage, ServerResponse } from "node:http";
import { createUploadSignature } from "../_lib/cloudinary.js";
import { isAdmin, json, validOrigin } from "../_lib/security.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
    if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
    if (!validOrigin(req)) return json(res, 403, { error: "Invalid request origin" });
    return json(res, 200, createUploadSignature(Math.floor(Date.now() / 1000)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start upload";
    return json(res, 503, { error: message });
  }
}
