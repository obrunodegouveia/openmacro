"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/site/auth-provider";
import { useLocale } from "@/components/site/locale-provider";
import { useSeason } from "@/components/site/seasonal-decor";

/** The staging, fetched only on the day a welcome is actually shown. */
const WelcomeStage = dynamic(() => import("./seasons/visuals/welcome-stage").then((m) => m.WelcomeStage), { ssr: false });

/**
 * A seasonal welcome by name: the first time a signed-in learner opens the
 * site each day while a season is on, "Happy Halloween, Maria!" (or "Ho ho
 * ho, Maria!") is staged across the window (a glow blooming, motes rising,
 * the card springing in over a burst of the season's particles), then gets
 * out of the way. The staging is the app-agnostic `WelcomeStage`. Never in the calm look, which has no popups. The app
 * shows the same thing (src/components/ui/SeasonalWelcome.tsx).
 *
 * The name is the signed-in account's own, from the session. Nobody's name is
 * written into the site; signed out, or with no name on the account, there is
 * no welcome.
 *
 * Once a day per account, remembered in this browser. A click, a key or five
 * seconds closes it.
 */

/** Where the last welcome is remembered, as `<user id>:<local date>`. */
const STORAGE_KEY = "om-season-welcomed";

/** How long the welcome stays before it closes itself. */
const SHOW_MS = 5000;

/** Today's local date, so "once a day" follows the learner's own midnight. */
function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/**
 * The first word of a display name, or null when there is no usable name.
 * The auth provider falls back to the email or "Learner"; neither is a name.
 *
 * @param name The account's display name.
 * @return The first name, or null.
 */
function firstName(name: string): string | null {
  if (!name || name.includes("@") || name === "Learner") return null;
  return name.trim().split(/\s+/)[0] ?? null;
}

/**
 * The welcome overlay. Mount once, inside the auth and locale providers.
 *
 * @return The welcome while it is showing, otherwise nothing.
 */
export function SeasonalWelcome() {
  const season = useSeason();
  const { learner } = useAuth();
  const { t } = useLocale();
  const [name, setName] = React.useState<string | null>(null);
  const id = season && !season.calm ? season.id : null;

  const userId = learner?.id ?? null;
  const displayName = learner?.name ?? "";

  React.useEffect(() => {
    const first = firstName(displayName);
    if (!id || !userId || !first) return;
    const mark = `${userId}:${today()}`;
    try {
      if (localStorage.getItem(STORAGE_KEY) === mark) return;
      localStorage.setItem(STORAGE_KEY, mark);
    } catch {
      // Without storage it may show more than once a day; that is fine.
    }
    // Deferred a frame so the state change happens outside the effect body.
    const frame = requestAnimationFrame(() => setName(first));
    return () => cancelAnimationFrame(frame);
  }, [id, userId, displayName]);

  React.useEffect(() => {
    if (!name) return;
    const close = () => setName(null);
    const timer = setTimeout(close, SHOW_MS);
    window.addEventListener("keydown", close);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", close);
    };
  }, [name]);

  if (!name || !season) return null;

  return (
    <WelcomeStage
      emoji={season.pack.welcome}
      title={t(`season.${season.id}.welcome`, { name })}
      particles={season.pack.particles}
      glow={season.pack.look.burst.ring}
      animate={season.motion}
      onDismiss={() => setName(null)}
      scrimClassName="bg-abyss/75"
      className="border-gold bg-surface"
      titleClassName="text-4xl font-black leading-tight text-gold"
    />
  );
}
