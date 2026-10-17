/**
 * The native provider: one component at the root of the app, and every
 * seasonal decoration below it reads the live season from it.
 *
 * It holds what the decorations cannot know on their own: the app's season
 * controller, its packs, how to turn a key into words, the colours of the
 * package's own chrome (the toy's thread, its speech bubble, the greeting
 * pill), haptics, whether a screen has focus, and any per-season artwork.
 * Everything has a default except the controller and the packs.
 *
 * It also keeps the season current while the app runs: decides again at
 * midnight and on returning to the foreground, and refreshes the remote
 * config. Pass `lifecycle={false}` to do that yourself.
 */

import { createContext, useContext, useEffect, useMemo, type ComponentType, type ReactNode } from 'react';
import { AppState, useColorScheme, type ColorValue } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import type { SeasonController } from '../controller.ts';
import { musicFor, type HasMusic, type SeasonTrack } from '../music.ts';
import { createTranslator, type Translate } from '../presets/strings.ts';
import type { SeasonPack } from '../presets/types.ts';
import { useSeasonDecision, useSeasonPreference } from '../react.ts';
import type { SeasonPreference } from '../types.ts';

/** The season on screen right now, with everything needed to draw it. */
export interface ActiveSeason<Id extends string = string, Key extends string = string> {
  readonly id: Id;
  readonly pack: SeasonPack<Key>;
  /** The calm look: colours and still ornaments only. */
  readonly calm: boolean;
  /**
   * Whether anything may move: the full look, and Reduce Motion off. A
   * decoration that only makes sense moving (flyers, rain, a burst) renders
   * nothing when this is false; one that can stand still does.
   */
  readonly motion: boolean;
}

/**
 * What the package's renderers tell the app about, for haptics or sound:
 * `select` (a tap on the toy), `complete` (a burst, the welcome), `grab`
 * and `release` (picking the toy up and letting go).
 */
export type FeedbackKind = 'select' | 'complete' | 'grab' | 'release';

/**
 * The colours of what the package draws around a season's own art, for one
 * appearance. By default they come from the live season's palette roles;
 * an app whose tokens are painted at launch (see the README) passes its
 * own, so the chrome matches the rest of the screen. Native dynamic colours
 * (`PlatformColor`, `DynamicColorIOS`) are welcome where the type allows.
 */
export interface SeasonChrome {
  /** The toy's thread, and a garland's wire when the pack has none. */
  readonly thread: ColorValue;
  /** What the toy says. */
  readonly bubble: { readonly background: ColorValue; readonly border: ColorValue; readonly text: ColorValue };
  /** The greeting pill. */
  readonly greeting: { readonly background: ColorValue; readonly text: ColorValue };
  /** The once-a-day welcome, as plain colour strings (any CSS colour). */
  readonly welcome: { readonly scrim: string; readonly surface: string; readonly border: string; readonly title: string };
}

/**
 * Artwork that replaces part of a season's emoji on this platform. Every
 * part is optional, and a season with none is complete; this is where an
 * app spends a little extra on a season it wants to make a fuss of.
 */
export interface NativeSeasonArt {
  /** Drawn as the toy instead of its emoji, inside its touch box. */
  readonly toy?: ComponentType<{ readonly season: ActiveSeason; readonly size: number }>;
  /** Drawn as each flyer instead of its emoji. */
  readonly flyer?: ComponentType<{ readonly season: ActiveSeason; readonly size: number; readonly index: number }>;
  /** Drawn instead of the footer's row of ornaments. */
  readonly footer?: ComponentType<{ readonly season: ActiveSeason }>;
  /** Drawn instead of the card corner's emoji. */
  readonly cardCorner?: ComponentType<{ readonly season: ActiveSeason }>;
  /** Drawn instead of the screen corner's emoji. */
  readonly screenCorner?: ComponentType<{ readonly season: ActiveSeason }>;
}

/** The provider's props. */
export interface SeasonProviderProps<Id extends string, Key extends string> {
  /** The app's controller (`createSeasonController`). */
  readonly controller: SeasonController<Id>;
  /** A pack for every id on the calendar: `PRESET_PACKS`, your own, or both. */
  readonly packs: Readonly<Record<Id, SeasonPack<Key>>>;
  /** Turns a key into words. Default: the bundled English. */
  readonly translate?: Translate;
  /**
   * The colours of the package's chrome, given the season and the
   * appearance on screen. Default: from the season's palette roles.
   */
  readonly chrome?: (season: ActiveSeason<Id, Key>, scheme: 'light' | 'dark') => SeasonChrome;
  /** Haptics or sound for the toy and the bursts. Default: none. See `expoHaptics`. */
  readonly feedback?: (kind: FeedbackKind) => void;
  /**
   * A hook telling a decoration whether its screen has focus, so the loops
   * on screens behind the current one hold still. Pass your navigator's
   * (`useIsFocused` from expo-router or React Navigation). Must be a hook:
   * it is called on every render of every decoration. Default: always.
   */
  readonly useFocused?: () => boolean;
  /** Artwork for parts of a season, by id. */
  readonly art?: Partial<Record<Id, NativeSeasonArt>>;
  /** Force an appearance. Default: the system's. */
  readonly scheme?: 'light' | 'dark';
  /** Keep the season current (midnight, foreground, remote refresh). Default true. */
  readonly lifecycle?: boolean;
  readonly children?: ReactNode;
}

