import type { IncomingMessage, ServerResponse } from "node:http";
import { body, consumeResetToken, json, rateLimited, sessionCookie, setAdminPassword, validOrigin, verifyResetToken } from "../_lib/security.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  try {
    if (!validOrigin(req)) return json(res, 403, { error: "Invalid request origin" });
    if (await rateLimited(req, "reset-password", 5)) return json(res, 429, { error: "Too many attempts. Try again in 15 minutes." });

    const { resetToken, password, confirmPassword } = await body(req);

    if (!resetToken || typeof resetToken !== "string") {
      return json(res, 400, { error: "Reset session expired. Please request a new code." });
    }

    const email = await verifyResetToken(resetToken);
    if (!email) {
      return json(res, 400, { error: "Reset session expired. Please request a new code." });
    }

    if (!password || typeof password !== "string" || password.length < 12) {
      return json(res, 400, { error: "Password must be at least 12 characters long" });
    }

    if (password !== confirmPassword) {
      return json(res, 400, { error: "Passwords do not match" });
    }

    await setAdminPassword(password);
    await consumeResetToken(resetToken);

    res.setHeader("Set-Cookie", sessionCookie());
    return json(res, 200, { ok: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password failed:", error);
    return json(res, 500, { error: "Unable to update password" });
  }
}
