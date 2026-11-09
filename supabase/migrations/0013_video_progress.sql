-- ============================================================================
-- OpenMacro — how much of each video a signed-in learner has watched
-- ============================================================================
--
-- One row per learner and video. `video_key` says where the video is: a
-- lesson id for a lesson's video, or `module:<module id>` for a module's.
-- `segments` are the stretches actually played, as [from, to] seconds,
-- merged; skipping ahead does not add the part skipped, and watching a part
-- twice counts it once. `watched_seconds` is their total. The clients work
-- this out with `packages/core/src/engine/videoProgress.ts` and both send it
-- through `record_video_progress`.
--
-- What is not here: when or how often a learner paused, what else was on
-- screen, anything from YouTube. Only how much of the video was played, so a
-- teacher can see that a lesson's video was watched (the exam study plan).
--
-- Signed-out learners record nothing: there is no row to write without an
-- account. Deleting the account deletes these rows (on delete cascade).

create table if not exists public.video_progress (
  user_id          uuid        not null references auth.users (id) on delete cascade,
  video_key        text        not null check (char_length(video_key) between 1 and 200),
  video_id         text        not null check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  duration_seconds integer     not null check (duration_seconds between 1 and 86400),
  watched_seconds  integer     not null default 0 check (watched_seconds >= 0),
  segments         jsonb       not null default '[]'::jsonb check (jsonb_typeof(segments) = 'array'),
  -- The first time 90% or more had been watched (`VIDEO_WATCHED_SHARE`).
  completed_at     timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (user_id, video_key)
);

alter table public.video_progress enable row level security;

drop policy if exists "Own video progress" on public.video_progress;
create policy "Own video progress"
  on public.video_progress
  for select
  using (auth.uid() = user_id);

-- Writes go through the function below only, so a client cannot shrink what
-- another device recorded.
revoke insert, update, delete on public.video_progress from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Recording
-- ---------------------------------------------------------------------------
--
-- The client sends everything it knows: what was loaded at play, merged with
-- what was played since. A report that covers less than what is stored
-- (another device recorded more meanwhile) leaves the row as it is, so
-- progress never goes backwards.

create or replace function public.record_video_progress(
  p_video_key text,
  p_video_id  text,
  p_duration  integer,
  p_segments  jsonb,
  p_watched   integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_watched integer := least(greatest(p_watched, 0), p_duration);
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;
  if jsonb_typeof(p_segments) <> 'array' or jsonb_array_length(p_segments) > 200 then
    raise exception 'Segments must be a list of at most 200 [from, to] pairs.';
  end if;

  insert into public.video_progress as v
    (user_id, video_key, video_id, duration_seconds, watched_seconds, segments, completed_at, updated_at)
  values
    (auth.uid(), p_video_key, p_video_id, p_duration, v_watched, p_segments,
     case when v_watched >= ceil(p_duration * 0.9) then now() end, now())
  on conflict (user_id, video_key) do update
     set video_id         = excluded.video_id,
         duration_seconds = excluded.duration_seconds,
         watched_seconds  = excluded.watched_seconds,
         segments         = excluded.segments,
         completed_at     = coalesce(v.completed_at, excluded.completed_at),
         updated_at       = now()
   where excluded.watched_seconds >= v.watched_seconds;
end;
$$;

revoke all on function public.record_video_progress(text, text, integer, jsonb, integer) from public, anon;
grant execute on function public.record_video_progress(text, text, integer, jsonb, integer) to authenticated;
