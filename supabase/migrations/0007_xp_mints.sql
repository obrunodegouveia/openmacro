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
-- Each mint records what had been minted before it. Two readers racing to
-- mint read the same total, so they insert the same xp_total_before, and the
-- unique index lets exactly one in. Keying on the total *after* would not:
-- two readers that saw different best scores would both get in, and the
-- same XP would be minted twice.

create table if not exists public.xp_mints (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users (id) on delete cascade,
  recipient_key     text        not null,
  xp                integer     not null check (xp > 0),
  -- Everything minted for this learner before this row. The uniqueness of
  -- (user_id, xp_total_before) is what makes double-minting impossible.
  xp_total_before   integer     not null check (xp_total_before >= 0),
  rate_euros        text        not null check (rate_euros ~ '^\d+(\.\d{1,6})?$'),
  amount_base_units text        not null check (amount_base_units ~ '^[0-9]+$'),
  created_at        timestamptz not null default now()
);

create unique index if not exists xp_mints_user_total_before
  on public.xp_mints (user_id, xp_total_before);

alter table public.xp_mints enable row level security;
-- No policies: service role only, like reward_recipients and activity_minutes.

comment on table public.xp_mints is
  'Append-only. Each row turns XP into EURC base units at the rate in force when it was minted.';
