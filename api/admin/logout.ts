import type { IncomingMessage, ServerResponse } from "node:http";
import { clearCookie, json, validOrigin } from "../_lib/security.js";
export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST" || !validOrigin(req)) return json(res, 403, { error: "Forbidden" });
  res.setHeader("Set-Cookie", clearCookie());
  json(res, 200, { ok: true });
}
