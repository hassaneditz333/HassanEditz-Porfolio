import type { IncomingMessage, ServerResponse } from "node:http";
import { sendPasswordResetCode } from "../_lib/mail.js";
import { ADMIN_EMAIL, body, createPasswordResetOtp, json, rateLimited, validOrigin } from "../_lib/security.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  try {
    if (!validOrigin(req)) return json(res, 403, { error: "Invalid request origin" });
    if (await rateLimited(req, "request-code", 3)) return json(res, 429, { error: "Too many requests. Try again in 15 minutes." });

    const { email } = await body(req);
    if (typeof email !== "string" || email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return json(res, 200, { ok: true, message: "If this email is recognized, a code has been sent." });
    }

    const code = await createPasswordResetOtp(email);
    await sendPasswordResetCode(code);
    return json(res, 200, { ok: true, message: "Code sent. Check your email inbox." });
  } catch (error) {
    console.error("Admin code email failed:", error);
    return json(res, 500, { error: process.env.NODE_ENV === "production" ? "Unable to send the code." : error instanceof Error ? error.message : "Unable to send the code." });
  }
}
