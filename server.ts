import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import publicContent from "./api/content.js";
import adminContent from "./api/admin/content.js";
import login from "./api/admin/login.js";
import logout from "./api/admin/logout.js";
import requestCode from "./api/admin/request-code.js";
import verifyResetCode from "./api/admin/verify-reset-code.js";
import resetPassword from "./api/admin/reset-password.js";

process.env.NODE_ENV = "development";
process.env.SESSION_SECRET ||= "local-development-only-session-secret-change-in-production";

const app = express();
const adapt = (handler: (req: any, res: any) => unknown) => (req: any, res: any) => void Promise.resolve(handler(req, res));

app.all("/api/content", adapt(publicContent));
app.all("/api/admin/content", adapt(adminContent));
app.all("/api/admin/login", adapt(login));
app.all("/api/admin/logout", adapt(logout));
app.all("/api/admin/request-code", adapt(requestCode));
app.all("/api/admin/verify-reset-code", adapt(verifyResetCode));
app.all("/api/admin/reset-password", adapt(resetPassword));

const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
app.use(vite.middlewares);
const port = Number(process.env.PORT || 3001);
app.listen(port, "0.0.0.0", () => console.log(`Local website and API ready at http://localhost:${port}`));
