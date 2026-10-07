type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();
export function rateLimit(key: string, max: number, windowMs: number) { const now = Date.now(); const current = buckets.get(key); if (!current || current.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, retryAfter: 0 }; } current.count += 1; return { allowed: current.count <= max, retryAfter: Math.ceil((current.resetAt - now) / 1000) }; }
export function clientKey(request: Request) { const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(); return forwarded || request.headers.get("x-real-ip") || "unknown"; }
