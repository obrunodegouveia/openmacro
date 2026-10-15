"use client";

import * as React from "react";

/**
 * ============================================================================
 * YouTube player with subtitles that actually turn on
 * ============================================================================
 *
 * Used by the module and lesson video cards on the site, and by /embed/[video],
 * which is what the mobile app loads — so both clients get the same subtitle
 * behaviour from this one file.
 *
 * WHY THE PLAYER API AND NOT URL PARAMETERS. The plain embed ignores what the
 * learner needs. `cc_lang_pref=pt` only selects a track whose code is exactly
 * `pt`, and most of these videos have `pt-BR`, so the parameter silently does
 * nothing and the learner is left digging through the gear menu. The official
 * IFrame Player API can read the real track list once the captions module has
 * loaded and choose from it:
 *
 *   1. the wanted language for Portugal (`pt-PT`), then
 *   2. any track in that language (`pt`, `pt-BR`), then
 *   3. YouTube's own machine translation of the original track.
 *
 * PRIVACY IS UNCHANGED. This component is only mounted after the learner has
 * pressed play, exactly like the bare iframe it replaces. The API script comes
 * from youtube.com and the player from youtube-nocookie.com — the same Google
 * the iframe was already contacting at that moment, and not a moment sooner.
 *
 * It also reports whether the video is playing, so time spent watching counts
 * as active time for a learner paid by time (lib/activity.ts). Inside the
 * app's WebView the same state is posted to React Native.
 */

/** 'off', or a language whose subtitles to show. */
export type CaptionChoice = "off" | "pt" | "en";

// The slice of the IFrame API this file uses. The real object has far more.
interface CaptionTrack {
  languageCode: string;
  kind?: string;
  translationLanguage?: { languageCode: string };
}
interface YTPlayer {
  getOption(module: "captions", option: "tracklist"): CaptionTrack[] | undefined;
  setOption(module: "captions", option: "track", value: Partial<CaptionTrack>): void;
  loadModule(module: "captions"): void;
  unloadModule(module: "captions"): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, string | number>;
      events: {
        onStateChange?: (event: { data: number }) => void;
        onApiChange?: () => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
    ReactNativeWebView?: { postMessage(message: string): void };
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Load the official API script once per page, after the first play. */
function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

/**
 * Choose the best track for a language from what this video actually has.
 * Exported for the unit check; the order is the whole policy.
 */
export function pickTrack(
  tracks: readonly CaptionTrack[],
  want: Exclude<CaptionChoice, "off">,
): Partial<CaptionTrack> | null {
  const base = (code: string) => code.toLowerCase().split("-")[0];
  const regional = want === "pt" ? "pt-pt" : "en-gb";

  const exact = tracks.find((t) => t.languageCode.toLowerCase() === regional);
  if (exact) return { languageCode: exact.languageCode };

  // Human-made before automatic, within the same language.
  const sameLanguage = tracks
    .filter((t) => base(t.languageCode) === want)
    .sort((a, b) => Number(a.kind === "asr") - Number(b.kind === "asr"));
  if (sameLanguage[0]) return { languageCode: sameLanguage[0].languageCode };

  // Nothing in that language: ask YouTube to translate. The source matters —
  // these videos carry volunteer tracks in a dozen languages, and translating
  // the Azerbaijani one into Portuguese is a translation of a translation. Use
  // an English track a person wrote, then YouTube's own transcript of what is
  // actually said (the 'asr' track), and only then anything at all.
  const original =
    tracks.find((t) => base(t.languageCode) === "en" && t.kind !== "asr") ??
    tracks.find((t) => t.kind === "asr") ??
    tracks[0];
  if (!original) return null;
  return { languageCode: original.languageCode, translationLanguage: { languageCode: want } };
}

export function YouTubePlayer({
  videoId,
  captions,
  title,
  onPlayingChange,
}: {
  videoId: string;
  captions: CaptionChoice;
  title: string;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const mount = React.useRef<HTMLDivElement>(null);
  const player = React.useRef<YTPlayer | null>(null);
  const [failed, setFailed] = React.useState(false);

  // Kept in refs so changing the subtitle choice re-applies it to the running
  // player instead of tearing the video down and starting again.
  const captionsRef = React.useRef(captions);
  const playingRef = React.useRef(onPlayingChange);
  React.useEffect(() => {
    playingRef.current = onPlayingChange;
  }, [onPlayingChange]);

  const applyCaptions = React.useCallback(() => {
    const p = player.current;
    if (!p) return;
    const choice = captionsRef.current;
    try {
      if (choice === "off") {
        // An empty track is what the player's own "Off" sets. Unloading the
        // module alone is not enough: YouTube reloads it from the viewer's
        // remembered preference a moment later.
        p.setOption("captions", "track", {});
        p.unloadModule("captions");
        return;
      }
      p.loadModule("captions");
      const tracks = p.getOption("captions", "tracklist") ?? [];
      const track = pickTrack(tracks, choice);
      if (track) p.setOption("captions", "track", track);
    } catch {
      // The captions module is not ready yet; onApiChange calls this again
      // once it is.
    }
  }, []);

  React.useEffect(() => {
    captionsRef.current = captions;
    applyCaptions();
  }, [captions, applyCaptions]);

  React.useEffect(() => {
    let cancelled = false;
    const report = (playing: boolean) => {
      playingRef.current?.(playing);
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "video", playing }));
    };

    loadApi()
      .then((YT) => {
        if (cancelled || !mount.current) return;
        const target = document.createElement("div");
        mount.current.replaceChildren(target);
        player.current = new YT.Player(target, {
          // Same cookie-less host the plain embed used.
          host: "https://www.youtube-nocookie.com",
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
            // Ask for captions from the first frame; the track is then
            // corrected from the real list in onApiChange.
            cc_load_policy: captionsRef.current === "off" ? 0 : 1,
            ...(captionsRef.current === "off" ? {} : { cc_lang_pref: captionsRef.current }),
          },
          events: {
            onStateChange: (event) => report(event.data === YT.PlayerState.PLAYING),
            // Fires when the captions module loads — the first moment the
            // track list can be read.
            onApiChange: applyCaptions,
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      report(false);
      player.current?.destroy();
      player.current = null;
    };
  }, [videoId, applyCaptions]);

  if (failed) {
    // The API script was blocked (an extension, a strict network). Fall back to
    // the plain embed so the video still plays, with captions requested by URL.
    const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
    if (captions !== "off") {
      params.set("cc_load_policy", "1");
      params.set("cc_lang_pref", captions);
    }
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    );
  }

  return <div ref={mount} title={title} className="absolute inset-0 size-full [&>iframe]:size-full" />;
}
