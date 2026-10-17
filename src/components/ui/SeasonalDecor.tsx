/**
 * Seasonal decorations: what the app hangs up when a season is on.
 *
 * Nothing here names a season. Each component reads the live season from
 * `useSeason` and draws its pack (`SEASON_PACKS` in `@openmacro/core/season`),
 * so a new season is new data, not new components. On an ordinary day every
 * export renders nothing.
 *
 * These are thin wrappers. The drawing is done by the app-agnostic
 * primitives in `src/seasons/visuals`, which take plain props; this file is
 * where OpenMacro's palette, strings, feedback and season pack are read and
 * handed to them.
 *
 * Everything is drawn with emoji, plain views and React Native's own
 * gradients and shadows, not SVG: the app has no SVG renderer, and adding a
 * native module would hold a season back until the next store build instead
 * of shipping it as an update.
 *
 * All of it is decoration. It is hidden from VoiceOver and TalkBack, never
 * takes a tap meant for the screen under it (only the toy is touchable), and
 * stands still under Reduce Motion or the calm look, where whatever only
 * makes sense moving is not drawn at all. Every loop holds still while its
 * screen is out of focus or the app is in the background.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View, useColorScheme, useWindowDimensions, type AppStateStatus } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';

import { toyReaction, type DepthLayer, type SeasonLook, type SeasonPack } from '@openmacro/core/season';

import { emitFeedback, touchHaptic } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { useSeason, type ActiveSeason } from '@/seasons';
import {
  Burst,
  CandleGlow,
  DraggableToy,
  EmojiRain,
  FairyLights,
  Flyer,
  FrostRim,
  HIDDEN,
  Mist,
  ParticleField,
  Scatter,
  SkyGlow,
  SnowCap,
  Sun,
  hash,
  type Glow,
} from '@/seasons/visuals';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';

/** How far below the top of the screen the toy hangs at rest, past the safe area. */
const THREAD = 30;

/** The toy's touch box, in points. */
const TOY_SIZE = 32;

/** How far a tap drops the toy, and how far it can be pulled. */
const TOY_DROP = 220;
const TOY_DRAG = 320;

/** How long the toy's line stays up. */
const LINE_MS = 1800;

/** Fades for decorations appearing or leaving when the season setting changes. */
const APPEAR = FadeIn.duration(600);
const LEAVE = FadeOut.duration(400);

/** How tall the mist lies along the bottom of Today. */
const MIST_HEIGHT = 240;

/** How many drops fall on a finished lesson. */
const RAIN_DROPS = 15;

/** The phone width the look's garland count is written for. */
const GARLAND_WIDTH = 390;

/**
 * The band, under the clock, that flyers cross: high, because lower down
 * they crossed the hero card's buttons and the Course tab's search field.
 */
const FLIGHT_BAND = { top: 8, depth: 40 } as const;

/**
 * Whether decorations here should be moving: the screen they sit on has
 * focus and the app is in the foreground. Loops hold their frame otherwise,
 * so three mounted tabs never animate at once, nor anything behind a lesson.
 *
 * @return True while it is worth animating.
 */
function useAwake(): boolean {
  const focused = useIsFocused();
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', setState);
    return () => subscription.remove();
  }, []);
  return focused && state === 'active';
}

/**
 * The appearance on screen, as the look data indexes it.
 *
 * @return `light` or `dark`.
 */
