import type { IncomingMessage, ServerResponse } from "node:http";
import { ADMIN_EMAIL, body, json, rateLimited, sessionCookie, validOrigin, verifyAdminPassword } from "../_lib/security.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  try {
    if (!validOrigin(req)) return json(res, 403, { error: "Invalid request origin" });
    if (await rateLimited(req, "login", 5)) return json(res, 429, { error: "Too many login attempts. Try again in 15 minutes." });

    const payload = await body(req);
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ADMIN_EMAIL;
    const password = typeof payload.password === "string" ? payload.password : "";

    if (email !== ADMIN_EMAIL || !password) {
      return json(res, 401, { error: "Invalid email or password" });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return json(res, 401, { error: "Invalid email or password" });
    }

    res.setHeader("Set-Cookie", sessionCookie());
    json(res, 200, { ok: true });
  } catch (err) {
    console.error("Admin login failed:", err);
    json(res, 500, { error: "Admin authentication is not configured" });
  }
}
