-- ============================================================================
-- OpenMacro — learner progress
-- ============================================================================
--
-- Apply with the Supabase CLI (`supabase db push`) or by pasting into the
-- SQL editor of a new project. See docs/cloud-sync.md for the full setup.
--
-- Two tables, both owned by the learner and unreadable by anyone else. There
-- is deliberately no service-role path in the app: the anon key plus these
-- policies is the entire security model, which keeps the client honest.

-- ---------------------------------------------------------------------------
-- profiles: one row per learner
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  avatar_url    text,
  total_xp      integer     not null default 0 check (total_xp >= 0),
  day_streak    integer     not null default 0 check (day_streak >= 0),
  -- Local calendar date of the learner's last completed lesson, 'YYYY-MM-DD'.
  -- Stored as a date, not a timestamp: a streak is a question about the
  -- learner's own calendar, and pinning it to an instant reintroduces exactly
  -- the timezone bug that local date keys exist to avoid.
  last_active_on date,
  updated_at    timestamptz not null default now()
);

-- `streak_active_today` is deliberately NOT stored. It is derived on read by
-- comparing `last_active_on` with the device's today, so a learner crossing a
-- timezone never sees a stale flame.

alter table public.profiles enable row level security;

drop policy if exists "profiles are private to their owner" on public.profiles;
create policy "profiles are private to their owner"
  on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- lesson_progress: one row per learner per lesson
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id           uuid        not null references auth.users (id) on delete cascade,
  -- Matches `Lesson.id` in src/content/. Text rather than a foreign key: the
  -- lesson catalogue lives in the app bundle, not the database, so that
  -- contributors can add lessons without a migration.
  lesson_id         text        not null,
  best_xp           integer     not null default 0 check (best_xp >= 0),
  completions       integer     not null default 0 check (completions >= 0),
  perfect           boolean     not null default false,
  last_completed_at timestamptz,
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "lesson progress is private to its owner" on public.lesson_progress;
create policy "lesson progress is private to its owner"
  on public.lesson_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Every query is "my rows", and the primary key already leads with user_id,
-- so no additional index is needed.