function useScheme(): 'light' | 'dark' {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

/**
 * The season's sky glows for the appearance on screen.
 *
 * @param look The season's look.
 * @param scheme The appearance.
 * @return The glows, ready for `SkyGlow`.
 */
function glowsFor(look: SeasonLook, scheme: 'light' | 'dark'): Glow[] {
  return look.sky.glows.map((glow) => ({ ...glow, color: glow.color[scheme], alpha: glow.alpha[scheme] }));
}

/**
 * The particle field for one placement, behind the content or in front of
 * it, as the season's look describes it.
 *
 * @param props.look The season's look.
 * @param props.layers The depths to draw.
 * @param props.scheme The appearance.
 * @param props.paused Hold it.
 * @return The field.
 */
function Motes({ look, layers, scheme, paused }: { look: SeasonLook; layers: readonly DepthLayer[]; scheme: 'light' | 'dark'; paused: boolean }) {
  const { width, height } = useWindowDimensions();
  const colors = useMemo(() => look.motes.colors.map((color) => color[scheme]), [look, scheme]);
  if (!layers.length) return null;
  return (
    <ParticleField
      layers={layers}
      colors={colors}
      glow={look.motes.glow}
      direction={look.motes.direction}
      motion={look.motes.motion}
      wind={look.motes.wind}
      width={width}
      height={height}
      paused={paused}
    />
  );
}

/**
 * The atmosphere behind a tab screen: the season's tinted sky breathing at
 * the top (and its sun, if it has one), the far particles in the air behind
 * the content, and on Today the mist along the bottom. Place it as the first
 * child of the screen's root view, before the scroll view, so the content
 * draws over all of it.
 *
 * The calm look and Reduce Motion keep the sky and the sun, still, and leave
 * the particles out.
 *
 * @param props.mist Lay the season's mist, if it has one, along the bottom.
 * @return The atmosphere, or nothing on an ordinary day.
 */
export function SeasonalAtmosphere({ mist = false }: { mist?: boolean }) {
  const season = useSeason();
  const scheme = useScheme();
  const awake = useAwake();
  const { width, height } = useWindowDimensions();
  const look = season?.pack.look;
  const glows = useMemo(() => (look ? glowsFor(look, scheme) : []), [look, scheme]);
  const back = useMemo(() => look?.motes.layers.filter((layer) => !layer.front) ?? [], [look]);
  if (!season || !look) return null;
  const paused = !awake;
  const band = height * look.sky.height;

  return (
    <Animated.View key={season.id} entering={APPEAR} exiting={LEAVE} pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      <SkyGlow glows={glows} height={band} breatheMs={look.sky.breatheMs} animate={season.motion} paused={paused} />
      {look.sun ? (
        <Sun
          color={look.sun.color[scheme]}
          alpha={look.sun.alpha[scheme]}
          x={look.sun.x}
          y={look.sun.y}
          radius={look.sun.radius}
          rays={look.sun.rays}
          turnMs={look.sun.turnMs}
          width={width}
          height={band}
          animate={season.motion}
          paused={paused}
        />
      ) : null}
      {mist && look.mist ? (
        <Mist
          mode={look.mist.mode}
          color={look.mist.color[scheme]}
          alpha={look.mist.alpha[scheme]}
          height={MIST_HEIGHT}
          bottom={0}
          width={width}
          cycleMs={look.mist.cycleMs}
          animate={season.motion}
          paused={paused}
        />
      ) : null}
      {season.motion ? <Motes look={look} layers={back} scheme={scheme} paused={paused} /> : null}
    </Animated.View>
  );
}

/**
 * The toy on a thread, hanging from the top of the screen: a spider, a
 * bell, a bee, a beach ball.
 *
 * It bobs gently on its own, and a finger can pick it up and throw it: it
 * swings back on its thread like a pendulum. A tap plays the pack's move;
 * every third tap it says something, and every tenth it throws a burst.
 * That is the whole game, and it is there because a seven-year-old will
 * find it.
 *
 * @param props.season The season on screen.
 * @param props.top Where the thread is anchored, usually the safe-area inset.
 * @return The toy.
 */
function HangingToy({ season, top }: { season: ActiveSeason; top: number }) {
  const { t } = useLocale();
  const { toy, strings } = season.pack;
  const taps = useRef(0);
  const [line, setLine] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (line === null) return;
    const timer = setTimeout(() => setLine(null), LINE_MS);
    return () => clearTimeout(timer);
  }, [line]);

  const onTap = () => {
    taps.current += 1;
    const reaction = toyReaction(taps.current);
    emitFeedback(reaction === 'burst' ? 'complete' : 'select');
    if (reaction === 'burst') setBurst((n) => n + 1);
    else if (reaction !== null) setLine(reaction);
  };

  const said = line !== null ? strings.toy[(line - 1) % strings.toy.length] : undefined;

  return (
    <View pointerEvents="box-none" style={styles.toyAnchor}>
      <DraggableToy
        restY={top + THREAD}
        size={TOY_SIZE}
        dropBy={TOY_DROP}
        maxDrag={TOY_DRAG}
        move={toy.move}
        thread={palette.inkFaint}
        animate={season.motion}
        onTap={onTap}
        onGrab={() => touchHaptic('grab')}
        onRelease={() => touchHaptic('release')}
        attached={
          <>
            {said ? (
              <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(250)} style={styles.bubble} {...HIDDEN}>
                <Text style={styles.bubbleText} numberOfLines={2}>
                  {t(said)}
                </Text>
              </Animated.View>
            ) : null}
            {burst > 0 ? (
              <View style={styles.toyBurst} pointerEvents="none">
                <SeasonalBurst key={burst} />
              </View>
            ) : null}
          </>
        }
      >
        <Text style={styles.toy} allowFontScaling={false}>{toy.emoji}</Text>
      </DraggableToy>
    </View>
  );
}

