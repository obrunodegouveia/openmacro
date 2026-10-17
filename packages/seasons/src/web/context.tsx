"use client";

/**
 * The web provider: one client component near the root of the app, and
 * every seasonal decoration below it reads the live season from it.
 *
 * It holds what the decorations cannot know on their own: the app's
 * controller (`null` on the server), its packs, how to turn a key into
 * words, and any per-season artwork. It also keeps <html> dressed for the
 * live decision (the boot script dressed it before first paint) and checks
 * again when a tab comes back into view; pass `runtime={false}` to do that
 * yourself.
 *
 * Deliberately light: no visuals are imported here, so the provider and the
 * hooks can sit on every page while the decorations load lazily.
 */

import * as React from "react";

import type { SeasonController } from "../controller.ts";
import { createTranslator, type Translate } from "../presets/strings.ts";
import type { SeasonPack } from "../presets/types.ts";
import { musicFor, type HasMusic, type SeasonTrack } from "../music.ts";
import { useSeasonDecision, useSeasonPreference } from "../react.ts";
import { applyDecision } from "./boot.ts";

/** The season on screen right now, with everything needed to draw it. */
export interface ActiveSeason<Id extends string = string, Key extends string = string> {
  readonly id: Id;
  readonly pack: SeasonPack<Key>;
  /** The calm look: colours and still ornaments only. */
  readonly calm: boolean;
  /** Whether anything may move: the full look, and no reduced-motion request. */
  readonly motion: boolean;
}

/**
 * Artwork that replaces part of a season's emoji on the web: SVG, mostly.
 * Every part is optional, and a season with none is complete. Pass lazy
 * components (`React.lazy`, or `next/dynamic` with `ssr: false`), so the
 * artwork is fetched only while its season is on; the renderers wrap each
 * one in `Suspense`.
 */
export interface WebSeasonArt {
  /** Strung across the top corners of the decoration layer. */
  readonly corners?: React.ComponentType;
  /** Drawn as the toy instead of its emoji. */
  readonly toy?: React.ComponentType;
  /** Drawn as each flyer instead of its emoji, filling the flyer's width. */
  readonly flyer?: React.ComponentType;
  /** Width of one flyer when drawn with `flyer`, as a CSS length. Default `3rem`. */
  readonly flyerWidth?: string;
  /** Drawn inside the footer row instead of the pack's ornaments. */
  readonly footer?: React.ComponentType<{ readonly season: ActiveSeason }>;
}

/** The provider's props. */
export interface SeasonProviderProps<Id extends string, Key extends string> {
  /** The app's controller, or `null` where there is none (on the server). */
  readonly controller: SeasonController<Id> | null;
  /** A pack for every id on the calendar: `PRESET_PACKS`, your own, or both. */
  readonly packs: Readonly<Record<Id, SeasonPack<Key>>>;
  /** Turns a key into words. Default: the bundled English. */
  readonly translate?: Translate;
  /** Artwork for parts of a season, by id. */
  readonly art?: Partial<Record<Id, WebSeasonArt>>;
  /** Keep <html> dressed for the live decision and refresh on tab focus. Default true. */
  readonly runtime?: boolean;
  readonly children?: React.ReactNode;
}

/** What the provider shares with every decoration. */
interface SeasonContextValue {
  readonly controller: SeasonController<string> | null;
  readonly packs: Readonly<Record<string, SeasonPack>>;
  readonly translate: Translate;
  readonly art: Partial<Record<string, WebSeasonArt>>;
}

const SeasonContext = React.createContext<SeasonContextValue | null>(null);

const ENGLISH = createTranslator("en");

/**
 * Keeps an element dressed for a controller's live decision: repaints it
 * whenever the decision changes (the viewer's own switch, a remote kill
 * switch, midnight), starts the controller (midnight rollover, remote
 * refresh), and decides again whenever the tab comes back into view.
 *
 * The palette repaints at once, because it is CSS keyed on the element's
 * `data-season`, which this keeps current.
 *
 * @param controller The controller.
 * @param root The element to dress. Default `document.documentElement`.
 * @return Stops it.
 */
