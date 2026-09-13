"use client";

import * as React from "react";
import { LocaleLink } from "@/components/site/locale-link";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { AccountButton } from "@/components/site/account-button";
import { LanguagePicker } from "@/components/site/language-picker";
import { MobileMenu } from "@/components/site/mobile-menu";
import { useAuth } from "@/components/site/auth-provider";
import { GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useSiteText } from "@/lib/use-site-text";

/**
 * Hash targets are written root-relative (`/#demo`, not `#demo`) so the nav
 * works identically from a sub-page like /glossary/iorb, where a bare hash
 * would resolve against the current path and go nowhere.
 */
const LINKS = [
  { href: "/#demo", key: "nav.demo" },
  { href: "/learn", key: "nav.learn" },
  { href: "/teach", key: "nav.teach" },
  { href: "/glossary", key: "nav.glossary" },
  { href: "/#curriculum", key: "nav.syllabus" },
  { href: "/#contribute", key: "nav.contribute" },
] as const;

/**
 * ============================================================================
 * The header
 * ============================================================================
 *
 * Condenses into a glass bar once the hero scrolls away, and on a phone gets
 * out of the way entirely.
 *
 * HEIGHT. 56px on a phone against 64 elsewhere, from `--header-h` so the bar,
 * the six pages that pad themselves under it and the menu sheet that hangs off
 * it cannot disagree. A nav bar is 44pt on iOS; 64 is a sixth of a small screen
 * spent on something nobody is reading.
 *
 * IT HIDES AS YOU READ. Scrolling down retracts the bar, scrolling up brings it
 * straight back — the behaviour Safari's own toolbars have, and on a 390×844
 * screen it is 56px of prose returned to the reader. Three things keep it from
 * being annoying: it is always shown in the top stretch of the page, a small
 * threshold means a stray pixel of movement cannot toggle it, and it is pinned
 * open whenever the menu is, because the sheet is anchored to its underside.
 *
 * Only on a phone, via `useCompactViewport` — a transform set from JavaScript
 * cannot be switched off by a media query in the stylesheet. A pointer has no
 * scroll-to-reveal instinct and a desktop viewport is not short of vertical
 * room.
 *
 * MATERIAL. Blur *and* saturation, the same as the sheet. Blur alone greys out
 * whatever passes under the bar; saturation keeps its colour, which is what
 * makes the bar read as glass over the page rather than as fog.
 *
 * SAFE AREA. Top padding from `env(safe-area-inset-top)`. It is zero in a
 * normally-insetted viewport and becomes the notch the moment anything sets
 * `viewport-fit=cover`, which is the sort of change that otherwise gets found by
 * a reader whose logo is under the camera.
 */
export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const menuButton = React.useRef<HTMLButtonElement>(null);
  const closeMenu = React.useCallback(() => setOpen(false), []);
  const { scrollY } = useScroll();
  const { learner } = useAuth();
  const s = useSiteText();
  const reduceMotion = useReducedMotion();
  const compact = useCompactViewport();
  const lastY = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);

    const delta = latest - lastY.current;
    // 8px of slack: a thumb resting on a scrolling page produces a stream of
    // one-pixel changes, and a bar that answers each of them flickers.
    if (Math.abs(delta) < 8) return;
    lastY.current = latest;

    // Never retract near the top — that is where the logo and the menu are
    // expected to be, and where a reader who has just arrived looks for them.
    setHidden(delta > 0 && latest > 96);
  });

  // The sheet hangs off the bar's underside, so the bar has to be there.
  const retracted = hidden && compact && !open && !reduceMotion;

  return (
    <motion.header
      animate={{ y: retracted ? "-100%" : 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
      }
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        // Also when the menu is open: the sheet hangs off the bottom of this
        // bar, and a transparent bar above it shows the page scrolling past
        // where the sheet's own material should be.
        scrolled || open
          ? "border-b border-hairline bg-canvas/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label={s("nav.aria")}
        className="mx-auto flex h-[var(--header-h)] w-full max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <LocaleLink href="/#top" className="flex items-center gap-2.5 font-display">
          <Logomark />
          <span className="text-lg font-extrabold tracking-tight">
            Open<span className="text-mint-bright">Macro</span>
          </span>
        </LocaleLink>

        <div className="hidden items-center gap-1 md:flex">
          {/*
            Signed in, the dashboard is a place, and places belong in the nav
            with the other places. The account chip on the right links there
            too, but an avatar is an identity, not a signpost — nobody clicks
            their own name looking for their progress.
          */}
          {learner ? (
            <LocaleLink
              href="/dashboard"
              className="mr-1 inline-flex items-center gap-1.5 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-sm font-bold text-mint-bright transition-colors hover:border-mint/60 hover:bg-mint/15"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              {s("nav.dashboard")}
            </LocaleLink>
          ) : null}
          {LINKS.map((link) => (
            <LocaleLink
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              {s(link.key)}
            </LocaleLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* In the header rather than only the footer: a reader who wants the
              course in Portuguese should not have to reach the bottom of the
              page to find out they can have it. */}
          <LanguagePicker />
          <Button asChild variant="outline" size="sm">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              <GithubIcon className="size-4" aria-hidden />
              {s("nav.github")}
            </a>
          </Button>
          <AccountButton />
        </div>

        {/* 44px square, which the padding alone did not give it. */}
        <button
          ref={menuButton}
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-white/5 hover:text-ink active:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-label={open ? s("nav.closeMenu") : s("nav.openMenu")}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </nav>

      <MobileMenu open={open} onClose={closeMenu} links={LINKS} triggerRef={menuButton} />
    </motion.header>
  );
}

/**
 * True below the `md` breakpoint.
 *
 * The retraction is a transform set from JavaScript, so a media query in the
 * stylesheet cannot switch it off — the same reason `useReducedMotion` is needed
 * alongside the global reduced-motion rule. Matched against the same 48rem
 * Tailwind uses, so the behaviour changes exactly where the layout does.
 *
 * `useSyncExternalStore` rather than state plus an effect, for the reason the
 * lint rule gives and the one `LocaleProvider` already documents: a browser-only
 * value read during render is a hydration mismatch, and setting it from an
 * effect is a cascading render. The server snapshot is `false`, which is the
 * safe default — a bar that cannot yet retract is present, and the failure worth
 * avoiding is one that is missing.
 */
function useCompactViewport(): boolean {
  return React.useSyncExternalStore(subscribeToCompact, isCompact, () => false);
}

const COMPACT = "(max-width: 47.999rem)";

function subscribeToCompact(onChange: () => void): () => void {
  const query = window.matchMedia(COMPACT);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isCompact(): boolean {
  return window.matchMedia(COMPACT).matches;
}

/** Coin-and-ledger mark. Inline SVG so it inherits the theme colours. */
function Logomark() {
  return (
    <span
      className="grid size-9 place-items-center rounded-xl border border-mint/30 bg-mint/10"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--color-mint-bright)" strokeWidth="2" />
        <path
          d="M8 14.5c0 1.4 1.8 2.3 4 2.3s4-.9 4-2.6c0-3.6-7.6-1.8-7.6-5 0-1.6 1.7-2.5 3.8-2.5s3.7.9 3.7 2.2"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