/**
 * The toy hanging over the Today screen. Place it last inside the screen's
 * root view.
 *
 * In the calm look it hangs still, and a creepy one (a spider, a bee) is
 * not there at all.
 *
 * @param props.top The safe-area top inset, so nothing hides under the clock.
 * @return The overlay, or nothing on an ordinary day.
 */
export function SeasonalOverlay({ top }: { top: number }) {
  const season = useSeason();
  if (!season || (season.calm && season.pack.toy.creepy)) return null;

  return (
    <Animated.View key={season.id} entering={APPEAR} exiting={LEAVE} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <HangingToy season={season} top={top} />
    </Animated.View>
  );
}

/**
 * The sky over whichever tab is open: the season's flyers crossing now and
 * then, and the nearest, faintest particles drifting in front of the
 * content (the far ones are behind it, in `SeasonalAtmosphere`). Mounted
 * once, over the tab navigator, so it carries on when the learner switches
 * tabs. Never over a lesson: snow falling across a question is a
 * distraction, not a decoration.
 *
 * Each flyer's lane, size and schedule come from its index, around the
 * pack's own; a flight with `spacingMs` (a gust of leaves) sets off
 * together, each a beat behind the one before.
 *
 * @return The sky, or nothing on an ordinary day, in the calm look, or
 *     under Reduce Motion.
 */
export function SeasonalSky() {
  const season = useSeason();
  const scheme = useScheme();
  const awake = useAwake();
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const look = season?.pack.look;
  const front = useMemo(() => look?.motes.layers.filter((layer) => layer.front) ?? [], [look]);
  if (!season?.motion || !look) return null;
  const { flyer } = season.pack;
  const paused = !awake;

  return (
    <Animated.View key={season.id} entering={APPEAR} exiting={LEAVE} pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      <Motes look={look} layers={front} scheme={scheme} paused={paused} />
      {flyer
        ? Array.from({ length: flyer.count }, (_, i) => {
            const together = flyer.spacingMs !== undefined;
            const emoji = typeof flyer.emoji === 'string' ? flyer.emoji : flyer.emoji[i % flyer.emoji.length]!;
            return (
              <Flyer
                key={i}
                emoji={emoji}
                mirror={flyer.mirror ?? false}
                flapMs={flyer.flapMs}
                flapAxis={flyer.flapAxis}
                y={top + FLIGHT_BAND.top + hash(i, 1) * FLIGHT_BAND.depth}
                // The first at the pack's size; the rest a little further off.
                size={flyer.size * (i === 0 ? 1 : 0.7 + hash(i, 2) * 0.25)}
                width={width}
                lapMs={flyer.lapMs * (together ? 1 : 1 + hash(i, 3) * 0.35)}
                restMs={flyer.restMs}
                wobble={flyer.wobble}
                waves={flyer.waves}
                spin={flyer.spin}
                delay={together ? 2000 + i * flyer.spacingMs! : 1200 + i * 3200 + hash(i, 4) * 2400}
                seed={i}
                paused={paused}
              />
            );
          })
        : null}
    </Animated.View>
  );
}

