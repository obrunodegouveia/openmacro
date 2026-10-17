"use client";

import Image from "next/image";
import { RefreshCw, ShieldCheck, WifiOff } from "lucide-react";

import { Section } from "@/components/ui/section";
import { useSiteText } from "@/lib/use-site-text";
import { APP_STORE_URL, PLAY_STORE_LIVE, PLAY_STORE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * "Get the app" — the home page's invitation to install.
 *
 * Sits right after the playable demo: the visitor has just answered a real
 * question, which is the moment carrying the course in a pocket means most.
 *
 * Every reason given to install has to be true of the build in the stores
 * *today*, not of the next one. That is why the reminder and the home-screen
 * widget are not listed: they ship with 1.1.0, which the App Store does not
 * have yet. Offline lessons, progress that syncs with this site, and no ads
 * are true on both platforms now.
 *
 * The phones are real screenshots of the app, not mock-ups, so what the
 * banner promises is what the learner sees when it opens.
 */
export function GetTheApp() {
  const s = useSiteText();

  const perks = [
    { icon: WifiOff, title: s("app.perk.offline.title"), body: s("app.perk.offline.body") },
    { icon: RefreshCw, title: s("app.perk.sync.title"), body: s("app.perk.sync.body") },
    { icon: ShieldCheck, title: s("app.perk.free.title"), body: s("app.perk.free.body") },
  ];

  return (
    <Section id="app" aria-labelledby="app-title">
      <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-surface px-6 py-12 sm:px-10 md:px-14 md:py-16">
        {/* Light in the corners, in the brand's mint and the course's azure. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-mint/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-azure/15 blur-3xl"
        />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mint-bright">
              {s("app.overline")}
            </p>
            <h2
              id="app-title"
              className="mt-4 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]"
            >
              {s("app.title.lead")}{" "}
              <span className="text-gradient">{s("app.title.emphasis")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              {s("app.lede")}
            </p>

            <ul className="mt-8 grid gap-5">
              {perks.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-mint/25 bg-mint/10 text-mint-bright">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <StoreBadge
                href={APP_STORE_URL}
                eyebrow={s("app.store.apple.eyebrow")}
                name="App Store"
                icon={<AppleLogo />}
              />
              <StoreBadge
                href={PLAY_STORE_LIVE ? PLAY_STORE_URL : undefined}
                eyebrow={
                  PLAY_STORE_LIVE ? s("app.store.google.eyebrow") : s("app.store.google.soon")
                }
                name="Google Play"
                icon={<PlayLogo />}
              />
            </div>

            {/* A phone is the only way to install, so on a computer the QR
                code is the shortest path from interest to the store. */}
            <div className="mt-8 hidden items-center gap-4 lg:flex">
              <div className="rounded-xl bg-white p-2.5 shadow-lg shadow-black/20">
                <Image
                  src="/app/qr-openmacro-app.svg"
                  alt={s("app.qr.alt")}
                  width={84}
                  height={84}
                  unoptimized
                />
              </div>
              <p className="max-w-[16rem] text-sm leading-relaxed text-ink-muted">
                <span className="font-bold text-ink">{s("app.qr.title")}</span>{" "}
                {s("app.qr.body")}
              </p>
            </div>
          </div>

          <Phones
            today={s("app.shot.today")}
            lesson={s("app.shot.lesson")}
            streak={s("app.chip.streak")}
            offline={s("app.chip.offline")}
          />
        </div>
      </div>
    </Section>
  );
}

/**
 * Two real screens, overlapped and tilted apart, with two chips that name what
 * they show. The chips float on the site's own `animate-float`, which the
 * global reduced-motion rule already stills.
 */
function Phones({
  today,
  lesson,
  streak,
  offline,
}: {
  today: string;
  lesson: string;
  streak: string;
  offline: string;
}) {
  return (
    <div className="relative mx-auto h-[30rem] w-full max-w-[26rem] sm:h-[35rem] lg:h-[38rem]">
      <PhoneFrame
        src="/app/screen-lesson.jpg"
        alt={lesson}
        className="absolute right-0 top-10 w-[54%] rotate-6 opacity-90"
      />
      <PhoneFrame
        src="/app/screen-today.jpg"
        alt={today}
        className="absolute left-2 top-0 w-[60%] -rotate-3 shadow-2xl shadow-black/40"
      />
      <span className="absolute -left-2 bottom-20 animate-float rounded-full border border-gold/30 bg-surface-raised px-3.5 py-2 text-sm font-bold text-gold shadow-lg shadow-black/30 sm:left-0">
        <span aria-hidden>🔥</span> {streak}
      </span>
      <span className="absolute bottom-6 right-0 animate-float rounded-full border border-mint/30 bg-surface-raised px-3.5 py-2 text-sm font-bold text-mint-bright shadow-lg shadow-black/30 [animation-delay:-3.5s]">
        <WifiOff className="mr-1.5 inline size-4 -translate-y-px" aria-hidden />
        {offline}
      </span>
    </div>
  );
}

function PhoneFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border-[7px] border-[#0b0f19] bg-[#0b0f19] ring-1 ring-white/10",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={540}
        height={1200}
        sizes="(min-width: 1024px) 210px, 45vw"
        className="block h-auto w-full rounded-[1.5rem]"
      />
    </div>
  );
}

