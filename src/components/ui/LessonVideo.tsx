/**
 * ============================================================================
 * In-app video for a lesson
 * ============================================================================
 *
 * The YouTube iframe player inside a WebView, rather than throwing the learner
 * out to the browser and hoping they come back.
 *
 * Two constraints shape this, and both are deliberate.
 *
 * NOTHING LOADS UNTIL PLAY IS PRESSED. The site promises it does not track
 * people, and a mounted iframe contacts Google whether or not anyone watches.
 * So this renders a plain card, and the WebView is only created once the
 * learner has asked for it. The web version of this component makes the same
 * promise and keeps it the same way — including refusing to fetch YouTube's
 * thumbnail, because `i.ytimg.com` is a Google host and requesting an image
 * from it hands over an IP address before anyone has decided to watch.
 *
 * THE OFFICIAL PLAYER, UNMODIFIED. `youtube-nocookie.com/embed` is the
 * embed YouTube publishes and permits. Extracting a stream URL to feed a
 * native player would be smoother and would also breach their terms, strip the
 * creator's attribution, and break the first time they change anything.
 *
 * The module this exists for is somebody else's teaching, used with the
 * player they provide.
 *
 * THE PLAYER IS LOADED FROM OUR OWN SITE, AND HAS TO BE. Two simpler things
 * were tried and both return "Video player configuration error — Error 153".
 *
 * Pointing the WebView at `youtube-nocookie.com/embed/...` loads it as a
 * top-level navigation: there is no embedding page, so the player cannot
 * establish which origin is embedding it and refuses rather than guess.
 * Wrapping the iframe in local HTML and setting `baseUrl` does not help either
 * — that goes through `loadHTMLString`, which does not give the document a real
 * origin as far as a cross-origin subframe is concerned, so the player sees the
 * same nothing.
 *
 * Measured, not assumed. The same embed was loaded four ways in a real browser:
 * top-level → 153, inside a document with no real origin → 153, inside an
 * iframe on a genuine https origin → plays, and openmacro.org itself → plays.
 * Only a real origin works, so the app borrows the one the website already has.
 *
 * `/embed/<id>` is a bare page that exists for this and nothing else. The
 * privacy promise above is unchanged: the WebView is not mounted until play, so
 * nothing is requested until then — and then it is this site and
 * youtube-nocookie.com, which is what it always was.
 *
 * SUBTITLES SURVIVE FULL SCREEN BECAUSE THE FULL SCREEN IS OURS. YouTube draws
 * its subtitles in the page, over the video. Its own full-screen button, on an
 * iPhone, hands the bare <video> to Apple's native player, and the subtitles
 * stay behind on the page — the learner who needs them most loses them the
 * moment the video is big enough to watch. So the embed is asked to hide that
 * button (`app=1`), and the button here opens the same page in a modal turned
 * on its side to fill the screen. It is still the page, so the subtitles come
 * with it. The app is locked to portrait and that lock is native, so the turn
 * is a transform: changing it would need a new build, and this ships as an
 * update.
 *
 * Going full screen reloads the page larger, at the second it had reached —
 * the embed reports its position as it plays. Changing the subtitles does not
 * reload anything: the choice is handed to the running player.
 *
 * COLLAPSING IS A PREFERENCE, NOT CARD STATE. A 16:9 frame is the tallest
 * thing on the screen, and a learner who has already watched a module's
 * videos elsewhere — or who simply reads faster than anyone talks — should be
 * able to put them away and have them stay away. See `videoPreference`.
 */

import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useLocale } from '@/providers/LocaleProvider';
import {
  nextCaptions,
  resolveCaptions,
  useVideoCaptions,
  useVideosCollapsed,
} from '@/services/videoPreference';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';

export interface LessonVideoProps {
  /** A watch URL, a youtu.be link, or a bare 11-character id. */
  url: string;
  /** Shown on the placeholder, so the learner knows what they are about to play. */
  title: string;
  minutes?: number;
  /** Attribution — a viewer is owed the knowledge of whose video this is. */
  source?: string;
}