/**
 * The season's garland strung along the top of a screen: fairy lights at
 * Christmas, a blossom branch in spring. Place it as the first child of the
 * scroll content; it takes its own height, runs to the screen edges and
 * scrolls away with the header.
 *
 * @return The garland, or nothing on an ordinary day or for a season without.
 */
export function SeasonalGarland() {
  const season = useSeason();
  const scheme = useScheme();
  const awake = useAwake();
  const { width } = useWindowDimensions();
  const garland = season?.pack.look.garland;
  if (!season || !garland) return null;
  return (
    <Animated.View entering={APPEAR} exiting={LEAVE} pointerEvents="none" style={styles.garland} {...HIDDEN}>
      <FairyLights
        colors={garland.colors}
        beads={garland.beads}
        // Fewer on a narrow screen, the same spacing on a wide one.
        count={Math.max(5, Math.round((garland.count * width) / GARLAND_WIDTH))}
        sag={garland.sag}
        twinkleMs={garland.beatMs}
        width={width}
        wire={garland.wire?.[scheme] ?? palette.inkFaint}
        animate={season.motion}
        paused={!awake}
      />
    </Animated.View>
  );
}

/**
 * The season's ornament caught on the top corner of a card (a cobweb, a
 * bow), and whatever has settled along the card's top edge: snow, frost,
 * fallen leaves. Place it inside the card, which must not clip (`overflow`
 * visible).
 *
 * @param props.edge Draw the season's edge too: on the hero card only.
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonalCardCorner({ edge = true }: { edge?: boolean }) {
  const season = useSeason();
  const scheme = useScheme();
  const awake = useAwake();
  if (!season) return null;
  const settled = edge ? season.pack.look.edge : null;
  const shade = season.pack.look.motes.colors[0]?.light ?? season.pack.palette.light.inkFaint;
  return (
    <>
      {settled?.kind === 'snow' ? <SnowCap color={settled.color[scheme]} shade={shade} inset={radius.xl} /> : null}
      {settled?.kind === 'frost' ? <FrostRim color={settled.color[scheme]} inset={radius.xl} animate={season.motion} paused={!awake} /> : null}
      {settled?.kind === 'scatter' ? <Scatter emoji={settled.emoji} /> : null}
      <Text pointerEvents="none" style={styles.cardCorner} allowFontScaling={false} {...HIDDEN}>
        {season.pack.cardCorner}
      </Text>
    </>
  );
}

/**
 * The season's large, faint ornament in the top corner of a screen. Place it
 * as the first child of the screen's scroll content, so it scrolls away with
 * the title.
 *
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonalScreenCorner() {
  const season = useSeason();
  if (!season) return null;
  return (
    <Text pointerEvents="none" style={styles.screenCorner} allowFontScaling={false} {...HIDDEN}>
      {season.pack.screenCorner}
    </Text>
  );
}

/** The emoji size for each footer ornament size. */
const FOOTER_SIZE = { s: 26, m: 30, l: 36 } as const;