/**
 * A store button. Without `href` it renders as an unavailable button rather
 * than a link, so "coming soon" cannot be clicked into a 404.
 */
function StoreBadge({
  href,
  eyebrow,
  name,
  icon,
}: {
  href?: string;
  eyebrow: string;
  name: string;
  icon: React.ReactNode;
}) {
  const body = (
    <>
      <span className="size-7 shrink-0" aria-hidden>
        {icon}
      </span>
      <span className="flex flex-col text-left leading-none">
        <span className="text-[0.68rem] font-semibold tracking-wide opacity-80">{eyebrow}</span>
        <span className="mt-1 text-lg font-bold tracking-tight">{name}</span>
      </span>
    </>
  );

  const base =
    "inline-flex h-14 items-center gap-3 rounded-xl border px-4 transition-transform";

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(base, "cursor-default border-hairline bg-transparent text-ink-faint")}
      >
        {body}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        base,
        "border-white/15 bg-black text-white hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
      )}
    >
      {body}
    </a>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M16.37 12.62c-.02-2.36 1.93-3.5 2.02-3.55-1.1-1.61-2.82-1.83-3.43-1.85-1.46-.15-2.85.86-3.59.86-.75 0-1.89-.84-3.1-.82-1.6.02-3.07.93-3.89 2.36-1.66 2.88-.42 7.14 1.19 9.48.79 1.14 1.73 2.42 2.96 2.38 1.19-.05 1.64-.77 3.08-.77 1.43 0 1.84.77 3.1.74 1.28-.02 2.09-1.16 2.87-2.31.9-1.32 1.27-2.6 1.3-2.67-.03-.01-2.48-.95-2.51-3.85ZM14.01 5.69c.65-.8 1.1-1.9.98-3.0-.94.04-2.09.63-2.77 1.42-.6.7-1.14 1.83-1 2.9 1.05.08 2.13-.53 2.79-1.32Z" />
    </svg>
  );
}

function PlayLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-full">
      <path fill="#34A853" d="M3.6 2.3c-.3.3-.4.7-.4 1.2v17c0 .5.1.9.4 1.2l.1.1 9.5-9.5v-.2L3.7 2.2l-.1.1Z" />
      <path fill="#FBBC04" d="m16.4 15.5-3.2-3.2v-.2l3.2-3.2.1.1 3.8 2.1c1.1.6 1.1 1.6 0 2.2l-3.8 2.1-.1.1Z" />
      <path fill="#EA4335" d="m16.5 15.4-3.3-3.3-9.6 9.6c.4.4.9.4 1.6.1l11.3-6.4" />
      <path fill="#4285F4" d="M16.5 8.7 5.2 2.3c-.7-.4-1.2-.3-1.6.1l9.6 9.6 3.3-3.3Z" />
    </svg>
  );
}
