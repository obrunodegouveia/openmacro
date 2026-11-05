-- ============================================================================
-- OpenMacro — an exam a teacher assigns to one learner
-- ============================================================================
--
-- A row here is what makes an exam appear in one person's app and on their
-- dashboard. See docs/assigned-exams.md for how to assign one and read the
-- result.
--
-- The paper itself is not stored. Each client draws it from the seed and the
-- lessons this learner has finished, using `engine/assignedExam.ts`, so the
-- questions stay in the content registry and no names or email addresses need
-- to go anywhere near the public repository.
--
-- Stored afterwards: the score, the score per level, and the modules with no
-- correct answer. Never the answers themselves.
--
-- ---------------------------------------------------------------------------
-- WHAT THIS DELIBERATELY DOES NOT SOLVE
-- ---------------------------------------------------------------------------
--
-- Grading runs on the learner's device, so a determined learner could send
-- any score. This is a progress check between a teacher and a student, not a
-- credential. If it ever becomes one, grading has to move to the server.

create table if not exists public.assigned_exams (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  -- The language the whole exam is shown in, whatever the app is set to.
  locale        text not null default 'pt-PT' check (locale in ('en', 'pt-PT', 'es-ES')),
  seed          text not null default gen_random_uuid()::text,
  item_count    integer not null default 20 check (item_count between 1 and 60),
  assigned_at   timestamptz not null default now(),
  -- Null until the learner has handed it in.
  submitted_at  timestamptz,
  asked         integer check (asked between 1 and 60),
  correct       integer check (correct >= 0 and correct <= asked),
  by_level      jsonb,
  weak_modules  text[],
  fingerprint   text
);

create index if not exists assigned_exams_user_idx
  on public.assigned_exams (user_id, assigned_at desc);

comment on table public.assigned_exams is
  'Exams assigned to one learner. Inserted by the teacher through the service role or the SQL editor; learners can read their own and hand them in once through submit_assigned_exam.';

alter table public.assigned_exams enable row level security;

-- Read only. There is no insert or update policy: a learner cannot assign
-- themselves an exam, and can change a row only through the function below.
drop policy if exists "assigned exams are readable by their owner" on public.assigned_exams;
create policy "assigned exams are readable by their owner"
  on public.assigned_exams
  for select
  using (auth.uid() = user_id);

grant select on public.assigned_exams to authenticated;

-- ---------------------------------------------------------------------------
-- Handing it in
-- ---------------------------------------------------------------------------
--
-- One attempt: only a row with no result yet is written, so the first result
-- stands. A repeat is a quiet no-op rather than an error, because a client
-- whose connection dropped after the save has to be able to retry and succeed.

create or replace function public.submit_assigned_exam(
  p_exam         uuid,
  p_asked        integer,
  p_correct      integer,
  p_by_level     jsonb,
  p_weak_modules text[],
  p_fingerprint  text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;

  update public.assigned_exams
     set submitted_at = now(),
         asked        = p_asked,
         correct      = p_correct,
         by_level     = p_by_level,
         weak_modules = p_weak_modules,
         fingerprint  = p_fingerprint
   where id = p_exam
     and user_id = auth.uid()
     and submitted_at is null;
end;
$$;

revoke all on function public.submit_assigned_exam(uuid, integer, integer, jsonb, text[], text)
  from public, anon;
grant execute on function public.submit_assigned_exam(uuid, integer, integer, jsonb, text[], text)
  to authenticated;
