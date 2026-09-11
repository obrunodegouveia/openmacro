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
 */

import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

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
  const id = youTubeId(url);
  if (!id) return null;

  return (
    <View style={styles.card}>
      <View style={styles.frame}>
        {playing ? (
          <WebView
            source={{ uri: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1` }}
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
            accessibilityLabel={`Play ${title}`}
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

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {minutes ? `${minutes} min` : 'Watch first'}
          {source ? ` · ${source}` : ''}
        </Text>
        {!playing ? (
          <Text style={styles.metaQuiet}>Nothing loads until you press play</Text>
        ) : null}
      </View>
    </View>
  );
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 2,
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
