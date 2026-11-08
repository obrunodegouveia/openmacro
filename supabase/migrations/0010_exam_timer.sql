-- ============================================================================
-- OpenMacro — time an assigned exam, and pay a bonus for finishing it fast
-- ============================================================================
--
-- The clock is the database's, never the device's:
--
--   start_assigned_exam   stamps `started_at` the first time the learner taps
--                         Start. Starting again does not reset it, so peeking
--                         at the questions, leaving and starting over cannot
--                         buy a faster time. The clock keeps running while the
--                         learner is away.
--   submit_assigned_exam  stamps `submitted_at` as before, and from the two
--                         stamps works out `duration_seconds` and `bonus_xp`.
--
-- The bonus rule is mirrored in `packages/core/src/engine/assignedExam.ts`
-- (`EXAM_SPEED_BONUS`), which the clients use to explain it and which a test
-- checks against this file. This function is the one that counts.
--
--   No bonus below 70% correct, so rushing and guessing never pay.
--   At or above it: 30 seconds a question or less earns 5 XP per question
--   asked; 60 seconds a question or less earns half of that; slower, nothing.
--
-- `bonus_xp` is minted to euros like lesson XP (web/src/lib/rewards/earnings.ts).
-- The score is still graded on the learner's device, so a determined learner
-- could claim a perfect one. What bounds the damage: one bonus per exam a
-- teacher assigned, never more than 5 XP × item_count, and the time is the
-- server's.

alter table public.assigned_exams
  add column if not exists started_at       timestamptz,
  add column if not exists duration_seconds integer check (duration_seconds >= 0),
  add column if not exists bonus_xp         integer not null default 0 check (bonus_xp >= 0);

-- ---------------------------------------------------------------------------
-- Starting
-- ---------------------------------------------------------------------------
--
-- Returns the seconds since the first start, so a client can show a running
-- clock without trusting its own clock to agree with the server's.

create or replace function public.start_assigned_exam(p_exam uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_started timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;

  update public.assigned_exams
     set started_at = coalesce(started_at, now())
   where id = p_exam
     and user_id = auth.uid()
     and submitted_at is null
  returning started_at into v_started;

  if v_started is null then
    return null;
  end if;
  return floor(extract(epoch from now() - v_started))::integer;
end;
$$;

revoke all on function public.start_assigned_exam(uuid) from public, anon;
grant execute on function public.start_assigned_exam(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Handing it in, now with the time and the bonus
-- ---------------------------------------------------------------------------
--
-- Same arguments and the same one-attempt rule as 0008. It now returns what
-- was recorded, and a retry after a dropped connection returns the row as it
-- was first written, so the learner sees the same bonus either way.

drop function if exists public.submit_assigned_exam(uuid, integer, integer, jsonb, text[], text);

create function public.submit_assigned_exam(
  p_exam         uuid,
  p_asked        integer,
  p_correct      integer,
  p_by_level     jsonb,
  p_weak_modules text[],
  p_fingerprint  text
)
returns table (duration_seconds integer, bonus_xp integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row      public.assigned_exams%rowtype;
  v_asked    integer;
  v_duration integer;
  v_bonus    integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;

  select * into v_row
    from public.assigned_exams e
   where e.id = p_exam
     and e.user_id = auth.uid()
   for update;

  if not found then
    return;
  end if;

  if v_row.submitted_at is null then
    -- Never more questions than the teacher set, whatever the client says.
    v_asked := least(p_asked, v_row.item_count);

    if v_row.started_at is not null then
      v_duration := floor(extract(epoch from now() - v_row.started_at))::integer;
      if v_asked > 0 and p_correct >= 0 and p_correct <= v_asked
         and p_correct >= ceil(v_asked * 0.7) then
        if v_duration <= v_asked * 30 then
          v_bonus := v_asked * 5;
        elsif v_duration <= v_asked * 60 then
          v_bonus := (v_asked * 5) / 2;
        end if;
      end if;
    end if;

    update public.assigned_exams e
       set submitted_at     = now(),
           asked            = v_asked,
           correct          = p_correct,
           by_level         = p_by_level,
           weak_modules     = p_weak_modules,
           fingerprint      = p_fingerprint,
           duration_seconds = v_duration,
           bonus_xp         = v_bonus
     where e.id = p_exam;

    duration_seconds := v_duration;
    bonus_xp := v_bonus;
  else
    duration_seconds := v_row.duration_seconds;
    bonus_xp := v_row.bonus_xp;
  end if;

  return next;
end;
$$;

revoke all on function public.submit_assigned_exam(uuid, integer, integer, jsonb, text[], text)
  from public, anon;
grant execute on function public.submit_assigned_exam(uuid, integer, integer, jsonb, text[], text)
  to authenticated;
