import { ADMIN_EMAIL } from "./security.js";

export async function sendPasswordResetCode(code: string) {
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. If Resend API key is configured (Recommended):
  if (resendApiKey) {
    const fromAddress = process.env.RESEND_FROM_EMAIL || "HassanEditz Security <onboarding@resend.dev>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [ADMIN_EMAIL],
        subject: `Your HassanEditz Password Reset Code: ${code}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d10; color: #ffffff; padding: 40px 20px; margin: 0;">
              <div style="max-width: 500px; margin: 0 auto; background-color: #14161c; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
                <div style="margin-bottom: 24px;">
                  <span style="font-size: 20px; font-weight: 800; color: #22d3ee; letter-spacing: -0.5px;">HassanEditz</span>
                  <span style="display: block; font-size: 13px; color: #9ca3af; margin-top: 4px;">Admin Security System</span>
                </div>
                
                <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 12px 0; color: #ffffff;">Password Reset Request</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin: 0 0 24px 0;">
                  We received a request to change the admin password for <strong>${ADMIN_EMAIL}</strong>. Enter the verification code below on the admin page:
                </p>
                
                <div style="background-color: #060708; border: 1px solid rgba(34, 211, 238, 0.3); border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
                  <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; margin-bottom: 8px;">Your 6-Digit Passcode</span>
                  <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #22d3ee; font-family: 'SF Mono', Consolas, Monaco, monospace; display: inline-block;">${code}</span>
                </div>
                
                <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin: 0 0 20px 0;">
                  ⏱ This code is valid for <strong>15 minutes</strong>. If you did not request this password reset, you can safely ignore this email — your password remains unchanged.
                </p>
                
                <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 24px 0;" />
                
                <p style="font-size: 11px; color: #6b7280; margin: 0;">
                  Automated security message from HassanEditz Admin Portal.
                </p>
              </div>
            </body>
          </html>
        `
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Resend rejected the request (${response.status})`);
    }
    return;
  }

  // 2. Fallback to EmailJS if RESEND_API_KEY is not yet configured:
  const siteOrigin = process.env.APP_URL || (process.env.NODE_ENV === "production" ? "https://hassan-editz.vercel.app" : "http://localhost:3001");
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: siteOrigin, Referer: `${siteOrigin}/` },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID || "service_1t3blmm",
      template_id: process.env.EMAILJS_ADMIN_TEMPLATE_ID || "template_zqki0tz",
      user_id: process.env.EMAILJS_PUBLIC_KEY || "Q6SDatIdkncwKll8h",
      template_params: {
        name: "HassanEditz Admin Security",
        email: ADMIN_EMAIL,
        reply_to: ADMIN_EMAIL,
        subject: `Your HassanEditz Password Reset Code: ${code}`,
        project_type: "Admin Password Reset",
        budget: "Security Passcode",
        message: `Your one-time passcode is ${code}. It expires in 15 minutes.`,
        code
      }
    })
  });
  if (!response.ok) throw new Error(`Email delivery failed (${response.status})`);
}

export async function sendAdminCode(code: string) {
  return sendPasswordResetCode(code);
}
