"use client";

import * as React from "react";
import {
  VIDEO_PROGRESS_COLUMNS,
  VIDEO_PROGRESS_RESUME_COLUMNS,
  createWatchTracker,
  mergeSegments,
  shouldSaveVideoProgress,
  videoProgressArgs,
  videoProgressFromRow,
  videoWatched,
  watchedSeconds,
  watchedShare,
  type VideoProgress,
  type WatchSegment,
  type WatchTracker,
} from "@openmacro/core/engine/videoProgress";

import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";

/**
 * Records how much of one video the signed-in learner watches, for the
 * `onProgress` of `YouTubePlayer`. Signed out, it records nothing.
 *
 * What was stored before is read when the card mounts (our own database, not
 * YouTube, so the promise that nothing reaches Google before play holds), and
 * merged with what is played, so a video half watched on a phone and finished
 * here counts once. The app's twin is `src/hooks/useVideoProgress.ts`; both
 * count with `@openmacro/core/engine/videoProgress`.
 *
 * @param key Where the video is (`lessonVideoKey`, `moduleVideoKey`).
 * @param videoId The YouTube id.
 * @param onWatched Called once, the first time 90% of the video has been
 *   played by a learner who had not watched it before: the moment it earns
 *   its XP (`videoXp`).
 */
export function useVideoProgressRecorder(
  key: string,
  videoId: string | null,
  onWatched?: () => void,
): (report: { time: number; duration: number; playing: boolean }) => void {
  const { learner } = useAuth();
  const userId = learner?.id ?? null;
  const tracker = React.useRef<WatchTracker | null>(null);
  const stored = React.useRef<WatchSegment[]>([]);
  const duration = React.useRef(0);
  const lastSaved = React.useRef(0);
  // Whether the stored row has been read, whether it was already watched, and
  // whether this card has already said so: XP is earned once per video.
  const loaded = React.useRef(false);
  const wasWatched = React.useRef(false);
  const awarded = React.useRef(false);
  const watchedRef = React.useRef(onWatched);
  React.useEffect(() => {
    watchedRef.current = onWatched;
  }, [onWatched]);

  // What this learner had already watched of this video.
  React.useEffect(() => {
    tracker.current = null;
    stored.current = [];
    loaded.current = false;
    wasWatched.current = false;
    awarded.current = false;
    const supabase = getSupabase();
    if (!supabase || !userId || !videoId) return;
    let live = true;
    void (async () => {
      const { data } = await supabase
        .from("video_progress")
        .select(VIDEO_PROGRESS_RESUME_COLUMNS)
        .eq("video_key", key)
        .maybeSingle();
      if (!live) return;
      loaded.current = true;
      if (!data) return;
      wasWatched.current = Boolean(data.completed_at);
      const segments = mergeSegments(Array.isArray(data.segments) ? data.segments : []);
      stored.current = segments;
      // Already playing when the read came back: fold it into what is counted.
      if (tracker.current) {
        tracker.current = createWatchTracker([...segments, ...tracker.current.segments()]);
      }
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [key, videoId, userId]);

  const save = React.useCallback(() => {
    const supabase = getSupabase();
    const current = tracker.current;
    if (!supabase || !userId || !videoId || !current || duration.current <= 0) return;
    current.saved();
    lastSaved.current = Date.now();
    void supabase
      .rpc("record_video_progress", videoProgressArgs(key, videoId, duration.current, current.segments()))
      .then(({ error }) => {
        // Not saved: count it as unsaved, so the next report tries again.
        if (error) current.unsaved();
      });
  }, [key, videoId, userId]);

  // Closing the lesson or putting the video away mid-play: keep what was watched.
  React.useEffect(
    () => () => {
      if (tracker.current?.changed) save();
    },
    [save],
  );

  return React.useCallback(
    (report: { time: number; duration: number; playing: boolean }) => {
      if (!userId) return;
      if (report.duration > 0) duration.current = report.duration;
      if (!tracker.current) tracker.current = createWatchTracker(stored.current);
      const now = Date.now();
      tracker.current.observe(report.time, report.playing, now);
      const share = watchedShare(watchedSeconds(tracker.current.segments()), duration.current);
      if (loaded.current && !wasWatched.current && !awarded.current && videoWatched(share)) {
        // Saved at once, so the row says "watched" before anything counts it.
        awarded.current = true;
        save();
        watchedRef.current?.();
        return;
      }
      if (shouldSaveVideoProgress(tracker.current, report.playing, lastSaved.current, now)) save();
    },
    [userId, save],
  );
}

/**
 * The signed-in learner's progress on these videos, by key. Empty signed out,
 * or before anything was read.
 */
export function useVideoProgress(keys: readonly string[]): ReadonlyMap<string, VideoProgress> {
  const { learner } = useAuth();
  const userId = learner?.id ?? null;
  const [found, setFound] = React.useState<ReadonlyMap<string, VideoProgress>>(new Map());
  const joined = keys.join("\n");

  React.useEffect(() => {
    const supabase = getSupabase();
    const wanted = joined ? joined.split("\n") : [];
    if (!supabase || !userId || wanted.length === 0) return;
    let live = true;
    void (async () => {
      const { data } = await supabase.from("video_progress").select(VIDEO_PROGRESS_COLUMNS).in("video_key", wanted);
      if (live && data) setFound(new Map(data.map((row) => [row.video_key, videoProgressFromRow(row)])));
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [joined, userId]);

  return found;
}
