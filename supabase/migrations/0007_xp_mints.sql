-- ============================================================================
-- OpenMacro — XP mints: every XP earned becomes euros once, at the rate then
-- ============================================================================
--
-- Until now an 'earnings' balance was recomputed on every read from each
-- lesson's best_xp times the current rate. Two consequences the treasury
-- owner did not want:
--
--   - Replaying a lesson earned nothing unless it beat the old best.
--   - Changing the rate re-priced everything ever earned, so lowering it
--     after a withdrawal could leave a learner owing the treasury.
--
-- Now XP is minted, like money: when the server sees XP it has not minted
-- before, it writes one row here with the rate in force at that moment. A
-- row is never updated or deleted, so minted XP only ever grows and keeps
-- the price it was minted at. A new rate applies to XP minted after it.
--
-- What bounds it (lib/rewards/earnings.ts → mintNewXp)
-- ----------------------------------------------------
--
-- profiles.total_xp and lesson_progress are written by the learner's own
-- client (0001), so neither proves anything. The mint takes the smaller of
-- total_xp and "completions × the most that lesson can award", and mints at
-- most a fixed amount of XP per day. XP over the daily limit is not lost: it
-- mints on a later day.
--
-- Two readers racing to mint the same XP compute the same xp_total_after;
-- the unique index lets one in and the other's insert fails harmlessly.

create table if not exists public.xp_mints (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users (id) on delete cascade,
  recipient_key     text        not null,
  xp                integer     not null check (xp > 0),
  -- Everything minted for this learner including this row. The uniqueness of
  -- (user_id, xp_total_after) is what makes double-minting impossible.
  xp_total_after    integer     not null check (xp_total_after > 0),
  rate_euros        text        not null check (rate_euros ~ '^\d+(\.\d{1,6})?$'),
  amount_base_units text        not null check (amount_base_units ~ '^[0-9]+$'),
  created_at        timestamptz not null default now()
);

create unique index if not exists xp_mints_user_total
  on public.xp_mints (user_id, xp_total_after);

alter table public.xp_mints enable row level security;
-- No policies: service role only, like reward_recipients and activity_minutes.

comment on table public.xp_mints is
  'Append-only. Each row turns XP into EURC base units at the rate in force when it was minted.';
