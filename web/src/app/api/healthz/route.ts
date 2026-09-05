import { NextResponse } from "next/server";

/**
 * Liveness probe for Cloud Run and uptime checks.
 *
 * Forced dynamic so a cached 200 can never mask a server that has stopped
 * being able to serve requests.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", service: "openmacro-web" });
}
