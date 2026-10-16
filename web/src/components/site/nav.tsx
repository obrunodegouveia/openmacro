"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LocaleLink } from "@/components/site/locale-link";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { BookA, BookOpen, Ellipsis, House, Menu, X } from "lucide-react";
import { AccountButton } from "@/components/site/account-button";
import { LanguagePicker } from "@/components/site/language-picker";
import { MobileMenu } from "@/components/site/mobile-menu";
import { useAuth } from "@/components/site/auth-provider";
import { stripLocale } from "@/lib/locale-path";
import { cn } from "@/lib/utils";
import { useSiteText } from "@/lib/use-site-text";
import { BrandLogo } from "@/components/site/brand-logo";

/**
 * Hash targets are written root-relative (`/#demo`, not `#demo`) so the nav
 * works identically from a sub-page like /glossary/iorb, where a bare hash
 * would resolve against the current path and go nowhere.
 *
 * The header carries places people return to, and nothing else: four at most
 * with Today. Everything that is read once (the demo, the syllabus, how to
 * contribute) lives in the menu sheet and the footer, where there is room to
 * spell it out.
 */
const PRIMARY = [
  { href: "/learn", key: "nav.learn" },
  { href: "/glossary", key: "nav.glossary" },
  { href: "/teach", key: "nav.teach" },
] as const;

const SECONDARY = [
  { href: "/#demo", key: "nav.demo" },
  { href: "/#curriculum", key: "nav.syllabus" },
  { href: "/#contribute", key: "nav.contribute" },
] as const;

const SHEET_LINKS = [...PRIMARY, ...SECONDARY] as const;

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
 * Only below `md`, via `useCompactViewport`, which is a different threshold from
 * the `xl` the navigation collapses at — see that hook for why one number for
 * both was wrong.
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
  const here = stripLocale(usePathname() ?? "/");
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
    <>
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
          <LocaleLink href={learner ? "/dashboard" : "/#top"} className="flex min-h-11 shrink-0 items-center">
            <BrandLogo />
          </LocaleLink>

          <div className="hidden items-center gap-1 lg:flex">
            {(learner ? [{ href: "/dashboard", key: "nav.dashboard" } as const, ...PRIMARY] : PRIMARY).map(
              (link) => {
                const active = isCurrent(link.href, here);
                return (
                  <LocaleLink
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-[0.95rem] font-bold transition-colors",
                      active
                        ? "bg-white/[0.08] text-ink"
                        : "text-ink-muted hover:bg-white/5 hover:text-ink",
                    )}
                  >
                    {s(link.key)}
                  </LocaleLink>
                );
              },
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {/* Signed out, the language choice is the first thing a Portuguese
                reader looks for. Signed in, it is a setting they made once, so
                it lives in the menu sheet and the footer. */}
            {learner ? null : <LanguagePicker />}
            <AccountButton />
          </div>

          {/* 44px square, which the padding alone did not give it. */}
          <button
            ref={menuButton}
            type="button"
            className={cn(
              "-mr-2 size-11 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-white/5 hover:text-ink active:bg-white/10 lg:hidden",
              // Signed in on a phone, the tab bar's More opens the same sheet.
              learner ? "hidden md:grid" : "grid",
            )}
            aria-expanded={open}
            aria-label={open ? s("nav.closeMenu") : s("nav.openMenu")}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </nav>

        <MobileMenu open={open} onClose={closeMenu} links={SHEET_LINKS} triggerRef={menuButton} />
      </motion.header>
      {/* A sibling of the header, not a child: the header is transformed as it
          retracts, and a transformed ancestor would pin this to the header's
          bottom edge instead of the screen's. */}
      {learner ? (
        <TabBar here={here} menuOpen={open} onMore={() => setOpen((value) => !value)} />
      ) : null}
    </>
  );
}

/**
 * The phone tab bar, for signed-in learners.
 *
 * The same four places as the header, where a thumb can reach them, which is
 * how the app is navigated too. Fixed to the bottom with the home-indicator
 * inset added to its padding; the body reserves the same height (see
 * globals.css) so the last line of a page is never under it. Hidden from `md`
 * up, where the header has room for everything.
 *
 * Rendered beside the header, never inside it, so the header's retract
 * transform cannot move it.
 */
function TabBar({
  here,
  menuOpen,
  onMore,
}: {
  here: string;
  menuOpen: boolean;
  onMore: () => void;
}) {
  const s = useSiteText();
  const tabs = [
    { href: "/dashboard", key: "nav.dashboard", icon: House },
    { href: "/learn", key: "nav.learn", icon: BookOpen },
    { href: "/glossary", key: "nav.glossary", icon: BookA },
  ] as const;
  const item =
    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-bold transition-colors";

  return (
    <nav
      data-tabbar
      aria-label={s("nav.tabs")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-canvas/85 backdrop-blur-xl backdrop-saturate-150 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 px-2">
        {tabs.map(({ href, key, icon: Icon }) => {
          const active = !menuOpen && isCurrent(href, here);
          return (
            <li key={href}>
              <LocaleLink
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(item, active ? "text-mint-bright" : "text-ink-muted")}
              >
                <Icon className="size-6" aria-hidden />
                {s(key)}
              </LocaleLink>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onMore}
            aria-expanded={menuOpen}
            className={cn(item, "w-full", menuOpen ? "text-mint-bright" : "text-ink-muted")}
          >
            <Ellipsis className="size-6" aria-hidden />
            {s("nav.more")}
          </button>
        </li>
      </ul>
    </nav>
  );
}

/**
 * True on a genuinely small screen — `md` and below, not `xl` and below.
 *
 * Two thresholds on purpose, because they answer different questions. The
 * navigation collapses below `xl` because the link row needs about 1,130px to
 * fit; the bar retracts below `md` because that is where vertical room is
 * actually scarce. Using one number for both retracted the bar on a 1,152px
 * laptop window, which contradicts the only reason to retract it: a pointer has
 * no scroll-to-reveal instinct, and a laptop is not short of height.
 *
 * The retraction is a transform set from JavaScript, so a media query in the
 * stylesheet cannot switch it off — the same reason `useReducedMotion` is needed
 * alongside the global reduced-motion rule.
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

/**
 * Whether a nav link points at the page being viewed.
 *
 * Hash links are skipped. `/#curriculum` is a place on the home page rather than
 * a page, so marking it "current" while somebody reads the glossary would be
 * wrong, and marking it on the home page would put two links in the current
 * state at once.
 *
 * A sub-path counts: reading /glossary/iorb, the Glossary link is where you are.
 */
export function isCurrent(href: string, here: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return here === "/";
  return here === href || here.startsWith(`${href}/`);
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
