/**
 * The native composition: drop-in components that draw whichever season is
 * on, from its pack, inside a `SeasonProvider`.
 *
 * Nothing here names a season. Each component reads the live season and
 * draws its pack, so a new season is new data, not new components. On an
 * ordinary day every export renders nothing.
 *
 * Everything is drawn with emoji, plain views and React Native's own
 * gradients and shadows, not SVG: no native module, so a season ships as an
 * over-the-air update rather than waiting for a store build.
 *
 * All of it is decoration. It is hidden from VoiceOver and TalkBack (the
 * greeting, which is text, is read aloud), never takes a tap meant for the
 * screen under it (only the toy is touchable), and stands still under Reduce
 * Motion or the calm look, where whatever only makes sense moving is not
 * drawn at all. Every loop holds still while its screen is out of focus or
 * the app is in the background.
 *
 * Where each goes, on a typical home screen:
 *
 * ```tsx
 * <View style={{ flex: 1 }}>
 *   <SeasonAtmosphere mist />           // first: behind everything
 *   <ScrollView>
 *     <SeasonGarland />                 // first in the scroll content
 *     <SeasonGreeting />
 *     <Card style={{ overflow: 'visible' }}><SeasonCardCorner />…</Card>
 *     <SeasonFooter />                  // last in the scroll content
 *   </ScrollView>
 *   <SeasonToy top={insets.top} />      // last: over everything
 * </View>
 * // once, over the navigator: <SeasonSky top={insets.top} />
 * ```
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState, StyleSheet, Text, View, useWindowDimensions, type AppStateStatus, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { toyReaction } from '../presets/packs.ts';
import type { DepthLayer, SeasonScene } from '../presets/types.ts';
import { useSeason, useSeasonContext, useSeasonScheme, type ActiveSeason } from './context.tsx';
import { BeachBall } from './visuals/BeachBall.tsx';
import { Burst } from './visuals/Burst.tsx';
import { CandleGlow } from './visuals/CandleGlow.tsx';
import { DraggableToy } from './visuals/DraggableToy.tsx';
import { EmojiRain } from './visuals/EmojiRain.tsx';
import { FairyLights } from './visuals/FairyLights.tsx';
import { Flyer } from './visuals/Flyer.tsx';
import { FrostRim } from './visuals/FrostRim.tsx';
import { Mist } from './visuals/Mist.tsx';
import { ParticleField } from './visuals/ParticleField.tsx';
import { Scatter } from './visuals/Scatter.tsx';
import { HIDDEN, hash } from './visuals/shared.ts';
import { SkyGlow, type Glow } from './visuals/SkyGlow.tsx';
import { SnowCap } from './visuals/SnowCap.tsx';
import { Sun } from './visuals/Sun.tsx';

/** How far below the top of the screen the toy hangs at rest, past the safe area. */
const THREAD = 30;

/** The toy's touch box, in points. */
const TOY_SIZE = 32;

/** A drawn ball's diameter: about the size the emoji's glyph is drawn. */
const TOY_BALL = 24;

/** How far a tap drops the toy, and how far it can be pulled. */
const TOY_DROP = 220;
const TOY_DRAG = 320;

/** How long the toy's line stays up. */
const LINE_MS = 1800;

/** Fades for decorations appearing or leaving when the season setting changes. */
const APPEAR = FadeIn.duration(600);
const LEAVE = FadeOut.duration(400);

/** How tall the mist lies along the bottom of a screen. */
const MIST_HEIGHT = 240;

/** How many drops fall on a finished task. */
const RAIN_DROPS = 15;

/** The phone width the look's garland count is written for. */
const GARLAND_WIDTH = 390;

/**
 * The band, under the status bar, that flyers cross by default: high, so
 * they stay clear of a screen's buttons and fields.
 */
const FLIGHT_BAND = { top: 8, depth: 40 } as const;

