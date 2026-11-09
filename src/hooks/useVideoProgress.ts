

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  VIDEO_PROGRESS_COLUMNS,
  VIDEO_PROGRESS_RESUME_COLUMNS,
  createWatchTracker,
  mergeSegments,
  shouldSaveVideoProgress,
  videoProgressArgs,
  videoProgressFromRow,
  type VideoProgress,
  type WatchSegment,
  type WatchTracker,
} from '@openmacro/core/engine/videoProgress';

import { useAuth } from '@/providers/AuthProvider';
import { supabase as client } from '@/services/supabaseClient';

/**
 * Records how much of one video the signed-in learner watches, from the
 * messages the embed posts (`LessonVideo`). Signed out, it records nothing.
 *
 * What was stored before is read when the card mounts (our own database, not
 * YouTube, so the promise that nothing reaches Google before play holds), and
 * merged with what is played, so a video half watched on a phone and finished
 * here counts once. The website’s twin is `web/src/lib/use-video-progress.ts`; both
 * count with `@openmacro/core/engine/videoProgress`.
 *
 * @param key Where the video is (`lessonVideoKey`, `moduleVideoKey`).
 * @param videoId The YouTube id.
 */
export function useVideoProgressRecorder(
  key: string,
  videoId: string | null,
): (report: { time: number; duration: number; playing: boolean }) => void {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const tracker = useRef<WatchTracker | null>(null);
  const stored = useRef<WatchSegment[]>([]);
  const duration = useRef(0);
  const lastSaved = useRef(0);

  // What this learner had already watched of this video.
  useEffect(() => {
    tracker.current = null;
    stored.current = [];
    const supabase = client;
    if (!supabase || !userId || !videoId) return;
    let live = true;
    void (async () => {
      const { data } = await supabase
        .from('video_progress')
        .select(VIDEO_PROGRESS_RESUME_COLUMNS)
        .eq('video_key', key)
        .maybeSingle();
      if (!live || !data) return;
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

  const save = useCallback(() => {
    const supabase = client;
    const current = tracker.current;
    if (!supabase || !userId || !videoId || !current || duration.current <= 0) return;
    current.saved();
    lastSaved.current = Date.now();
    void supabase
      .rpc('record_video_progress', videoProgressArgs(key, videoId, duration.current, current.segments()))
      .then(({ error }) => {
        // Not saved: count it as unsaved, so the next report tries again.
        if (error) current.unsaved();
      });
  }, [key, videoId, userId]);

  // Closing the lesson or putting the video away mid-play: keep what was watched.
  useEffect(
    () => () => {
      if (tracker.current?.changed) save();
    },
    [save],
  );

  return useCallback(
    (report: { time: number; duration: number; playing: boolean }) => {
      if (!userId) return;
      if (report.duration > 0) duration.current = report.duration;
      if (!tracker.current) tracker.current = createWatchTracker(stored.current);
      const now = Date.now();
      tracker.current.observe(report.time, report.playing, now);
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
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const [found, setFound] = useState<ReadonlyMap<string, VideoProgress>>(new Map());
  const joined = keys.join('\n');

  useEffect(() => {
    const supabase = client;
    const wanted = joined ? joined.split('\n') : [];
    if (!supabase || !userId || wanted.length === 0) return;
    let live = true;
    void (async () => {
      const { data } = await supabase.from('video_progress').select(VIDEO_PROGRESS_COLUMNS).in('video_key', wanted);
      if (live && data) setFound(new Map(data.map((row) => [row.video_key, videoProgressFromRow(row)])));
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [joined, userId]);

  return found;
}
