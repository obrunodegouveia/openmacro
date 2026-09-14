import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSiteText } from "@/lib/site-text";

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
}: {
  params: Promise<{ video: string }>;
}) {
  const { video } = await params;
  const s = await getSiteText();

  // Validated, not trusted: this id is interpolated into a URL, and the app is
  // not the only thing that can request this route.
  if (!VIDEO_ID.test(video)) notFound();

  const src =
    `https://www.youtube-nocookie.com/embed/${video}` +
    `?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

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
      <iframe
        src={src}
        title={s("embed.frameTitle")}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{ display: "block", border: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
