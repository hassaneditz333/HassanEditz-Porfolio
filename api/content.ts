import type { IncomingMessage, ServerResponse } from "node:http";
import { defaultContent } from "../src/content.js";
import { redis } from "./_lib/redis.js";
import { json } from "./_lib/security.js";

export default async function handler(
  _req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const saved = await redis(["GET", "site:content"]);
    const parsed = saved ? JSON.parse(saved) : defaultContent;
    json(res, 200, {
      ...defaultContent,
      ...parsed,
      workCategories: parsed.workCategories || defaultContent.workCategories,
    });
  } catch {
    json(res, 200, defaultContent);
  }
}
