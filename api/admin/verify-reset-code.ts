import type { IncomingMessage, ServerResponse } from "node:http";
import { ADMIN_EMAIL, body, createResetSession, json, rateLimited, validOrigin, verifyPasswordResetOtp } from "../_lib/security.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  try {
    if (!validOrigin(req)) return json(res, 403, { error: "Invalid request origin" });
    if (await rateLimited(req, "verify-reset-code", 10)) return json(res, 429, { error: "Too many attempts. Try again in 15 minutes." });

    const { email, code } = await body(req);
    if (typeof email !== "string" || email.trim().toLowerCase() !== ADMIN_EMAIL || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return json(res, 400, { error: "Please provide a valid 6-digit code" });
    }

    const isValid = await verifyPasswordResetOtp(email, code);
    if (!isValid) {
      return json(res, 400, { error: "Invalid or expired passcode" });
    }

    const resetToken = await createResetSession(email);
    return json(res, 200, { ok: true, resetToken });
  } catch (error) {
    console.error("Verify reset code failed:", error);
    return json(res, 500, { error: "Unable to verify passcode" });
  }
}
