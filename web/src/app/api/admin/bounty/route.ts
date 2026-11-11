import { NextResponse } from "next/server";

import { getAdminFromRequest, recordAdminEvent } from "@/lib/rewards/admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * ============================================================================
 * The bounty, from the organiser's side
 * ============================================================================
 *
 * GET  — everyone who has passed a bounty exam, first first, with where to
 *        pay them, whether they have been paid, and the facts to check before
 *        paying (when their lessons were finished, how long the exam took).
 * POST — { action: "mark-paid", userId, txid }: records a payment made by
 *        hand from the organiser's own wallet. Nothing here sends bitcoin.
 *
 * Gated by the same allow-list as the treasury (`REWARDS_ADMIN_EMAILS`), and
 * a 404 to everyone else.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function forbidden() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

interface ExamRow {
  user_id: string;
  submitted_at: string;
  asked: number;
  correct: number;
  duration_seconds: number | null;
  leaves: number;
}

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return forbidden();
  const db = getSupabaseAdmin();

  const { data: exams, error } = await db
    .from("assigned_exams")
    .select("user_id, submitted_at, asked, correct, duration_seconds, leaves")
    .eq("bounty", true)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const passed = ((exams ?? []) as ExamRow[]).filter(
    (exam) => exam.asked > 0 && exam.correct >= Math.ceil(exam.asked * 0.7),
  );
  const ids = passed.map((exam) => exam.user_id);

  const [{ data: payouts }, { data: lessons }] = await Promise.all([
    ids.length
      ? db.from("bounty_payouts").select("user_id, btc_address, submitted_at, paid_at, txid").in("user_id", ids)
      : Promise.resolve({ data: [] }),
    ids.length
      ? db.from("lesson_progress").select("user_id, best_xp, last_completed_at").in("user_id", ids)
      : Promise.resolve({ data: [] }),
  ]);

  const winners = passed.map((exam) => {
    const payout = (payouts ?? []).find((row) => row.user_id === exam.user_id) ?? null;
    const own = (lessons ?? []).filter((row) => row.user_id === exam.user_id);
    const times = own
      .map((row) => row.last_completed_at as string | null)
      .filter((time): time is string => Boolean(time))
      .sort();
    return {
      userId: exam.user_id,
      submittedAt: exam.submitted_at,
      score: `${exam.correct}/${exam.asked}`,
      durationSeconds: exam.duration_seconds,
      leaves: exam.leaves,
      lessonXp: own.reduce((sum, row) => sum + (row.best_xp ?? 0), 0),
      lessons: own.filter((row) => row.best_xp > 0).length,
      firstLessonAt: times[0] ?? null,
      lastLessonAt: times[times.length - 1] ?? null,
      address: payout?.btc_address ?? null,
      paidAt: payout?.paid_at ?? null,
      txid: payout?.txid ?? null,
    };
  });

  return NextResponse.json({ winners });
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return forbidden();

  const body = (await request.json().catch(() => null)) as
    | { action?: unknown; userId?: unknown; txid?: unknown }
    | null;
  const userId = typeof body?.userId === "string" ? body.userId : "";
  const txid = typeof body?.txid === "string" ? body.txid.trim().toLowerCase() : "";
  if (body?.action !== "mark-paid") {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
  if (!/^[0-9a-f-]{36}$/.test(userId)) {
    return NextResponse.json({ error: "Missing winner." }, { status: 400 });
  }
  if (!/^[0-9a-f]{64}$/.test(txid)) {
    return NextResponse.json({ error: "A transaction ID is 64 hexadecimal characters." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("bounty_payouts")
    .update({ paid_at: new Date().toISOString(), txid })
    .eq("user_id", userId)
    .is("paid_at", null)
    .select("user_id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: "No unpaid address for this winner." }, { status: 409 });
  }

  await recordAdminEvent(admin.email, "bounty.mark-paid", { userId, txid });
  return NextResponse.json({ ok: true });
}
