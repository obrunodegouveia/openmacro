-- ============================================================================
-- OpenMacro — XP mints: every XP earned becomes euros once, at the rate then
-- ============================================================================
--
-- Until now an 'earnings' balance was recomputed on every read from each
-- lesson's best_xp times the *current* rate, so changing the rate re-priced
-- everything ever earned, and lowering it after a withdrawal could leave a
-- learner owing the treasury.
--
-- Now XP is minted, like money. What counts is unchanged: each lesson's best
-- score, capped at the most that lesson can award. When that sum grows, the
-- server writes one row here for the difference, at the rate in force at that
-- moment. A row is never updated or deleted, so minted XP only grows and
-- keeps the price it was minted at. A new rate applies to XP minted after it.
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
