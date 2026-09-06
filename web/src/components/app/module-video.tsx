"use client";

import * as React from "react";
import { Play } from "lucide-react";
import type { ModuleVideo as ModuleVideoData } from "@openmacro/core/content/schema";

/**
 * Watch-first overview for a module.
 *
 * Nothing whatsoever loads from Google until the learner presses play. The
 * site tells people it does not track them, and an embedded iframe contacts
 * Google on page load whether or not anyone watches — so this renders a
 * placeholder and a button, and only then mounts the player.
 *
 * It deliberately does not use YouTube's thumbnail either. That was the first
 * version, and it quietly made the promise false: `i.ytimg.com` is a Google
 * host, and requesting a still image from it hands over the visitor's IP
 * address before they have decided to watch anything. A gradient and a title
 * cost nothing and keep the claim on the card literally true.
 */
export function ModuleVideo({
  video,
  moduleTitle,
}: {
  video: ModuleVideoData;
  moduleTitle: string;
}) {
  const [playing, setPlaying] = React.useState(false);
  const id = youTubeId(video.url);
  if (!id) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-card border border-hairline bg-white/[0.03]">
      <div className="relative aspect-video w-full bg-abyss">
        {playing ? (
          <iframe
            // youtube-nocookie serves the same player without setting
            // advertising cookies on people who never come back.
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${moduleTitle} — overview`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 size-full cursor-pointer"
            aria-label={`Play the ${moduleTitle} overview`}
          >
            <span
              aria-hidden
              className="grid-lines absolute inset-0 bg-gradient-to-br from-mint/15 via-abyss to-azure/15"
            />
            <span className="absolute inset-x-0 bottom-3 px-4 text-left text-sm font-extrabold text-ink/80">
              {moduleTitle}
            </span>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full border border-mint/40 bg-abyss/80 backdrop-blur transition-transform group-hover:scale-110">
                <Play className="size-7 translate-x-0.5 fill-mint-bright text-mint-bright" aria-hidden />
              </span>
            </span>
          </button>
        )}
      </div>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-xs font-bold text-ink-faint">
        <span className="text-ink">Watch this first</span>
        {video.minutes ? <span>{video.minutes} min</span> : null}
        {video.source ? <span>Narration generated with {video.source}</span> : null}
        {!playing ? <span className="text-ink-faint">Nothing loads until you press play</span> : null}
      </p>
    </div>
  );
}

/** Accepts a watch URL, a youtu.be link, or a bare id. */
function youTubeId(url: string): string | null {
  const bare = /^[\w-]{11}$/;
  if (bare.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return bare.test(id) ? id : null;
    }
    const v = parsed.searchParams.get("v");
    if (v && bare.test(v)) return v;
    const embed = parsed.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}
