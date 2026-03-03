import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Edge-compatible rate limiter with jail for repeat offenders.
// Per-instance, but effective because Vercel routes a given IP to the same
// edge PoP in most cases.
// ---------------------------------------------------------------------------
const hits = new Map<string, number[]>();
const jailed = new Map<string, number>(); // IP -> jail expiry timestamp

const WINDOW_MS = 60_000; // 1-minute sliding window
const MAX_PROFESSOR_REQS = 20; // max 20 professor-page loads per minute per IP
const JAIL_DURATION_MS = 10 * 60_000; // 10-minute jail for repeat offenders

function checkRateLimit(ip: string): "ok" | "limited" | "jailed" {
  const now = Date.now();

  // Check jail first (fast path for blocked scrapers)
  const jailExpiry = jailed.get(ip);
  if (jailExpiry && now < jailExpiry) return "jailed";
  if (jailExpiry) jailed.delete(ip);

  // Sliding window check
  const timestamps = hits.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (recent.length > MAX_PROFESSOR_REQS) {
    // Jail the IP so subsequent requests are rejected immediately
    jailed.set(ip, now + JAIL_DURATION_MS);
    hits.delete(ip); // free memory, jail handles blocking now
    return "limited";
  }

  return "ok";
}

// Probabilistic cleanup so the Maps don't grow forever
function maybeCleanup() {
  if (Math.random() > 0.02) return; // ~2% of requests
  const now = Date.now();
  for (const [ip, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hits.delete(ip);
    else hits.set(ip, recent);
  }
  for (const [ip, expiry] of jailed) {
    if (now > expiry) jailed.delete(ip);
  }
}

const BLOCKED_429 = new NextResponse("Too Many Requests", {
  status: 429,
  headers: { "Retry-After": "600" },
});

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /professor/* routes
  if (!pathname.startsWith("/professor/")) return NextResponse.next();

  // 1. Fast validation: OpenAlex author IDs are "A" followed by digits
  const segments = pathname.split("/");
  const id = segments[2];
  if (id && !/^A\d+$/.test(id)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2. Rate-limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  maybeCleanup();

  const status = checkRateLimit(ip);
  if (status !== "ok") return BLOCKED_429;

  return NextResponse.next();
}

export const config = {
  matcher: "/professor/:path*",
};