/**
 * The row of ornaments that ends a scrolling screen: pumpkins and a ghost,
 * trees and a snowman, tulips and a chick. Lit ones glow from inside with
 * the season's candle.
 *
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonalFooter() {
  const season = useSeason();
  const awake = useAwake();
  if (!season) return null;
  const { candle } = season.pack.look;
  return (
    <View style={styles.footer} {...HIDDEN}>
      {season.pack.footer.map((ornament, i) => {
        const glyph = (
          <Text style={[{ fontSize: FOOTER_SIZE[ornament.size] }, ornament.lift && styles.lift]} allowFontScaling={false}>
            {ornament.emoji}
          </Text>
        );
        return candle && ornament.lit ? (
          <CandleGlow
            key={i}
            color={candle.color}
            size={FOOTER_SIZE[ornament.size]}
            flickerMs={candle.flickerMs}
            offset={(i * 0.37) % 1}
            animate={season.motion}
            paused={!awake}
          >
            {glyph}
          </CandleGlow>
        ) : (
          <View key={i}>{glyph}</View>
        );
      })}
    </View>
  );
}

/**
 * The emoji to show for a role, in season or out of it: the streak flame
 * becomes a jack-o'-lantern or a tree, the lesson-complete party popper a
 * pumpkin or a present. The meaning stays; only the picture dresses up.
 *
 * @param role Which emoji.
 * @param ordinary What to show on an ordinary day.
 * @return The emoji.
 */
export function useSeasonalEmoji(role: keyof SeasonPack['emoji'], ordinary: string): string {
  const season = useSeason();
  return season ? season.pack.emoji[role] : ordinary;
}

/**
 * A small greeting pill, "🎃 Happy Halloween!", for the top of a screen.
 *
 * Unlike the decorations it is text, so VoiceOver reads it.
 *
 * @return The pill, or nothing on an ordinary day.
 */
export function SeasonalGreeting() {
  const { t } = useLocale();
  const season = useSeason();
  if (!season) return null;
  return (
    <Animated.View entering={APPEAR} exiting={LEAVE} style={styles.greeting}>
      <Text maxFontSizeMultiplier={fontScale.chrome} style={styles.greetingText}>{t(season.pack.strings.greeting)}</Text>
    </Animated.View>
  );
}

/**
 * A burst of the season's particles over a soft ring of light, thrown up
 * once when it mounts. Used on a correct answer. Place it inside a container
 * that does not clip.
 *
 * @return The burst, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalBurst() {
  const season = useSeason();
  if (!season?.motion) return null;
  const { burst } = season.pack.look;
  return <Burst particles={season.pack.particles} ring={burst.ring} gravity={burst.gravity} spin={burst.spin} />;
}

/**
 * The season's particles falling down the whole screen in depth, for a
 * finished lesson. Place it last inside the screen's root view.
 *
 * @return The rain, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalRain() {
  const season = useSeason();
  const awake = useAwake();
  const { width, height } = useWindowDimensions();
  if (!season?.motion) return null;
  return <EmojiRain emoji={season.pack.particles} count={RAIN_DROPS} width={width} height={height} paused={!awake} />;
}

const styles = StyleSheet.create({
  greeting: {
    alignSelf: 'flex-start',
    backgroundColor: palette.goldSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  greetingText: { ...typography.caption, fontWeight: '800', color: palette.goldDark },
  screenCorner: {
    position: 'absolute',
    top: -spacing.lg,
    right: -spacing.md,
    fontSize: 64,
    opacity: 0.55,
    transform: [{ rotate: '8deg' }],
  },
  toyAnchor: {
    position: 'absolute',
    // Between the lockup and the streak on a phone; it swings, so a little
    // overlap on a narrow screen reads as the toy passing in front.
    left: '66%',
    top: 0,
    bottom: 0,
    width: TOY_SIZE,
  },
  toy: { fontSize: 26 },
  toyBurst: { position: 'absolute', top: spacing.lg, left: TOY_SIZE / 2 },
  bubble: {
    position: 'absolute',
    top: spacing.xs,
    right: TOY_SIZE + 2,
    width: 150,
    alignItems: 'flex-end',
  },
  bubbleText: {
    overflow: 'hidden',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    color: palette.ink,
  },
  // Eats the content's top padding, runs edge to edge, and gives a little of
  // its height back so the header sits only slightly lower than usual.
  garland: { marginTop: -spacing.lg, marginBottom: -spacing.md, marginHorizontal: -spacing.lg },
  cardCorner: {
    position: 'absolute',
    top: -18,
    right: -14,
    fontSize: 46,
    opacity: 0.85,
    transform: [{ rotate: '12deg' }],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  lift: { marginBottom: 14 },
});
