import {
  createHmac,
  randomBytes,
  randomInt,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { redis } from "./redis.js";

const COOKIE = "hassan_admin_session";
export const ADMIN_EMAIL = "hassaneditz333@gmail.com";
const b64url = (value: string | Buffer) =>
  Buffer.from(value).toString("base64url");

export function json(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}

export async function body(req: IncomingMessage) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_200_000) throw new Error("Request too large");
  }
  return JSON.parse(raw || "{}");
}

function secret() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
    throw new Error("SESSION_SECRET must be at least 32 characters");
  return process.env.SESSION_SECRET;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, expectedHash] = storedHash.split(":");
    if (!salt || !expectedHash) return false;
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHash, "hex");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

const DEFAULT_INITIAL_PASSWORD = process.env.ADMIN_PASSWORD;

export async function getAdminPasswordHash(): Promise<string> {
  const stored = await redis(["GET", "admin:password_hash"]);
  if (typeof stored === "string" && stored.includes(":")) {
    return stored;
  }
  if (!DEFAULT_INITIAL_PASSWORD || DEFAULT_INITIAL_PASSWORD.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD must be configured with at least 12 characters",
    );
  }
  const initialHash = hashPassword(DEFAULT_INITIAL_PASSWORD);
  await redis(["SET", "admin:password_hash", initialHash]);
  return initialHash;
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  if (typeof newPassword !== "string" || newPassword.length < 12) {
    throw new Error("Password must be at least 12 characters");
  }
  const newHash = hashPassword(newPassword);
  await redis(["SET", "admin:password_hash", newHash]);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (typeof password !== "string" || !password) return false;
  const hash = await getAdminPasswordHash();
  return verifyPassword(password, hash);
}

export async function createPasswordResetOtp(email: string): Promise<string> {
  const cleanEmail = email.trim().toLowerCase();
  const code = String(randomInt(100000, 1000000));
  await redis(["SET", `admin:reset_code:${cleanEmail}`, code, "EX", 900]);
  return code;
}

export async function verifyPasswordResetOtp(
  email: string,
  code: string,
): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  if (
    cleanEmail !== ADMIN_EMAIL ||
    typeof code !== "string" ||
    !/^\d{6}$/.test(code)
  )
    return false;
  const stored = await redis(["GET", `admin:reset_code:${cleanEmail}`]);
  if (typeof stored !== "string" || stored.length !== 6) return false;
  return timingSafeEqual(Buffer.from(code), Buffer.from(stored));
}

export async function createResetSession(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await redis([
    "SET",
    `admin:reset_token:${token}`,
    email.trim().toLowerCase(),
    "EX",
    600,
  ]);
  await redis(["DEL", `admin:reset_code:${email.trim().toLowerCase()}`]);
  return token;
}

export async function verifyResetToken(token: string): Promise<string | null> {
  if (typeof token !== "string" || !token || token.length < 32) return null;
  const email = await redis(["GET", `admin:reset_token:${token}`]);
  if (typeof email !== "string" || email.trim().toLowerCase() !== ADMIN_EMAIL)
    return null;
  return email;
}

export async function consumeResetToken(token: string): Promise<void> {
  await redis(["DEL", `admin:reset_token:${token}`]);
}

export function sessionCookie(maxAge = 7 * 24 * 60 * 60) {
  const payload = b64url(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + maxAge }),
  );
  const signature = createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${payload}.${signature}; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearCookie() {
  return `${COOKIE}=; Path=/; HttpOnly${process.env.NODE_ENV === "production" ? "; Secure" : ""}; SameSite=Strict; Max-Age=0`;
}

export function isAdmin(req: IncomingMessage) {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!cookie) return false;
  const [payload, supplied] = cookie.split(".");
  if (!payload || !supplied) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  const suppliedBuffer = Buffer.from(supplied, "base64url");
  if (
    suppliedBuffer.length !== expected.length ||
    !timingSafeEqual(expected, suppliedBuffer)
  )
    return false;
  try {
    return (
      JSON.parse(Buffer.from(payload, "base64url").toString()).exp >
      Date.now() / 1000
    );
  } catch {
    return false;
  }
}

export function validOrigin(req: IncomingMessage) {
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return (
    typeof origin === "string" &&
    typeof host === "string" &&
    new URL(origin).host === host
  );
}

export async function rateLimited(
  req: IncomingMessage,
  action = "login",
  limit = 5,
) {
  const ip = String(
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
  )
    .split(",")[0]
    .trim();
  const key = `admin:${action}:${ip}`;
  const count = Number(await redis(["INCR", key]));
  if (count === 1) await redis(["EXPIRE", key, 900]);
  return count > limit;
}