/**
 * Whether decorations here should be moving: the screen they sit on has
 * focus (the provider's `useFocused`) and the app is in the foreground.
 * Loops hold their frame otherwise, so three mounted tabs never animate at
 * once, nor anything behind a modal.
 *
 * @return True while it is worth animating.
 */
export function useAwake(): boolean {
  const { useFocused } = useSeasonContext();
  const focused = useFocused();
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', setState);
    return () => subscription.remove();
  }, []);
  return focused && state === 'active';
}

/**
 * The season's sky glows for the appearance on screen.
 *
 * @param look The season's look.
 * @param scheme The appearance.
 * @return The glows, ready for `SkyGlow`.
 */
function glowsFor(look: SeasonScene, scheme: 'light' | 'dark'): Glow[] {
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
function Motes({ look, layers, scheme, paused }: { look: SeasonScene; layers: readonly DepthLayer[]; scheme: 'light' | 'dark'; paused: boolean }) {
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
 * The atmosphere behind a screen: the season's tinted sky breathing at the
 * top (and its sun, if it has one), the far particles in the air behind the
 * content, and optionally the season's mist along the bottom. Place it as
 * the first child of the screen's root view, before the scroll view, so the
 * content draws over all of it.
 *
 * The calm look and Reduce Motion keep the sky and the sun, still, and leave
 * the particles out.
 *
 * @param props.mist Lay the season's mist, if it has one, along the bottom.
 * @param props.mistHeight How tall the mist is, in points. Default 240.
 * @return The atmosphere, or nothing on an ordinary day.
 */
export function SeasonAtmosphere({ mist = false, mistHeight = MIST_HEIGHT }: { mist?: boolean; mistHeight?: number }) {
  const season = useSeason();
  const scheme = useSeasonScheme();
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
          height={mistHeight}
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
 * The toy on its thread, with its words and its bursts.
 *
 * @param props.season The season on screen.
 * @param props.top Where the thread is anchored.
 * @return The toy.
 */
function HangingToy({ season, top }: { season: ActiveSeason; top: number }) {
  const { translate, feedback, art, chrome } = useSeasonContext();
  const scheme = useSeasonScheme();
  const colors = chrome(season, scheme);
  const { toy, strings } = season.pack;
  const taps = useRef(0);
  const [line, setLine] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const Art = art[season.id]?.toy;

  useEffect(() => {
    if (line === null) return;
    const timer = setTimeout(() => setLine(null), LINE_MS);
    return () => clearTimeout(timer);
  }, [line]);

  const onTap = () => {
    taps.current += 1;
    const reaction = toyReaction(taps.current, strings.toy.length);
    feedback(reaction === 'burst' ? 'complete' : 'select');
    if (reaction === 'burst') setBurst((n) => n + 1);
    else if (reaction !== null) setLine(reaction);
  };

  const said = line !== null ? strings.toy[(line - 1) % strings.toy.length] : undefined;

  return (
    <DraggableToy
      restY={top + THREAD}
      size={TOY_SIZE}
      dropBy={TOY_DROP}
      maxDrag={TOY_DRAG}
      move={toy.move}
      thread={colors.thread}
      animate={season.motion}
      onTap={onTap}
      onGrab={() => feedback('grab')}
      onRelease={() => feedback('release')}
      attached={
        <>
          {said ? (
            <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(250)} style={styles.bubble} {...HIDDEN}>
              <Text
                style={[styles.bubbleText, { backgroundColor: colors.bubble.background, borderColor: colors.bubble.border, color: colors.bubble.text }]}
                numberOfLines={2}
              >
                {translate(said)}
              </Text>
            </Animated.View>
          ) : null}
          {burst > 0 ? (
            <View style={styles.toyBurst} pointerEvents="none">
              <SeasonBurst key={burst} />
            </View>
          ) : null}
        </>
      }
    >
      {Art ? (
        <Art season={season} size={TOY_SIZE} />
      ) : toy.shape === 'beach-ball' ? (
        <BeachBall size={TOY_BALL} />
      ) : (
        <Text style={styles.toy} allowFontScaling={false}>{toy.emoji}</Text>
      )}
    </DraggableToy>
  );
}

/**
 * The toy on a thread, hanging from the top of the screen: a spider, a
 * bell, a bee, a beach ball. Place it last inside the screen's root view.
 *
 * It bobs gently on its own, and a finger can pick it up and throw it: it
 * swings back on its thread like a pendulum. A tap plays the pack's move;
 * every third tap it says something, and every tenth it throws a burst.
 * That is the whole game, and it is there because a seven-year-old will
 * find it.
 *
 * In the calm look it hangs still, and a creepy one (a spider, a bee) is
 * not there at all.
 *
 * @param props.top Where the thread is anchored: usually the safe-area top
 *     inset, so nothing hides under the clock.
 * @param props.left Where it hangs across the screen, as a CSS percentage
 *     or in points. Pick a gap in your header: it should never sit over
 *     text or a control.
 * @return The toy, or nothing on an ordinary day.
 */
export function SeasonToy({ top, left = '66%' }: { top: number; left?: `${number}%` | number }) {
  const season = useSeason();
  if (!season || (season.calm && season.pack.toy.creepy)) return null;

  return (
    <Animated.View key={season.id} entering={APPEAR} exiting={LEAVE} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View pointerEvents="box-none" style={[styles.toyAnchor, { left }]}>
        <HangingToy season={season} top={top} />
      </View>
    </Animated.View>
  );
}

/**
 * The sky over whichever screen is open: the season's flyers crossing now
 * and then, and the nearest, faintest particles drifting in front of the
 * content (the far ones are behind it, in `SeasonAtmosphere`). Mount once,
 * over the navigator, so it carries on when the user switches tabs. Keep it
 * off screens that need concentration: snow falling across a question is a
 * distraction, not a decoration.
 *
 * Each flyer's lane, size and schedule come from its index, around the
 * pack's own; a flight with `spacingMs` (a gust of leaves) sets off
 * together, each a beat behind the one before.
 *
 * @param props.top The safe-area top inset.
 * @param props.band The band the flyers cross, below `top`: its top and
 *     its depth, in points. Default `{ top: 8, depth: 40 }`.
 * @return The sky, or nothing on an ordinary day, in the calm look, or
 *     under Reduce Motion.
 */
export function SeasonSky({ top, band = FLIGHT_BAND }: { top: number; band?: { readonly top: number; readonly depth: number } }) {
  const season = useSeason();
  const scheme = useSeasonScheme();
  const awake = useAwake();
  const { art } = useSeasonContext();
  const { width } = useWindowDimensions();
  const look = season?.pack.look;
  const front = useMemo(() => look?.motes.layers.filter((layer) => layer.front) ?? [], [look]);
  if (!season?.motion || !look) return null;
  const { flyer } = season.pack;
  const paused = !awake;
  const Art = art[season.id]?.flyer;

  return (
    <Animated.View key={season.id} entering={APPEAR} exiting={LEAVE} pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      <Motes look={look} layers={front} scheme={scheme} paused={paused} />
      {flyer
        ? Array.from({ length: flyer.count }, (_, i) => {
            const together = flyer.spacingMs !== undefined;
            const emoji = typeof flyer.emoji === 'string' ? flyer.emoji : flyer.emoji[i % flyer.emoji.length]!;
            // The first at the pack's size; the rest a little further off.
            const size = flyer.size * (i === 0 ? 1 : 0.7 + hash(i, 2) * 0.25);
            return (
              <Flyer
                key={i}
                emoji={emoji}
                mirror={flyer.mirror ?? false}
                flapMs={flyer.flapMs}
                flapAxis={flyer.flapAxis}
                y={top + band.top + hash(i, 1) * band.depth}
                size={size}
                width={width}
                lapMs={flyer.lapMs * (together ? 1 : 1 + hash(i, 3) * 0.35)}
                restMs={flyer.restMs}
                wobble={flyer.wobble}
                waves={flyer.waves}
                spin={flyer.spin}
                delay={together ? 2000 + i * flyer.spacingMs! : 1200 + i * 3200 + hash(i, 4) * 2400}
                seed={i}
                paused={paused}
              >
                {Art ? <Art season={season} size={size} index={i} /> : undefined}
              </Flyer>
            );
          })
        : null}
    </Animated.View>
  );
}

/**
 * The season's garland strung along the top of a screen: fairy lights at
 * Christmas, a blossom branch in spring. Place it as the first child of the
 * scroll content; it takes its own height and scrolls away with the header.
 * Give it negative margins (`style`) to run it edge to edge past your
 * content's padding.
 *
 * @param props.style The garland's container.
 * @return The garland, or nothing on an ordinary day or for a season without.
 */
export function SeasonGarland({ style }: { style?: StyleProp<ViewStyle> }) {
  const season = useSeason();
  const scheme = useSeasonScheme();
  const awake = useAwake();
  const { chrome } = useSeasonContext();
  const { width } = useWindowDimensions();
  const garland = season?.pack.look.garland;
  if (!season || !garland) return null;
  return (
    <Animated.View entering={APPEAR} exiting={LEAVE} pointerEvents="none" style={style} {...HIDDEN}>
      <FairyLights
        colors={garland.colors}
        beads={garland.beads}
        // Fewer on a narrow screen, the same spacing on a wide one.
        count={Math.max(5, Math.round((garland.count * width) / GARLAND_WIDTH))}
        sag={garland.sag}
        twinkleMs={garland.beatMs}
        width={width}
        wire={garland.wire?.[scheme] ?? chrome(season, scheme).thread}
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
 * @param props.edge Draw the season's edge too: on one card per screen at most.
 * @param props.inset The card's corner radius, so the edge follows it. Default 24.
 * @param props.style Moves the corner ornament.
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonCardCorner({ edge = true, inset = 24, style }: { edge?: boolean; inset?: number; style?: StyleProp<TextStyle> }) {
  const season = useSeason();
  const scheme = useSeasonScheme();
  const awake = useAwake();
  const { art } = useSeasonContext();
  if (!season) return null;
  const settled = edge ? season.pack.look.edge : null;
  const shade = season.pack.look.motes.colors[0]?.light ?? season.pack.palette.light.inkFaint;
  const Art = art[season.id]?.cardCorner;
  return (
    <>
      {settled?.kind === 'snow' ? <SnowCap color={settled.color[scheme]} shade={shade} inset={inset} /> : null}
      {settled?.kind === 'frost' ? <FrostRim color={settled.color[scheme]} inset={inset} animate={season.motion} paused={!awake} /> : null}
      {settled?.kind === 'scatter' ? <Scatter emoji={settled.emoji} /> : null}
      {Art ? (
        <Art season={season} />
      ) : (
        <Text pointerEvents="none" style={[styles.cardCorner, style]} allowFontScaling={false} {...HIDDEN}>
          {season.pack.cardCorner}
        </Text>
      )}
    </>
  );
}

/**
 * The season's large, faint ornament in the top corner of a screen. Place it
 * as the first child of the screen's scroll content, so it scrolls away with
 * the title.
 *
 * @param props.style Moves it.
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonScreenCorner({ style }: { style?: StyleProp<TextStyle> }) {
  const season = useSeason();
  const { art } = useSeasonContext();
  if (!season) return null;
  const Art = art[season.id]?.screenCorner;
  if (Art) return <Art season={season} />;
  return (
    <Text pointerEvents="none" style={[styles.screenCorner, style]} allowFontScaling={false} {...HIDDEN}>
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
 * @param props.style The row's container.
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonFooter({ style }: { style?: StyleProp<ViewStyle> }) {
  const season = useSeason();
  const awake = useAwake();
  const { art } = useSeasonContext();
  if (!season) return null;
  const Art = art[season.id]?.footer;
  if (Art) return <Art season={season} />;
  const { candle } = season.pack.look;
  return (
    <View style={[styles.footer, style]} {...HIDDEN}>
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
 * A small greeting pill, "🎃 Happy Halloween!", for the top of a screen.
 *
 * Unlike the decorations it is text, so VoiceOver reads it.
 *
 * @param props.style The pill.
 * @param props.textStyle Its text (typography; the colours come from the chrome).
 * @param props.maxFontSizeMultiplier The Dynamic Type cap. Default 1.3.
 * @return The pill, or nothing on an ordinary day.
 */
export function SeasonGreeting({
  style,
  textStyle,
  maxFontSizeMultiplier = 1.3,
}: {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  maxFontSizeMultiplier?: number;
}) {
  const season = useSeason();
  const scheme = useSeasonScheme();
  const { translate, chrome } = useSeasonContext();
  if (!season) return null;
  const colors = chrome(season, scheme).greeting;
  return (
    <Animated.View entering={APPEAR} exiting={LEAVE} style={[styles.greeting, { backgroundColor: colors.background }, style]}>
      <Text maxFontSizeMultiplier={maxFontSizeMultiplier} style={[styles.greetingText, { color: colors.text }, textStyle]}>
        {translate(season.pack.strings.greeting)}
      </Text>
    </Animated.View>
  );
}

/**
 * A burst of the season's particles over a soft ring of light, thrown up
 * once when it mounts: on a correct answer, a finished task, a switch
 * turned on. Place it inside a container that does not clip.
 *
 * @return The burst, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonBurst() {
  const season = useSeason();
  if (!season?.motion) return null;
  const { burst } = season.pack.look;
  return <Burst particles={season.pack.particles} ring={burst.ring} gravity={burst.gravity} spin={burst.spin} />;
}

/**
 * The season's particles falling down the whole screen in depth, for a
 * finished task. Place it last inside the screen's root view.
 *
 * @param props.count How many drops. Default 15.
 * @return The rain, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonRain({ count = RAIN_DROPS }: { count?: number }) {
  const season = useSeason();
  const awake = useAwake();
  const { width, height } = useWindowDimensions();
  if (!season?.motion) return null;
  return <EmojiRain emoji={season.pack.particles} count={count} width={width} height={height} paused={!awake} />;
}

/**
 * Shows the season's emoji for a role in place of the ordinary one, as a
 * `Text`. For the swap as a plain string, use `useSeasonEmoji`.
 *
 * @param props.role Which emoji.
 * @param props.children What to show on an ordinary day.
 * @return The emoji, or the children.
 */
export function SeasonIcon({ role, children, style }: { role: 'streak' | 'complete' | 'perfect'; children: ReactNode; style?: StyleProp<TextStyle> }) {
  const season = useSeason();
  if (!season) return <>{children}</>;
  return (
    <Text style={style} {...HIDDEN}>
      {season.pack.emoji[role]}
    </Text>
  );
}

const styles = StyleSheet.create({
  greeting: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  greetingText: { fontSize: 13, lineHeight: 18, fontWeight: '800' },
  screenCorner: {
    position: 'absolute',
    top: -16,
    right: -12,
    fontSize: 64,
    opacity: 0.55,
    transform: [{ rotate: '8deg' }],
  },
  toyAnchor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: TOY_SIZE,
  },
  toy: { fontSize: 26 },
  toyBurst: { position: 'absolute', top: 16, left: TOY_SIZE / 2 },
  bubble: {
    position: 'absolute',
    top: 4,
    right: TOY_SIZE + 2,
    width: 150,
    alignItems: 'flex-end',
  },
  bubbleText: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
  },
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
    gap: 4,
  },
  lift: { marginBottom: 14 },
});
