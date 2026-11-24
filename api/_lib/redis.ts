const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const memory = new Map<string, { value: string | number; expires?: number }>();

function localRedis(command: (string | number)[]) {
  const [rawAction, rawKey, ...args] = command;
  const action = String(rawAction).toUpperCase();
  const key = String(rawKey);
  const current = memory.get(key);
  if (current?.expires && current.expires <= Date.now()) memory.delete(key);
  if (action === "GET") return memory.get(key)?.value ?? null;
  if (action === "DEL") { const existed = memory.delete(key); return existed ? 1 : 0; }
  if (action === "INCR") { const value = Number(memory.get(key)?.value || 0) + 1; memory.set(key, { ...memory.get(key), value }); return value; }
  if (action === "EXPIRE") { const item = memory.get(key); if (!item) return 0; item.expires = Date.now() + Number(args[0]) * 1000; return 1; }
  if (action === "SET") {
    const nx = args.map(String).includes("NX");
    if (nx && memory.has(key)) return null;
    const exIndex = args.map((item) => String(item).toUpperCase()).indexOf("EX");
    memory.set(key, { value: String(args[0]), expires: exIndex >= 0 ? Date.now() + Number(args[exIndex + 1]) * 1000 : undefined });
    return "OK";
  }
  throw new Error(`Unsupported local Redis command: ${action}`);
}

export async function redis(command: (string | number)[]) {
  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV !== "production") return localRedis(command);
    throw new Error("Redis environment variables are not configured");
  }
  const response = await fetch(redisUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error("Database request failed");
  const payload = await response.json();
  if (payload.error) throw new Error("Database command failed");
  return payload.result;
}
