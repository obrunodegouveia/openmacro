"use client";

import * as React from "react";
import { useSiteText } from "@/lib/use-site-text";
import { LocaleLink } from "@/components/site/locale-link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Flame,
  LogOut,
  RotateCcw,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { DEFAULT_CHALLENGE_XP, MODULES } from "@openmacro/core/content";
import type { Lesson, Module } from "@openmacro/core/content/schema";
import { Button } from "@/components/ui/button";
import { AccountPanel } from "@/components/site/account-button";
import { useAuth } from "@/components/site/auth-provider";
import { SignedOutWarning } from "@/components/site/signed-out-warning";
import { useProgressSnapshot } from "@/lib/use-progress";
import type { ProgressSnapshot } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { SeasonalCardEdge, SeasonalGreeting, SeasonalIcon } from "@/components/site/seasonal-decor";

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
export function Dashboard({ money }: { money?: React.ReactNode }) {
  const s = useSiteText();
  const { signOut, learner } = useAuth();
  const { snapshot, state, signedIn, enabled, restoring } = useProgressSnapshot();

  if (!enabled) {
    return (
      <p className="text-sm leading-relaxed text-ink-muted">
        {s("dash.noBackend.lead")}{" "}
        <LocaleLink href="/learn" className="text-mint-bright underline underline-offset-4">
          {s("dash.noBackend.link")}
        </LocaleLink>
        .
      </p>
    );
  }

  // Hold the layout while the stored session is restored, rather than flashing
  // a sign-in prompt at somebody who is already signed in.
  if (restoring) {
    return <div className="h-64 animate-pulse rounded-card bg-veil/5" aria-hidden />;
  }

  return (
    <DashboardView
      learner={learner ?? { name: "Your progress", avatarUrl: null }}
      snapshot={snapshot}
      state={state}
      signedIn={signedIn}
      onSignOut={() => void signOut()}
      money={money}
    />
  );
}


/**
 * Today: the signed-in home.
 *
 * Answers, in this order, the only questions people open it with: what do I
 * do now, how am I doing, is there money for me, and what could I do better.
 * The full course is last and collapsed, open only at the module in progress,
 * because a wall of 180 equal tiles answers none of those questions.
 *
 * Separated from the container so it can be rendered from fixtures — a page
 * that only ever appears for a signed-in learner is otherwise impossible to
 * look at without signing in.
 */
