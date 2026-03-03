import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Edge-compatible sliding-window rate limiter (per-instance, still effective
// because Vercel routes a given IP to the same edge PoP).
// ---------------------------------------------------------------------------
const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1-minute window
const MAX_PROFESSOR_REQS = 20; // max 20 professor-page loads per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(ip) ?? [];

  // Drop entries older than the window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  return recent.length > MAX_PROFESSOR_REQS;
}

// Probabilistic cleanup so the Map doesn't grow forever
function maybeCleanup() {
  if (Math.random() > 0.02) return; // ~2% of requests
  const now = Date.now();
  for (const [ip, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hits.delete(ip);
    else hits.set(ip, recent);
  }
}

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

  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/professor/:path*",
};