/**
 * The page a WebView loads. Fixed for the life of that WebView: a new subtitle
 * choice goes to the running player instead, so the address never changes
 * under it and the video never restarts.
 */
interface EmbedLoad {
  cc: 'pt' | 'en' | 'off';
  start: number;
}

export function LessonVideo({ url, title, minutes, source }: LessonVideoProps) {
  const [load, setLoad] = useState<EmbedLoad | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [collapsed, setCollapsed] = useVideosCollapsed();
  const [captions, setCaptions] = useVideoCaptions();
  const { t, locale } = useLocale();
  const screen = useWindowDimensions();
  const web = useRef<WebView>(null);
  // The second the embed last reported, for reopening at the same moment.
  const position = useRef(0);
  const id = youTubeId(url);
  const playing = load !== null;
  const cc = resolveCaptions(captions, locale);

  // Hand a changed choice to whichever player is on screen.
  useEffect(() => {
    web.current?.injectJavaScript(
      `window.openmacro && window.openmacro.setCaptions(${JSON.stringify(cc)}); true;`,
    );
  }, [cc]);

  if (!id) return null;

  const toggle = () => {
    // Collapsing unmounts the player, which stops it. Re-expanding therefore
    // comes back to the placeholder rather than resuming — the same press is
    // still required to contact Google, which is the promise this card makes.
    if (!collapsed) setLoad(null);
    setCollapsed(!collapsed);
  };

  // Entering or leaving full screen swaps one WebView for another, so the new
  // one starts where the old one was.
  const setFull = (next: boolean) => {
    setLoad({ cc, start: position.current });
    setFullscreen(next);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as { type?: string; time?: unknown };
      if (message.type === 'video' && typeof message.time === 'number') {
        position.current = message.time;
      }
    } catch {
      // Not ours.
    }
  };

  const player = load ? (
    <WebView
      ref={web}
      source={{
        uri: `${SITE_ORIGIN}/embed/${id}?cc=${load.cc}&app=1${load.start > 0 ? `&t=${load.start}` : ''}`,
      }}
      originWhitelist={['*']}
      style={styles.web}
      onMessage={onMessage}
      // The player needs its own JS, and on iOS inline playback has to be
      // allowed or tapping play throws it into the native fullscreen overlay —
      // which, like YouTube's own full-screen button, drops the subtitles.
      javaScriptEnabled
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      allowsFullscreenVideo={false}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.onMedia} />
        </View>
      )}
    />
  ) : null;

  // Turned a quarter so the long side of the video runs along the long side of
  // the phone. Already landscape (a tablet), it simply fills the screen.
  const portrait = screen.height > screen.width;
  const fullFrame = portrait
    ? {
        width: screen.height,
        height: screen.width,
        transform: [{ rotate: '90deg' }],
      }
    : { width: screen.width, height: screen.height };

  return (
    <View style={styles.card}>
      {collapsed ? null : (
        <View style={styles.frame}>
          {playing ? (
            // One player at a time: while the full-screen one plays, this
            // frame stays black rather than playing the same video twice.
            fullscreen ? null : player
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('lesson.video.play', { title })}
              style={styles.placeholder}
              onPress={() => {
                position.current = 0;
                setLoad({ cc, start: 0 });
              }}
            >
              <View style={styles.playButton}>
                <Text allowFontScaling={false} style={styles.playGlyph}>▶︎</Text>
              </View>
              {/* One line, capped: in a 16:9 frame a title that wrapped at a
                  large text size pushed the play button out of the top. */}
              <Text maxFontSizeMultiplier={fontScale.title} style={styles.placeholderTitle} numberOfLines={1}>
                {title}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: !collapsed }}
        accessibilityLabel={collapsed ? t('lesson.video.show') : t('lesson.video.hide')}
        style={({ pressed }) => [styles.meta, pressed && styles.pressed]}
        onPress={toggle}
      >
        <View style={styles.metaLines}>
          {/* Collapsed, this row is all that is left of the card, so it has to
              carry the title the frame was showing. */}
          {collapsed ? (
            <Text style={styles.metaTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          <Text style={styles.metaText}>
            {minutes ? t('lesson.video.minutes', { count: minutes }) : t('lesson.video.watchFirst')}
            {source ? ` · ${source}` : ''}
          </Text>
          {!playing && !collapsed ? (
            <Text style={styles.metaQuiet}>{t('lesson.video.privacy')}</Text>
          ) : null}
        </View>
        <Text style={styles.toggle}>
          {collapsed ? t('lesson.video.show') : t('lesson.video.hide')}
        </Text>
      </Pressable>

      {collapsed ? null : (
        <View style={styles.controls}>
          {/* One press cycles Auto → Português → English → Off, remembered for
              every video — the same control the website shows beside its
              player. A playing video switches without restarting. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('lesson.video.captions', { choice: t(`lesson.video.captions.${captions}`) })}
            style={({ pressed }) => [styles.control, pressed && styles.pressed]}
            onPress={() => setCaptions(nextCaptions(captions))}
          >
            <Text style={styles.toggle}>
              {t('lesson.video.captions', { choice: t(`lesson.video.captions.${captions}`) })}
            </Text>
          </Pressable>
          {playing ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('lesson.video.fullscreen')}
              style={({ pressed }) => [styles.control, pressed && styles.pressed]}
              onPress={() => setFull(true)}
            >
              <Text style={styles.toggle}>{t('lesson.video.fullscreen')}</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      <Modal
        visible={fullscreen && playing}
        animationType="fade"
        // Android's back gesture closes it, back to the card.
        onRequestClose={() => setFull(false)}
        statusBarTranslucent
        supportedOrientations={['portrait', 'landscape']}
      >
        <StatusBar hidden />
        <View style={styles.fullscreen}>
          <View style={fullFrame}>
            {fullscreen ? player : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('lesson.video.exitFullscreen')}
              hitSlop={12}
              style={styles.close}
              onPress={() => setFull(false)}
            >
              <Text style={styles.closeGlyph}>✕</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/**
 * Where the embed page lives.
 *
 * Hardcoded to production on purpose. A build pointed at a local dev server
 * would play videos for whoever is running one and silently fail for everybody
 * else, and this is the one screen where a fallback that half-works is worse
 * than an obvious break.
 */
const SITE_ORIGIN = 'https://openmacro.org';

/** Accepts a watch URL, a youtu.be link, or a bare id. */
function youTubeId(url: string): string | null {
  const bare = /^[\w-]{11}$/;
  if (bare.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return bare.test(id) ? id : null;
    }
    const v = parsed.searchParams.get('v');
    if (v && bare.test(v)) return v;
    const embed = /\/(?:embed|shorts)\/([\w-]{11})/.exec(parsed.pathname);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    overflow: 'hidden',
  },
  frame: {
    // 16:9, which is what the player expects; anything else letterboxes.
    aspectRatio: 16 / 9,
    width: '100%',
    backgroundColor: palette.media,
  },
  web: {
    flex: 1,
    backgroundColor: palette.media,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.media,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.mint,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  playGlyph: {
    fontSize: 24,
    color: palette.mint,
    // The glyph is optically left-heavy; nudge it back into the circle.
    marginLeft: 4,
  },
  placeholderTitle: {
    ...typography.bodyStrong,
    color: palette.onMedia,
    textAlign: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  control: {
    minHeight: 44,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  close: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  closeGlyph: {
    fontSize: 18,
    color: '#fff',
  },
  metaLines: {
    flex: 1,
    gap: 2,
  },
  metaTitle: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  toggle: {
    ...typography.caption,
    // mint itself is a fill, 2.4:1 as text; mintDark is the text green.
    color: palette.mintDark,
  },
  metaText: {
    ...typography.caption,
    color: palette.ink,
  },
  metaQuiet: {
    ...typography.caption,
    color: palette.inkMuted,
  },
});
