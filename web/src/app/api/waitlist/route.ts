import { NextResponse } from "next/server";

/**
 * ============================================================================
 * App Store launch waitlist
 * ============================================================================
 *
 * Storage is intentionally pluggable. Out of the box a signup is written as a
 * structured line to stdout, which Cloud Run ships straight to Cloud Logging —
 * enough to launch with, and it keeps personal data out of any third party we
 * have not vetted. Set `WAITLIST_WEBHOOK_URL` to also forward the signup to a
 * list provider (Buttondown, Loops, a Cloud Function writing to Firestore...).
 *
 * Note for whoever wires up a real provider: signups are personal data, and
 * some of these visitors are parents signing up on behalf of a child. Keep the
 * retention window short and honour deletion requests — see /privacy.
 */

export const runtime = "nodejs";
/** Never cache a mutation. */
export const dynamic = "force-dynamic";

/** Deliberately permissive: reject the obviously broken, not the unusual. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ROLES = ["learner", "parent", "educator", "developer"] as const;
type Role = (typeof ROLES)[number];

interface WaitlistPayload {
  email?: unknown;
  role?: unknown;
  /** Honeypot: a real human never fills a field they cannot see. */
  company?: unknown;
}

/**
 * Fixed-window rate limit, per instance.
 *
 * Cloud Run runs many instances, so this is a speed bump rather than a real
 * limit — it exists to blunt a naive script. Put Cloud Armor in front of the
 * load balancer if abuse becomes a genuine problem.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) return true;

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5_000) {
    for (const [key, value] of hits) {
      if (now > value.resetAt) hits.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many signups from this address. Try again shortly." },
      { status: 429 },
    );
  }

  let payload: WaitlistPayload;
  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  // Silently accept honeypot hits: a bot that gets a 400 just tries again.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true, message: "You're on the list." });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Enter your email address." },
      { status: 400 },
    );
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const role: Role = ROLES.includes(payload.role as Role)
    ? (payload.role as Role)
    : "learner";

  const signup = {
    severity: "INFO",
    event: "waitlist_signup",
    email,
    role,
    at: new Date().toISOString(),
  };

  // Structured JSON is parsed into fields by Cloud Logging.
  console.log(JSON.stringify(signup));

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WAITLIST_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.WAITLIST_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ email, role, source: "openmacro.org" }),
        signal: AbortSignal.timeout(5_000),
      });
      if (!res.ok) {
        console.error(
          JSON.stringify({
            severity: "ERROR",
            event: "waitlist_webhook_failed",
            status: res.status,
          }),
        );
      }
    } catch (error) {
      // The signup is already in the logs, so a webhook failure must not
      // surface to the visitor as an error.
      console.error(
        JSON.stringify({
          severity: "ERROR",
          event: "waitlist_webhook_error",
          message: error instanceof Error ? error.message : "unknown",
        }),
      );
    }
  }

  return NextResponse.json({ ok: true, message: "You're on the list." });
}
