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
 *
 * INSIDE THE APP (`inApp`) THREE MORE THINGS HOLD, all for the subtitles:
 *
 *   - YouTube's own full-screen button is hidden (`fs: 0`). On an iPhone it
 *     hands the <video> to Apple's native player, which knows nothing about
 *     YouTube's subtitles — they are drawn by the page, not carried in the
 *     stream — so they vanish the moment the learner goes full screen. The app
 *     offers its own full screen instead, which is this same page made large.
 *   - The app can change the subtitles of the running video through
 *     `window.openmacro.setCaptions`, so switching does not restart it.
 *   - The playback position is posted with play/pause and every few seconds,
 *     so the app can reopen the video at the same moment (`start`).
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
  getCurrentTime(): number;
  setOption(module: "captions", option: "track", value: Partial<CaptionTrack>): void;
  setOption(module: "captions", option: "fontSize", value: number): void;
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
    /** Installed in app mode only, for the app's injected JavaScript. */
    openmacro?: { setCaptions(choice: string): void };
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
  captions: captionsProp,
  title,
  onPlayingChange,
  inApp = false,
  start = 0,
}: {
  videoId: string;
  captions: CaptionChoice;
  title: string;
  onPlayingChange?: (playing: boolean) => void;
  /** Rendered by /embed for the mobile app. See the header. */
  inApp?: boolean;
  /** Whole seconds to start from. */
  start?: number;
}) {
  const mount = React.useRef<HTMLDivElement>(null);
  const player = React.useRef<YTPlayer | null>(null);
  const [failed, setFailed] = React.useState(false);
  // What the app asked for after load, which wins over the prop it loaded with.
  const [remoteCaptions, setRemoteCaptions] = React.useState<CaptionChoice | null>(null);
  const captions = remoteCaptions ?? captionsProp;

  // Kept in refs so changing the subtitle choice re-applies it to the running
  // player instead of tearing the video down and starting again.
  const captionsRef = React.useRef(captions);
  const inAppRef = React.useRef(inApp);
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
      // A phone-sized player draws subtitles at a size meant for a desk. One
      // step up (the scale runs -1 to 3) keeps two lines legible at arm's
      // length without covering the picture; full screen scales it further.
      // iOS's player ignores it and draws its own size, which is harmless.
      if (inAppRef.current) p.setOption("captions", "fontSize", 1);
    } catch {
      // The captions module is not ready yet; onApiChange calls this again
      // once it is.
    }
  }, []);

  React.useEffect(() => {
    captionsRef.current = captions;
    applyCaptions();
  }, [captions, applyCaptions]);

  // The app's handle on the running player. Only in app mode: on the site the
  // choice comes from the card's own button, and nothing else should drive it.
  React.useEffect(() => {
    if (!inApp) return;
    window.openmacro = {
      setCaptions: (choice) => {
        if (choice === "pt" || choice === "en" || choice === "off") setRemoteCaptions(choice);
      },
    };
    return () => {
      delete window.openmacro;
    };
  }, [inApp]);

  React.useEffect(() => {
    let cancelled = false;
    let ticker: ReturnType<typeof setInterval> | null = null;
    const position = () => {
      try {
        return Math.floor(player.current?.getCurrentTime() ?? 0);
      } catch {
        return 0;
      }
    };
    const post = (playing: boolean) =>
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "video", playing, time: position() }),
      );
    const report = (playing: boolean) => {
      playingRef.current?.(playing);
      post(playing);
      if (ticker) clearInterval(ticker);
      ticker = null;
      // While playing, keep the app's idea of the position fresh, so going full
      // screen (which reloads this page larger) resumes where the learner was.
      if (playing && window.ReactNativeWebView) ticker = setInterval(() => post(true), 2000);
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
            ...(start > 0 ? { start: Math.floor(start) } : {}),
            // In the app, no YouTube full screen: see the header.
            ...(inApp ? { fs: 0 } : {}),
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
      if (ticker) clearInterval(ticker);
      player.current?.destroy();
      player.current = null;
    };
    // `start` and `inApp` are read once, when the player is created; a change
    // to either arrives as a fresh page load, never as a prop update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, applyCaptions]);

  if (failed) {
    // The API script was blocked (an extension, a strict network). Fall back to
    // the plain embed so the video still plays, with captions requested by URL.
    const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
    if (start > 0) params.set("start", String(Math.floor(start)));
    if (inApp) params.set("fs", "0");
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