export function startSeasonRuntime(controller: SeasonController<string>, root: Element = document.documentElement): () => void {
  // The boot script decided from the same inputs, but it cannot validate a
  // cached remote config as strictly; if the two disagree, this one wins.
  applyDecision(root, controller.getSnapshot());
  const unsubscribe = controller.subscribe(() => applyDecision(root, controller.getSnapshot()));
  const stop = controller.start();
  const onVisible = () => {
    if (document.visibilityState !== "visible") return;
    controller.update();
    void controller.refresh();
  };
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    unsubscribe();
    stop();
    document.removeEventListener("visibilitychange", onVisible);
  };
}

/**
 * Seasons for everything inside it. Mount once, near the root, inside your
 * i18n provider if `translate` comes from it.
 *
 * @param props See `SeasonProviderProps`.
 * @return The provider.
 */
export function SeasonProvider<Id extends string, Key extends string>({
  controller,
  packs,
  translate = ENGLISH,
  art = {},
  runtime = true,
  children,
}: SeasonProviderProps<Id, Key>) {
  React.useEffect(() => {
    if (!runtime || !controller) return;
    return startSeasonRuntime(controller as unknown as SeasonController<string>);
  }, [controller, runtime]);

  const value = React.useMemo<SeasonContextValue>(
    () => ({ controller: controller as unknown as SeasonController<string> | null, packs, translate, art }),
    [controller, packs, translate, art],
  );
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

/**
 * The provider's value. Throws outside a provider, because a decoration
 * that silently draws nothing is a bug that ships.
 *
 * @return The context.
 */
export function useSeasonContext(): SeasonContextValue {
  const value = React.useContext(SeasonContext);
  if (!value) throw new Error("@openmacro/seasons/web: wrap the app in <SeasonProvider>.");
  return value;
}

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Whether the viewer asked for less motion, live.
 *
 * @return True under `prefers-reduced-motion: reduce`; false on the server.
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

/**
 * The season to decorate for, live.
 *
 * @return The season, or `null` on the server, during hydration, and on an
 *     ordinary day, so prerendered HTML never has decorations and hydration
 *     adds them without a mismatch.
 */
export function useSeason<Id extends string = string, Key extends string = string>(): ActiveSeason<Id, Key> | null {
  const { controller, packs } = useSeasonContext();
  const decision = useSeasonDecision(controller);
  const reduceMotion = useReducedMotion();
  return React.useMemo(() => {
    const pack = decision.season ? packs[decision.season] : undefined;
    if (!decision.season || !pack) return null;
    const calm = decision.look === "calm";
    return { id: decision.season as Id, pack: pack as SeasonPack<Key>, calm, motion: !calm && !reduceMotion };
  }, [decision, packs, reduceMotion]);
}

/**
 * The emoji to show for a role, in season or out of it: the streak flame
 * becomes a jack-o'-lantern or a tree, a party popper a pumpkin or a
 * present.
 *
 * @param role Which emoji.
 * @param ordinary What to show on an ordinary day.
 * @return The emoji.
 */
export function useSeasonEmoji(role: keyof SeasonPack["emoji"], ordinary: string): string {
  const season = useSeason();
  return season ? season.pack.emoji[role] : ordinary;
}

/**
 * The seasonal music to play now, or `null` for the app's own default
 * music: the live season's `music`, only in the full look with the
 * preference On (see `musicFor`). Re-renders when that changes, so an app's
 * player can switch playlists in an effect. The package plays nothing.
 *
 * @return The tracks, or `null`.
 */
export function useSeasonMusic<Asset = unknown>(): readonly SeasonTrack<Asset>[] | null {
  const { controller, packs } = useSeasonContext();
  const decision = useSeasonDecision(controller);
  const preference = useSeasonPreference(controller);
  return React.useMemo(() => musicFor(decision, preference, packs as Record<string, HasMusic<Asset>>), [decision, preference, packs]);
}
