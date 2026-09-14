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
 * THE IFRAME IS WRAPPED IN A PAGE, AND MUST STAY THAT WAY. Pointing the WebView
 * straight at the embed URL is the obvious thing and it fails: YouTube answers
 * "Video player configuration error — Error 153". Loaded as a top-level
 * navigation there is no embedding page, so the player cannot establish which
 * origin is embedding it, and it refuses to play rather than guess.
 *
 * So the WebView is handed a one-line HTML document that contains the iframe,
 * with `baseUrl` giving that document a real https origin and `origin=` on the
 * embed telling the player to expect it. `baseUrl` is not fetched — the markup
 * is supplied inline — so the promise above is intact: nothing reaches Google
 * until the learner presses play, and then only youtube-nocookie.com.
 *
 * COLLAPSING IS A PREFERENCE, NOT CARD STATE. A 16:9 frame is the tallest
 * thing on the screen, and a learner who has already watched a module's
 * videos elsewhere — or who simply reads faster than anyone talks — should be
 * able to put them away and have them stay away. See `videoPreference`.
 */

import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { useLocale } from '@/providers/LocaleProvider';
import { useVideosCollapsed } from '@/services/videoPreference';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export interface LessonVideoProps {
  /** A watch URL, a youtu.be link, or a bare 11-character id. */
  url: string;
  /** Shown on the placeholder, so the learner knows what they are about to play. */
  title: string;
  minutes?: number;
  /** Attribution — a viewer is owed the knowledge of whose video this is. */
  source?: string;
}

export function LessonVideo({ url, title, minutes, source }: LessonVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [collapsed, setCollapsed] = useVideosCollapsed();
  const { t } = useLocale();
  const id = youTubeId(url);
  if (!id) return null;

  const toggle = () => {
    // Collapsing unmounts the player, which stops it. Re-expanding therefore
    // comes back to the placeholder rather than resuming — the same press is
    // still required to contact Google, which is the promise this card makes.
    if (!collapsed) setPlaying(false);
    setCollapsed(!collapsed);
  };

  return (
    <View style={styles.card}>
      {collapsed ? null : (
        <View style={styles.frame}>
          {playing ? (
            <WebView
              source={{ html: playerDocument(id), baseUrl: EMBED_ORIGIN }}
              originWhitelist={['*']}
              style={styles.web}
              // The player needs its own JS, and on iOS inline playback has to be
              // allowed or tapping play throws it into the fullscreen overlay.
              javaScriptEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loading}>
                  <ActivityIndicator color={palette.inkFaint} />
                </View>
              )}
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('lesson.video.play', { title })}
              style={styles.placeholder}
              onPress={() => setPlaying(true)}
            >
              <View style={styles.playButton}>
                <Text style={styles.playGlyph}>▶︎</Text>
              </View>
              <Text style={styles.placeholderTitle} numberOfLines={2}>
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
        style={styles.meta}
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
    </View>
  );
}

/**
 * The origin the player is told to expect.
 *
 * Any real https origin satisfies YouTube; this one is used because it is the
 * player's own site and cannot be mistaken for an attempt to disguise where the
 * embed lives. Nothing is ever fetched from it — see the note about `baseUrl`
 * above.
 */
const EMBED_ORIGIN = 'https://www.youtube.com';

/**
 * A minimal page whose only job is to be somewhere the iframe can be embedded.
 *
 * `id` is safe to interpolate: every path through `youTubeId` returns only
 * strings matching `/^[\w-]{11}$/`, so nothing here can carry markup.
 */
function playerDocument(id: string): string {
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(EMBED_ORIGIN)}`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: #000; overflow: hidden; }
      iframe { display: block; border: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <iframe
      src="${src}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
    ></iframe>
  </body>
</html>`;
}

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
    backgroundColor: palette.ink,
  },
  web: {
    flex: 1,
    backgroundColor: palette.ink,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
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
    color: palette.surface,
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
    color: palette.mint,
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
