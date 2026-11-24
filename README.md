# HassanEditz website

## Local development

```bash
npm install
npm run dev
```

## Secure admin deployment

The admin panel is available at `/admin`. It authenticates `hassaneditz333@gmail.com` with a permanent password.

If you ever need to reset or change the password:
1. Click **"Forgot password?"** on the login page.
2. Enter `hassaneditz333@gmail.com` to receive a 6-digit one-time verification passcode.
3. Verify the passcode.
4. Enter and confirm your new password in the two password boxes.

### Environment variables in Vercel

Add these in **Vercel > Project Settings > Environment Variables**:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SESSION_SECRET`
- `ADMIN_PASSWORD` (required initial password, minimum 12 characters)
- `RESEND_API_KEY` (Free API key from resend.com - 3,000 free emails/month, zero templates needed)
- `EMAILJS_SERVICE_ID` (used by client contact form)
- `EMAILJS_ADMIN_TEMPLATE_ID` (used by client contact form)
- `EMAILJS_PUBLIC_KEY` (used by client contact form)

Generate the session secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Verification

```bash
npm run lint
npm run build
```