export function DashboardView({
  learner,
  snapshot,
  state,
  signedIn = true,
  onSignOut,
  money,
}: {
  learner: { name: string; avatarUrl: string | null };
  snapshot: ProgressSnapshot | null;
  state: "loading" | "ready" | "failed";
  /** Signed out, the same view shows this device's progress instead. */
  signedIn?: boolean;
  onSignOut: () => void;
  /** Reward panels; each renders nothing unless this account is paid. */
  money?: React.ReactNode;
}) {
  const s = useSiteText();
  const progress = summarise(snapshot);
  const loading = state === "loading";
  const firstName = learner.name.trim().split(/\s+/)[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      <SignedOutWarning />

      {/* Who and the streak ------------------------------------------------ */}
      <header className="flex items-center gap-4">
        <Avatar learner={learner} />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">
            {signedIn && firstName ? s("today.hello", { name: firstName }) : s("today.helloAnon")}
          </h1>
          <SeasonalGreeting />
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink-muted">
            <SeasonalIcon role="streak" className={cn("text-base", !progress.streakActiveToday && "opacity-40")}>
              <Flame
                className={cn("size-4", progress.streakActiveToday ? "text-gold" : "text-ink-faint")}
                aria-hidden
              />
            </SeasonalIcon>
            {loading
              ? " "
              : progress.dayStreak === 0
                ? s("today.streak.none")
                : progress.streakActiveToday
                  ? s("today.streak.kept", { count: progress.dayStreak })
                  : s("today.streak.atRisk", { count: progress.dayStreak })}
          </p>
        </div>
      </header>

      {state === "failed" ? (
        <p role="alert" className="rounded-xl border border-coral/30 bg-coral/[0.07] px-4 py-3 text-sm text-ink-muted">
          {s("dash.loadFailed")}
        </p>
      ) : null}

      {/* What next: the one thing this page is for ------------------------ */}
      {progress.next ? (
        <section
          aria-label={s("dash.continueAria")}
          className="relative rounded-card border border-mint/30 bg-mint/[0.06] p-5 sm:p-6"
        >
          <SeasonalCardEdge />
          <p className="text-sm font-bold text-mint-bright">
            {progress.completed === 0 ? s("dash.startHere") : s("dash.pickUp")}
            <span className="font-semibold text-ink-muted"> · {progress.next.module.title}</span>
          </p>
          <div className="mt-3 flex items-start gap-4">
            <span aria-hidden className="text-4xl leading-none">
              {progress.next.lesson.icon}
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-extrabold tracking-tight text-ink text-balance">
                {progress.next.lesson.title}
              </h2>
              <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden />
                  {s("today.minutes", { count: progress.next.lesson.estimatedMinutes })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="size-3.5" aria-hidden />
                  {s("dash.xpAvailable", { max: maxXpOf(progress.next.lesson) })}
                </span>
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
            <LocaleLink href={`/learn/${progress.next.lesson.id}`}>
              {progress.completed === 0 ? s("today.start") : s("today.continue")}
              <ArrowRight className="size-4" aria-hidden />
            </LocaleLink>
          </Button>
        </section>
      ) : state === "ready" ? (
        <section className="rounded-card border border-gold/30 bg-gold/[0.06] p-5 text-center">
          <Trophy className="mx-auto size-6 text-gold" aria-hidden />
          <p className="mt-2 font-display text-lg font-extrabold">{s("dash.allDone")}</p>
          <p className="mt-1 text-sm text-ink-muted">{s("dash.allDoneBody")}</p>
        </section>
      ) : null}

      {/* How far, in one glance ------------------------------------------- */}
      <section
        aria-label={s("dash.progressAria")}
        className="flex items-center gap-5 rounded-card border border-hairline bg-veil/[0.03] p-5"
      >
        <ProgressRing ratio={loading ? 0 : progress.percent / 100} size={72} stroke={8}>
          <span className="font-display text-base font-extrabold tabular-nums">
            {loading ? "—" : `${progress.percent}%`}
          </span>
        </ProgressRing>
        <div className="grid min-w-0 gap-1">
          <p className="font-display text-lg font-extrabold tracking-tight">
            {s("dash.lessonsOf", { done: progress.completed, total: progress.total })}
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-muted">
            <Zap className="size-4 text-gold" aria-hidden />
            {loading ? "—" : s("today.xp", { xp: progress.totalXp })}
          </p>
        </div>
      </section>

      {/* Money, when there is any: right under progress, not after the course. */}
      {money}

      {!signedIn ? (
        <section className="rounded-card border border-hairline bg-veil/[0.03] p-5">
          <h2 className="font-display text-lg font-extrabold tracking-tight">{s("dash.onDevice")}</h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-muted">{s("dash.onDeviceBody")}</p>
          <AccountPanel className="mt-5" redirectTo="/dashboard" />
        </section>
      ) : null}

      {/* Sharpen up: the replay offer, once, instead of a score on every tile. */}
      {progress.sharpen.length > 0 ? (
        <section aria-labelledby="sharpen-title" className="grid grid-cols-[minmax(0,1fr)] gap-3">
          <div>
            <h2 id="sharpen-title" className="font-display text-lg font-extrabold tracking-tight">
              {s("today.sharpen.title")}
            </h2>
            <p className="text-sm text-ink-muted">{s("today.sharpen.body")}</p>
          </div>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-2">
            {progress.sharpen.map(({ lesson, best, max }) => (
              <li key={lesson.id}>
                <LocaleLink
                  href={`/learn/${lesson.id}`}
                  className="flex min-h-14 items-center gap-3 rounded-xl border border-hairline bg-veil/[0.03] px-4 py-3 transition-colors hover:border-veil/25 hover:bg-veil/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
                >
                  <span aria-hidden className="text-xl">{lesson.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem] font-bold text-ink">{lesson.title}</span>
                    <span className="block text-sm text-ink-muted">
                      {s("dash.best", { best, max })}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-mint-bright">
                    <RotateCcw className="size-4" aria-hidden />
                    {s("today.sharpen.redo")}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* The course, collapsed, in course order ---------------------------- */}
      <section aria-labelledby="course-title" className="grid grid-cols-[minmax(0,1fr)] gap-3">
        <h2 id="course-title" className="font-display text-lg font-extrabold tracking-tight">
          {s("today.course.title")}
        </h2>
        {/* minmax(0,1fr) on these grids: an `auto` track grows to the longest
            lesson title and pushed the page wider than a phone. */}
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-2" aria-label={s("dash.allModulesAria")}>
          {MODULES.map((module) => (
            <li key={module.id}>
              <ModuleRow
                module={module}
                snapshot={snapshot}
                current={progress.next?.module.id === module.id}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Account, last ----------------------------------------------------- */}
      {signedIn ? (
        <section className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6">
          <p className="text-sm text-ink-muted">{s("today.signedInAs", { name: learner.name })}</p>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            <LogOut className="size-4" aria-hidden />
            {s("dash.signOut")}
          </Button>
        </section>
      ) : null}
    </div>
  );
}

/**
 * One module as a disclosure row: a small ring, the title and the count.
 * Open by default only for the module the learner is in.
 */
function ModuleRow({
  module,
  snapshot,
  current,
}: {
  module: Module;
  snapshot: ProgressSnapshot | null;
  current: boolean;
}) {
  const s = useSiteText();
  const done = module.lessons.filter((lesson) => snapshot?.progress[lesson.id]).length;
  const total = module.lessons.length;
  const complete = total > 0 && done === total;

  return (
    <details
      open={current}
      className="group rounded-card border border-hairline bg-veil/[0.03] open:bg-veil/[0.045]"
    >
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <ProgressRing ratio={total ? done / total : 0} size={36} stroke={4}>
          {complete ? <Check className="size-4 text-mint-bright" strokeWidth={3} aria-hidden /> : null}
        </ProgressRing>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[0.95rem] font-extrabold tracking-tight text-ink">
            {module.title}
          </span>
          <span className="block text-sm text-ink-muted">
            {s("dash.lessonsOf", { done, total })}
          </span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-ink-faint transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-1 px-2 pb-2">
        {module.lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonRow lesson={lesson} record={snapshot?.progress[lesson.id]} />
          </li>
        ))}
      </ul>
    </details>
  );
}

function LessonRow({
  lesson,
  record,
}: {
  lesson: Lesson;
  record?: { bestXp: number; completions: number };
}) {
  const s = useSiteText();
  const maxXp = maxXpOf(lesson);
  const perfect = record ? record.bestXp >= maxXp : false;

  return (
    <LocaleLink
      href={`/learn/${lesson.id}`}
      className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-veil/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
    >
      <span
        aria-hidden
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full text-base",
          record ? "bg-mint/15" : "bg-veil/5",
        )}
      >
        {record ? <Check className="size-4 text-mint-bright" strokeWidth={3} /> : lesson.icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[0.95rem] font-semibold text-ink">
        {lesson.title}
      </span>
      {perfect ? (
        <Trophy className="size-4 shrink-0 text-gold" aria-label={s("dash.fullMarks")} />
      ) : record ? null : (
        <span className="shrink-0 text-sm text-ink-muted">
          {s("today.minutes", { count: lesson.estimatedMinutes })}
        </span>
      )}
    </LocaleLink>
  );
}

/**
 * A progress ring. Decorative: every ring sits beside the same number in text.
 *
 * @param ratio    Filled share, 0 to 1.
 * @param size     Diameter in px.
 * @param stroke   Ring thickness in px.
 * @param children What sits in the middle.
 */
function ProgressRing({
  ratio,
  size,
  stroke,
  children,
}: {
  ratio: number;
  size: number;
  stroke: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(1, ratio));
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-veil/10" />
        {filled > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - filled)}
            className="stroke-mint transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
          />
        ) : null}
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** The most XP a lesson can award, read from its challenges. */
function maxXpOf(lesson: Lesson): number {
  return lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );
}

function Avatar({ learner }: { learner: { name: string; avatarUrl: string | null } }) {
  if (!learner.avatarUrl) {
    return (
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full border border-hairline bg-veil/5"
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
    ? all.filter(({ lesson }) => snapshot.progress[lesson.id]).length
    : 0;

  return {
    totalXp: snapshot?.profile.totalXp ?? 0,
    dayStreak: snapshot?.profile.dayStreak ?? 0,
    streakActiveToday: snapshot?.profile.streakActiveToday ?? false,
    completed,
    total: all.length,
    percent: all.length ? Math.round((completed / all.length) * 100) : 0,
    next: all.find(({ lesson }) => !snapshot?.progress[lesson.id]) ?? null,
    // Finished but not perfect, weakest share first; three is a session, not a backlog.
    sharpen: all
      .flatMap(({ lesson }) => {
        const record = snapshot?.progress[lesson.id];
        if (!record) return [];
        const max = maxXpOf(lesson);
        return record.bestXp < max ? [{ lesson, best: record.bestXp, max }] : [];
      })
      .sort((a, b) => a.best / a.max - b.best / b.max)
      .slice(0, 3),
  };
}
