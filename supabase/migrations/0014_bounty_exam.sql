-- ============================================================================
-- OpenMacro — the bounty exam: a final exam for anyone who joins and learns
-- ============================================================================
--
-- A one-off challenge announced at a talk on 11 November 2026: anyone, with
-- a new account or an old one, who finishes the first half of Banking
-- and Money (lessons 1 to 13) and reaches 2,100 XP gets a 21-question exam on
-- those lessons. The first to pass wins 21,000 sats. The organiser pays by
-- hand from their own wallet, so nothing here moves money: this decides who
-- gets an exam and keeps the address the winner wants to be paid at.
--
-- How it works: whenever a lesson result is saved, a trigger checks the
-- learner. If they have finished all 13 lessons,
-- their lesson XP adds up to the threshold, they have never had a bounty exam
-- and nobody has passed one yet, it inserts an exam for them. Both clients
-- already show any assigned exam that has not been handed in, so no app
-- release is needed.
--
-- One attempt per person, like every assigned exam. Once someone passes, no
-- new bounty exams are handed out; exams already handed out can still be
-- taken. The first pass by submitted_at wins.
--
-- ---------------------------------------------------------------------------
-- WHAT THIS DELIBERATELY DOES NOT SOLVE
-- ---------------------------------------------------------------------------
--
-- Lesson XP and the exam score are written by the learner's own device (see
-- 0001 and 0008), so a determined learner could fake both. The winner is
-- checked by a person before anything is paid: docs/bounty-exam.md has the
-- query that shows how their lessons were spread over time and how long the
-- exam took.

alter table public.assigned_exams
  add column if not exists bounty boolean not null default false;

comment on column public.assigned_exams.bounty is
  'Handed out automatically by grant_bounty_exam (migration 0014), not by a teacher.';

-- At most one bounty exam per learner, even if two saves race.
create unique index if not exists assigned_exams_one_bounty_per_user
  on public.assigned_exams (user_id) where bounty;

create or replace function public.grant_bounty_exam()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_threshold constant integer     := 2100;
  v_lessons   constant text[]      := array[
    'kab-what-a-bank-is-for', 'kab-income-statement', 'kab-fractional-reserve',
    'kab-is-it-real-wealth', 'kab-bank-notes', 'kab-notes-and-cheques',
    'kab-lending-without-gold', 'kab-reserve-ratios', 'kab-more-on-reserve-ratios',
    'kab-leverage', 'kab-a-reserve-bank', 'kab-treasuries',
    'kab-open-market-operations'];
  v_xp        integer;
  v_done      integer;
begin
  if exists (select 1 from public.assigned_exams where user_id = new.user_id and bounty) then
    return new;
  end if;

  -- Closed once someone has passed (70% or more, as examPassed).
  if exists (
    select 1 from public.assigned_exams
     where bounty and submitted_at is not null and asked > 0
       and correct >= ceil(asked * 0.7)
  ) then
    return new;
  end if;

  select coalesce(sum(best_xp), 0),
         count(*) filter (where lesson_id = any (v_lessons) and best_xp > 0)
    into v_xp, v_done
    from public.lesson_progress where user_id = new.user_id;
  if v_xp < v_threshold or v_done < array_length(v_lessons, 1) then
    return new;
  end if;

  -- 21 questions drawn from those 13 lessons, 60 seconds each, like the first
  -- students' final. Spanish, the language of the room; change the row's
  -- locale if a learner asks.
  insert into public.assigned_exams
    (user_id, locale, item_count, seconds_per_question, focus_lessons, study_note, bounty)
  values
    (new.user_id, 'es-ES', 21, 60, v_lessons,
     'Examen del reto: 21 preguntas de las lecciones 1 a 13 de Banca y dinero. Aprueba con un 70 % o más (15 de 21). El primero en aprobar gana 21.000 sats: deja tu dirección bitcoin en openmacro.org/bounty.',
     true)
  on conflict do nothing;

  return new;
end;
$$;

revoke all on function public.grant_bounty_exam() from public, anon, authenticated;

drop trigger if exists lesson_progress_grant_bounty_exam on public.lesson_progress;
create trigger lesson_progress_grant_bounty_exam
  after insert or update of best_xp on public.lesson_progress
  for each row execute function public.grant_bounty_exam();

-- ---------------------------------------------------------------------------
-- Where to pay
-- ---------------------------------------------------------------------------
--
-- A learner who has passed a bounty exam leaves a Bitcoin address. Only the
-- shape is checked here; the website checks the checksum before sending it,
-- and the organiser's wallet checks it again before paying. It can be changed
-- until it has been paid. paid_at and txid are written by the organiser in
-- the SQL editor.

create table if not exists public.bounty_payouts (
  user_id      uuid        primary key references auth.users (id) on delete cascade,
  btc_address  text        not null,
  submitted_at timestamptz not null default now(),
  paid_at      timestamptz,
  txid         text
);

alter table public.bounty_payouts enable row level security;

drop policy if exists "bounty payouts are readable by their owner" on public.bounty_payouts;
create policy "bounty payouts are readable by their owner"
  on public.bounty_payouts for select using (auth.uid() = user_id);

grant select on public.bounty_payouts to authenticated;

create or replace function public.submit_bounty_address(p_address text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_address text := btrim(coalesce(p_address, ''));
begin
  if auth.uid() is null then
    raise exception 'Sign in first.';
  end if;

  if not exists (
    select 1 from public.assigned_exams
     where user_id = auth.uid() and bounty and submitted_at is not null
       and asked > 0 and correct >= ceil(asked * 0.7)
  ) then
    raise exception 'Only a learner who has passed the bounty exam can leave an address.';
  end if;

  -- Native SegWit and Taproot (bc1...), or legacy and nested SegWit (1... / 3...).
  if lower(v_address) ~ '^bc1[02-9ac-hj-np-z]{11,71}$' then
    v_address := lower(v_address);
  elsif v_address !~ '^[13][1-9A-HJ-NP-Za-km-z]{25,34}$' then
    raise exception 'That is not a Bitcoin mainnet address.';
  end if;

  if exists (select 1 from public.bounty_payouts where user_id = auth.uid() and paid_at is not null) then
    raise exception 'This prize has already been paid.';
  end if;

  insert into public.bounty_payouts (user_id, btc_address)
  values (auth.uid(), v_address)
  on conflict (user_id) do update
    set btc_address = excluded.btc_address, submitted_at = now();
end;
$$;

revoke all on function public.submit_bounty_address(text) from public, anon;
grant execute on function public.submit_bounty_address(text) to authenticated;
