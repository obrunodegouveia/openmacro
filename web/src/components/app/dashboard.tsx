"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Coins,
  Flame,
  LogOut,
  RotateCcw,
  Trophy,
  User,
} from "lucide-react";
import { DEFAULT_CHALLENGE_XP, MODULES } from "@openmacro/core/content";
import type { Lesson, Module } from "@openmacro/core/content/schema";
import { Button } from "@/components/ui/button";
import { AccountPanel } from "@/components/site/account-button";
import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";
import { readProgress, type ProgressSnapshot } from "@/lib/progress";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * Course dashboard
 * ============================================================================
 *
 * Where signing in actually leads. Answers three questions in order: how far
 * am I, what do I do next, and what have I already done — because "resume" is
 * the only thing most people open this page for.
 *
 * All reads go through the browser Supabase client under row-level security,
 * so this component can only ever see the signed-in learner's own rows.
 */
export function Dashboard() {
  const { enabled, loading, learner, signOut } = useAuth();

  /**
   * The fetched progress, tagged with whose it is.
   *
   * Tagged rather than cleared on sign-out, so the "still loading" state can be
   * *derived* — `result === null` for the current learner — instead of being
   * set synchronously in the effect, which would cost a second render pass on
   * every load and is what the lint rule is protecting against.
   */
  const [result, setResult] = React.useState<
    | { userId: string; status: "ready"; snapshot: ProgressSnapshot }
    | { userId: string; status: "failed" }
    | null
  >(null);

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!learner || !supabase) return;

    const userId = learner.id;
    let cancelled = false;

    readProgress(supabase, userId)
      .then((snapshot) => {
        if (!cancelled) setResult({ userId, status: "ready", snapshot });
      })
      .catch(() => {
        if (!cancelled) setResult({ userId, status: "failed" });
      });

    return () => {
      cancelled = true;
    };
  }, [learner]);

  // A result from a previous session is not this learner's.
  const current = result && learner && result.userId === learner.id ? result : null;
  const snapshot = current?.status === "ready" ? current.snapshot : null;
  const state: "loading" | "ready" | "failed" = !current
    ? "loading"
    : current.status;

  if (!enabled) {
    return (
      <p className="text-sm leading-relaxed text-ink-muted">
        This build has no account backend configured, so there is no progress to
        show. Every lesson still plays — see{" "}
        <Link href="/learn" className="text-mint-bright underline underline-offset-4">
          the course
        </Link>
        .
      </p>
    );
  }

  // Hold the layout while the stored session is restored, rather than flashing
  // a sign-in prompt at somebody who is already signed in.
  if (loading) {
    return <div className="h-64 animate-pulse rounded-card bg-white/5" aria-hidden />;
  }

  if (!learner) {
    return (
      <div>
        <p className="mb-6 text-base leading-relaxed text-ink-muted">
          Sign in to see your XP, your streak and where you left off.
        </p>
        <AccountPanel />
      </div>
    );
  }

  return (
    <DashboardView
      learner={learner}
      snapshot={snapshot}
      state={state}
      onSignOut={() => void signOut()}
    />
  );
}

/**
 * The dashboard itself, with no data fetching in it.
 *
 * Separated from the container so it can be rendered from fixtures — a page
 * that only ever appears for a signed-in learner is otherwise impossible to
 * look at without signing in.
 */
export function DashboardView({
  learner,
  snapshot,
  state,
  onSignOut,
}: {
  learner: { name: string; avatarUrl: string | null };
  snapshot: ProgressSnapshot | null;
  state: "loading" | "ready" | "failed";
  onSignOut: () => void;
}) {
  const progress = summarise(snapshot);

  return (
    <div className="flex flex-col gap-10">
      {/* Who ------------------------------------------------------------- */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar learner={learner} />
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              {learner.name}
            </h1>
            <p className="text-xs font-semibold text-ink-faint">
              {progress.completed === 0
                ? "Nothing finished yet — pick anything below."
                : `${progress.completed} of ${progress.total} lessons finished`}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onSignOut}>
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </header>

      {state === "failed" ? (
        <p role="alert" className="rounded-xl border border-coral/30 bg-coral/[0.07] px-4 py-3 text-sm text-ink-muted">
          Could not load your progress just now. Your lessons still play — try
          reloading the page.
        </p>
      ) : null}

      {/* How far --------------------------------------------------------- */}
      <section aria-label="Your progress" className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<Coins className="size-4" aria-hidden />}
          label="Total XP"
          value={state === "loading" ? "—" : String(progress.totalXp)}
          tone="gold"
        />
        <Stat
          icon={<Flame className="size-4" aria-hidden />}
          label="Day streak"
          value={state === "loading" ? "—" : String(progress.dayStreak)}
          tone={progress.streakActiveToday ? "mint" : "muted"}
          note={
            progress.dayStreak === 0
              ? "Finish a lesson to start one"
              : progress.streakActiveToday
                ? "Kept up today"
                : "Finish a lesson today to keep it"
          }
        />
        <Stat
          icon={<Trophy className="size-4" aria-hidden />}
          label="Course complete"
          value={state === "loading" ? "—" : `${progress.percent}%`}
          tone="mint"
          note={`${progress.completed} of ${progress.total} lessons`}
        />
      </section>

      {/* What next ------------------------------------------------------- */}
      {progress.next ? (
        <section aria-label="Continue">
          <Link
            href={`/learn/${progress.next.lesson.id}`}
            className="group flex items-center gap-4 rounded-card border border-mint/30 bg-mint/[0.06] p-5 transition-colors hover:border-mint/60 hover:bg-mint/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
          >
            <span aria-hidden className="text-3xl">
              {progress.next.lesson.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold uppercase tracking-wider text-mint-bright">
                {progress.completed === 0 ? "Start here" : "Pick up where you left off"}
              </span>
              <span className="mt-1 block font-display text-lg font-extrabold tracking-tight text-ink">
                {progress.next.lesson.title}
              </span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                {progress.next.module.title}
              </span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 text-mint-bright transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </section>
      ) : state === "ready" ? (
        <section className="rounded-card border border-gold/30 bg-gold/[0.06] p-5 text-center">
          <Trophy className="mx-auto size-6 text-gold" aria-hidden />
          <p className="mt-2 font-display text-lg font-extrabold">
            Every lesson finished.
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Replay any of them to raise a best score — or write one, since the
            content is open source.
          </p>
        </section>
      ) : null}

      {/* What is done ----------------------------------------------------- */}
      <section aria-label="All modules" className="flex flex-col gap-8">
        {MODULES.map((module) => (
          <ModuleRow key={module.id} module={module} snapshot={snapshot} />
        ))}
      </section>
    </div>
  );
}

