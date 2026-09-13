"use client";

/**
 * ============================================================================
 * The mobile navigation sheet
 * ============================================================================
 *
 * A modal sheet, built to Apple's Human Interface Guidelines rather than as a
 * dropdown that happens to appear on small screens. What that means in practice,
 * and why each part is here:
 *
 * MATERIAL, NOT A PANEL. The sheet is translucent over a dimming scrim, with
 * blur *and* saturation. Saturation is the part people leave out and the part
 * that makes it read as glass: blur alone greys out what is behind it, while
 * `backdrop-saturate` keeps the colour, so the page underneath stays legible as
 * a place you are still standing on rather than a smear.
 *
 * A GROUPED LIST. Rows are gathered into rounded, inset groups under quiet
 * uppercase headers — the Settings idiom — because a flat column of six links
 * gives a reader no structure to skim. Separators are inset to start at the
 * label, not drawn edge to edge: in a grouped list the separator's job is to
 * divide two labels, and running it under the icon column visually detaches the
 * icon from its own row.
 *
 * ROWS YOU CAN HIT. 52px, comfortably past the 44pt minimum, with the whole row
 * as the target rather than the text inside it.
 *
 * IT SAYS WHERE IT GOES. A chevron on anything that navigates within the site,
 * an arrow on anything that leaves it. An affordance that distinguishes those
 * two is the difference between a list and a lucky dip.
 *
 * IT IS ACTUALLY MODAL. `role="dialog"` with `aria-modal`, focus moved in on
 * open and returned to the trigger on close, focus trapped while it is up,
 * Escape to dismiss, the scrim tappable to dismiss, and the page behind locked
 * so it cannot scroll under your thumb. A sheet that traps neither focus nor
 * scroll is a visual imitation of a modal rather than one.
 *
 * IT RESPECTS THE HARDWARE AND THE PERSON. Bottom padding from
 * `env(safe-area-inset-bottom)` so the last row clears the home indicator, its
 * own scroll with `overscroll-contain` when the content is taller than the
 * screen, and no spring at all for a reader who has asked for reduced motion —
 * `useReducedMotion` rather than only the global CSS rule, because a transform
 * animation driven from JavaScript does not care what the stylesheet says.
 */

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronRight, LayoutDashboard } from "lucide-react";

import { LocaleLink } from "@/components/site/locale-link";
import { LanguagePicker } from "@/components/site/language-picker";
import { AccountButton } from "@/components/site/account-button";
import { GithubIcon } from "@/components/ui/icons";
import { useAuth } from "@/components/site/auth-provider";
import { GITHUB_URL } from "@/lib/site";
import { useSiteText } from "@/lib/use-site-text";
import type { SiteKey } from "@openmacro/core/i18n/site";

export interface MenuLink {
  href: string;
  key: SiteKey;
}

/** A quiet uppercase header over a rounded group. */
function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 first:mt-0">
      <h2 className="px-4 pb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-ink-faint">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-hairline bg-white/[0.04]">
        {children}
      </div>
    </section>
  );
}

/**
 * One row.
 *
 * `[&+&]` draws the separator on every row after the first, so a group never
 * ends on a stray line and nothing has to know its own position.
 */
const ROW =
  "flex min-h-[52px] items-center gap-3 px-4 text-[0.95rem] font-bold text-ink " +
  "transition-colors active:bg-white/[0.07] " +
  "[&+&]:border-t [&+&]:border-hairline/70";

export function MobileMenu({
  open,
  onClose,
  links,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  links: readonly MenuLink[];
  /** Focus returns here on close, as a modal is required to do. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const s = useSiteText();
  const { learner } = useAuth();
  const reduceMotion = useReducedMotion();
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Escape closes, and Tab is kept inside the sheet while it is open.
  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  /**
   * Scroll lock. `position: fixed` on the body is the other common approach and
   * it loses the reader's place; `overflow: hidden` keeps the scroll offset, so
   * closing the sheet leaves the page exactly where it was.
   */
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /**
   * Focus in on open, back to the hamburger on close.
   *
   * `wasOpen` is what stops it stealing focus on first paint: without it the
   * close branch runs on mount, when the menu has never been open, and a reader
   * arriving at the page finds the focus ring sitting on the hamburger. It is
   * invisible on a desktop only because the button is `display: none` there.
   */
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (open) {
      sheetRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
    } else if (wasOpen.current) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open, triggerRef]);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.9 };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            // Dismissing by tapping outside is a pointer affordance that has a
            // keyboard equivalent (Escape) and a visible one (the X), so the
            // scrim itself is decoration as far as assistive tech is concerned.
            aria-hidden
            className="fixed inset-0 top-[var(--header-total)] z-40 bg-abyss/60 backdrop-blur-[2px] md:hidden"
          />

          <motion.div
            key="sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={s("nav.menu.title")}
            initial={{ y: "-100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={spring}
            className={
              "fixed inset-x-0 top-[var(--header-total)] z-40 overflow-y-auto "
              + "max-h-[calc(100dvh-var(--header-total))] " +
              "overscroll-contain rounded-b-3xl border-b border-hairline " +
              "bg-canvas/85 backdrop-blur-2xl backdrop-saturate-150 " +
              "shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] md:hidden"
            }
          >
            <div className="px-4 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <Group title={s("nav.menu.browse")}>
                {learner ? (
                  <LocaleLink href="/dashboard" onClick={onClose} className={ROW}>
                    <LayoutDashboard className="size-5 shrink-0 text-mint-bright" aria-hidden />
                    <span className="flex-1">{s("nav.dashboard")}</span>
                    <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
                  </LocaleLink>
                ) : null}
                {links.map((link) => (
                  <LocaleLink key={link.href} href={link.href} onClick={onClose} className={ROW}>
                    <span className="flex-1">{s(link.key)}</span>
                    <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
                  </LocaleLink>
                ))}
              </Group>

              {/*
                Its own group rather than a row, because a segmented control is
                not a row: it is two targets side by side, and squeezing it into
                the list would put it at odds with everything above it.
              */}
              {/* No `onClose`: switching language is a full document load, and
                  closing the sheet first would show the old page unchanged for
                  the length of the request — the tap would look ignored. The
                  sheet going away with the document is the honest feedback. */}
              <LanguagePicker layout="block" className="mt-5" />

              <Group title={s("nav.menu.project")}>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={onClose}
                  className={ROW}
                >
                  <GithubIcon className="size-5 shrink-0 text-ink-muted" aria-hidden />
                  <span className="flex-1">{s("nav.github")}</span>
                  {/* Leaves the site, so an arrow rather than a chevron. */}
                  <ArrowUpRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
                </a>
              </Group>

              <AccountSection onClose={onClose} title={s("nav.menu.account")} />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * The account controls keep their own component rather than being rebuilt as
 * rows: it already handles the loading, signed-out and signed-in states, and a
 * second implementation of sign-in UI is a second thing to get wrong. It renders
 * nothing when the site is built without Supabase, so the header goes with it.
 */
function AccountSection({ onClose, title }: { onClose: () => void; title: string }) {
  const { enabled } = useAuth();
  if (!enabled) return null;
  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-ink-faint">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-hairline bg-white/[0.04] p-3">
        <AccountButton onNavigate={onClose} />
      </div>
    </section>
  );
}