/** What the provider shares with every decoration. */
interface SeasonContextValue {
  readonly controller: SeasonController<string>;
  readonly packs: Readonly<Record<string, SeasonPack>>;
  readonly translate: Translate;
  readonly chrome: (season: ActiveSeason, scheme: 'light' | 'dark') => SeasonChrome;
  readonly feedback: (kind: FeedbackKind) => void;
  readonly useFocused: () => boolean;
  readonly art: Partial<Record<string, NativeSeasonArt>>;
  readonly scheme: 'light' | 'dark' | undefined;
}

const SeasonContext = createContext<SeasonContextValue | null>(null);

const ENGLISH = createTranslator('en');
const ALWAYS = () => true;
const NOTHING = () => {};

/**
 * The chrome from a season's own palette roles.
 *
 * @param season The season.
 * @param scheme The appearance.
 * @return Its chrome.
 */
export function chromeFromPalette(season: ActiveSeason, scheme: 'light' | 'dark'): SeasonChrome {
  const c = season.pack.palette[scheme];
  return {
    thread: c.inkFaint,
    bubble: { background: c.surface, border: c.hairline, text: c.ink },
    greeting: { background: c.accentSoft, text: c.accentText },
    // The scrim is the season's shadow tone at 72%, in either appearance.
    welcome: { scrim: `${season.pack.palette.light.shadow ?? '#000000'}B8`, surface: c.surface, border: c.accent, title: c.accentText },
  };
}

/**
 * Seasons for everything inside it. Mount once, at the root of the app.
 *
 * @param props See `SeasonProviderProps`.
 * @return The provider.
 */
export function SeasonProvider<Id extends string, Key extends string>({
  controller,
  packs,
  translate = ENGLISH,
  chrome,
  feedback = NOTHING,
  useFocused = ALWAYS,
  art = {},
  scheme,
  lifecycle = true,
  children,
}: SeasonProviderProps<Id, Key>) {
  useEffect(() => {
    if (!lifecycle) return;
    const stop = controller.start();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      controller.update();
      void controller.refresh();
    });
    return () => {
      stop();
      subscription.remove();
    };
  }, [controller, lifecycle]);

  const value = useMemo<SeasonContextValue>(
    () => ({
      controller: controller as unknown as SeasonController<string>,
      packs,
      translate,
      chrome: (chrome as SeasonContextValue['chrome'] | undefined) ?? chromeFromPalette,
      feedback,
      useFocused,
      art,
      scheme,
    }),
    [controller, packs, translate, chrome, feedback, useFocused, art, scheme],
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
  const value = useContext(SeasonContext);
  if (!value) throw new Error('@openmacro/seasons/native: wrap the app in <SeasonProvider>.');
  return value;
}

/**
 * The season to decorate for, live: it follows the user's own setting, the
 * remote switch and the date the moment they change, and Reduce Motion.
 *
 * @return The season, or `null` on an ordinary day.
 */
export function useSeason<Id extends string = string, Key extends string = string>(): ActiveSeason<Id, Key> | null {
  const { controller, packs } = useSeasonContext();
  const decision = useSeasonDecision(controller);
  const reduceMotion = useReducedMotion();
  return useMemo(() => {
    const pack = decision.season ? packs[decision.season] : undefined;
    if (!decision.season || !pack) return null;
    const calm = decision.look === 'calm';
    return { id: decision.season as Id, pack: pack as SeasonPack<Key>, calm, motion: !calm && !reduceMotion };
  }, [decision, packs, reduceMotion]);
}

/**
 * The appearance the decorations draw for.
 *
 * @return `light` or `dark`.
 */
export function useSeasonScheme(): 'light' | 'dark' {
  const { scheme } = useSeasonContext();
  const system = useColorScheme();
  return scheme ?? (system === 'dark' ? 'dark' : 'light');
}

/**
 * The emoji to show for a role, in season or out of it: the streak flame
 * becomes a jack-o'-lantern or a tree, a party popper a pumpkin or a
 * present. The meaning stays; only the picture dresses up.
 *
 * @param role Which emoji.
 * @param ordinary What to show on an ordinary day.
 * @return The emoji.
 */
export function useSeasonEmoji(role: keyof SeasonPack['emoji'], ordinary: string): string {
  const season = useSeason();
  return season ? season.pack.emoji[role] : ordinary;
}

/**
 * Everything a settings switch needs: the season on offer (`null` when
 * there is nothing to choose about, so the switch can hide), the user's
 * choice and a setter, and whether the decision has moved since the app
 * launched (for an app whose palette is painted once, at launch, to offer
 * a restart).
 *
 * @return The settings.
 */
export function useSeasonSettings<Id extends string = string>(): {
  available: Id | null;
  preference: SeasonPreference;
  setPreference: (preference: SeasonPreference) => void;
  changedSinceLaunch: boolean;
} {
  const { controller } = useSeasonContext();
  const decision = useSeasonDecision(controller);
  const preference = useSeasonPreference(controller);
  return {
    available: decision.available as Id | null,
    preference,
    setPreference: controller.setPreference,
    changedSinceLaunch: decision.season !== controller.boot.season,
  };
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
  return useMemo(() => musicFor(decision, preference, packs as Record<string, HasMusic<Asset>>), [decision, preference, packs]);
}