/** One module, with its lessons and how many are done. */
function ModuleRow({
  module,
  snapshot,
}: {
  module: Module;
  snapshot: ProgressSnapshot | null;
}) {
  const done = module.lessons.filter((lesson) => snapshot?.lessons[lesson.id]).length;
  const ratio = module.lessons.length ? done / module.lessons.length : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-base font-extrabold tracking-tight">
          {module.title}
        </h2>
        <p className="shrink-0 text-xs font-bold text-ink-faint">
          {done} / {module.lessons.length}
        </p>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        aria-label={`${module.title} progress`}
      >
        {ratio > 0 ? (
          <div className="h-full rounded-full bg-mint" style={{ width: `${ratio * 100}%` }} />
        ) : null}
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {module.lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonRow lesson={lesson} record={snapshot?.lessons[lesson.id]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LessonRow({
  lesson,
  record,
}: {
  lesson: Lesson;
  record?: { bestXp: number; completions: number };
}) {
  const maxXp = lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );
  const perfect = record ? record.bestXp >= maxXp : false;

  return (
    <Link
      href={`/learn/${lesson.id}`}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
        record
          ? "border-mint/25 bg-mint/[0.05] hover:border-mint/50"
          : "border-hairline bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg border text-base",
          record ? "border-mint/40 bg-mint/10" : "border-hairline bg-white/5",
        )}
      >
        {record ? <Check className="size-4 text-mint-bright" strokeWidth={3} /> : lesson.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink">{lesson.title}</span>
        <span className="block text-xs text-ink-faint">
          {record
            ? `Best ${record.bestXp} / ${maxXp} XP${record.completions > 1 ? ` · ${record.completions} runs` : ""}`
            : `${maxXp} XP available`}
        </span>
      </span>

      {perfect ? (
        <Trophy className="size-4 shrink-0 text-gold" aria-label="Full marks" />
      ) : record ? (
        <RotateCcw className="size-3.5 shrink-0 text-ink-faint" aria-label="Replay" />
      ) : null}
    </Link>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
  tone: "gold" | "mint" | "muted";
}) {
  return (
    <div className="rounded-card border border-hairline bg-white/[0.03] p-5">
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider",
          tone === "gold" ? "text-gold" : tone === "mint" ? "text-mint-bright" : "text-ink-faint",
        )}
      >
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-extrabold tabular-nums">{value}</p>
      {note ? <p className="mt-1 text-xs text-ink-faint">{note}</p> : null}
    </div>
  );
}

function Avatar({ learner }: { learner: { name: string; avatarUrl: string | null } }) {
  if (!learner.avatarUrl) {
    return (
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full border border-hairline bg-white/5"
        aria-hidden
      >
        <User className="size-5 text-ink-muted" />
      </span>
    );
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       A remote Google avatar; routing it through next/image would mean
       configuring a remote pattern to optimise a 48px image. */
    <img
      src={learner.avatarUrl}
      alt=""
      width={48}
      height={48}
      className="size-12 shrink-0 rounded-full border border-hairline object-cover"
      referrerPolicy="no-referrer"
    />
  );
}

/**
 * Folds the snapshot and the course together.
 *
 * "Next" is the first lesson in course order with no record — which is what
 * "where I left off" means when lessons can be played in any order.
 */
function summarise(snapshot: ProgressSnapshot | null) {
  const all = MODULES.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  );
  const completed = snapshot
    ? all.filter(({ lesson }) => snapshot.lessons[lesson.id]).length
    : 0;

  return {
    totalXp: snapshot?.profile.totalXp ?? 0,
    dayStreak: snapshot?.profile.dayStreak ?? 0,
    streakActiveToday: snapshot?.profile.streakActiveToday ?? false,
    completed,
    total: all.length,
    percent: all.length ? Math.round((completed / all.length) * 100) : 0,
    next: all.find(({ lesson }) => !snapshot?.lessons[lesson.id]) ?? null,
  };
}
