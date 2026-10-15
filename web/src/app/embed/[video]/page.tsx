import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSiteText } from "@/lib/site-text";
import { YouTubePlayer, type CaptionChoice } from "@/components/app/youtube-player";

/**
 * ============================================================================
 * /embed/[video] — the YouTube player, on an origin YouTube will accept
 * ============================================================================
 *
 * This page exists for the mobile app, not for anybody browsing the site.
 *
 * The app cannot embed YouTube on its own. A WebView pointed at
 * `youtube-nocookie.com/embed/...` loads it as a top-level navigation, so there
 * is no embedding page and the player answers "Video player configuration
 * error — Error 153" rather than guessing which origin it is inside. Wrapping
 * the iframe in local HTML does not fix it either: react-native-webview's
 * `baseUrl` goes through `loadHTMLString`, which does not give the document a
 * real origin as far as a cross-origin subframe is concerned, and the player
 * refuses in exactly the same way.
 *
 * Measured rather than assumed — an iframe on a genuine https origin plays, and
 * the same iframe in a document without one returns 153.
 *
 * So the app loads this page instead. It is the arrangement the website has
 * always used and which has always worked; the app just did not have a page of
 * its own to use.
 *
 * Deliberately bare: no navigation, no footer, no analytics, nothing but the
 * player. `noindex` because it is machinery, not content — the lesson pages are
 * what should be found.
 *
 * The privacy promise the video component makes is unchanged. Nothing here is
 * requested until the learner presses play, because the app does not mount the
 * WebView until then. At that point it contacts this site and YouTube, and
 * YouTube only through `youtube-nocookie.com`.
 */

/** YouTube ids are exactly eleven characters of `[A-Za-z0-9_-]`. */
const VIDEO_ID = /^[\w-]{11}$/;

export const metadata: Metadata = {
  title: "OpenMacro video",
  robots: { index: false, follow: false },
};

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ video: string }>;
  searchParams: Promise<{ cc?: string }>;
}) {
  const { video } = await params;
  const { cc } = await searchParams;
  const s = await getSiteText();

  // Validated, not trusted: this id is interpolated into a URL, and the app is
  // not the only thing that can request this route.
  if (!VIDEO_ID.test(video)) notFound();

  // The app passes the learner's subtitle choice, already resolved from its
  // own language setting. Anything unrecognised means no subtitles, which is
  // what this page did before the parameter existed.
  const captions: CaptionChoice = cc === "pt" || cc === "en" ? cc : "off";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        // The root layout paints an aurora behind everything; this sits over it
        // so the player has the black surround it expects.
        zIndex: 50,
      }}
    >
      {/* The same player as the site's own video cards, so subtitles choose
          the same track in the app as in the browser. It also posts
          play/pause to the app through window.ReactNativeWebView. */}
      <YouTubePlayer videoId={video} captions={captions} title={s("embed.frameTitle")} />
    </div>
  );
}
