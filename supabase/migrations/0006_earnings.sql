-- ============================================================================
-- OpenMacro — earnings: paying by XP and by active time, withdrawn on demand
-- ============================================================================
--
-- A second way to reward a learner, alongside the per-module claims of 0004.
-- A recipient is on exactly one scheme:
--
--   'module'   — the original: a fixed amount for each finished module.
--   'earnings' — a running balance built from XP and active time, which the
--                learner withdraws whenever they like.
--
-- What changes, and what it costs
-- -------------------------------
--
-- 1. The learner may set their own payout address. Until now only an admin
--    could, behind a pending → test → activate sequence. For an 'earnings'
--    recipient the learner's address takes effect immediately. That was a
--    deliberate choice by the treasury owner, and the cost is plain: anyone
--    who gets into that learner's account can redirect the balance. What
--    bounds it is the balance itself, and every change is written to
--    reward_admin_events with the old and new address.
--
-- 2. Active time is recorded server-side, one row per minute. The client only
--    says "I am here"; the server stamps the minute from its own clock, so a
--    client cannot backfill hours it was not present for. A day can never
--    hold more than 1440 rows, which caps time earnings at 24 h a day.
--
-- 3. XP earnings are bounded by the content, not by the database: the server
--    counts each lesson's best_xp only up to the most that lesson can award.

-- ---------------------------------------------------------------------------
-- reward_recipients: scheme, rates, and an address that may be absent
-- ---------------------------------------------------------------------------
alter table public.reward_recipients
  add column if not exists scheme text not null default 'module'
    check (scheme in ('module', 'earnings'));

-- Euros, as strings, for the same reason as amount_euros: a float is a
-- rounding bug. Null falls back to the defaults in lib/rewards/earnings.ts.
alter table public.reward_recipients
  add column if not exists xp_rate_euros text
    check (xp_rate_euros ~ '^\d+(\.\d{1,6})?$');
alter table public.reward_recipients
  add column if not exists hour_rate_euros text
    check (hour_rate_euros ~ '^\d+(\.\d{1,6})?$');

-- An 'earnings' recipient starts with no address and sets one from their own
-- dashboard. A 'module' recipient still must have one: that path never lets
-- the learner choose.
alter table public.reward_recipients
  alter column address drop not null;

alter table public.reward_recipients
  drop constraint if exists reward_recipients_address_required;
alter table public.reward_recipients
  add constraint reward_recipients_address_required
  check (address is not null or scheme = 'earnings');

comment on column public.reward_recipients.scheme is
  '''module'' pays per finished module; ''earnings'' keeps a balance from XP and active time, withdrawn by the learner.';

-- ---------------------------------------------------------------------------
-- activity_minutes: one row per minute the learner was actively present
-- ---------------------------------------------------------------------------
--
-- Written only by the service role, from /api/earnings, and only for learners
-- bound to an 'earnings' recipient. Nobody else's time is recorded at all.
create table if not exists public.activity_minutes (
  user_id  uuid        not null references auth.users (id) on delete cascade,
  minute   timestamptz not null,
  primary key (user_id, minute)
);

alter table public.activity_minutes enable row level security;
-- No policies: service role only, like reward_recipients.

-- ---------------------------------------------------------------------------
-- reward_claims: withdrawals, and a terminal state for ones that never sent
-- ---------------------------------------------------------------------------
--
-- A withdrawal is a claim with claim_key 'withdrawal:<n>'. The existing unique
-- index on (user_id, claim_key) is what stops two concurrent withdrawals both
-- paying the same balance: both compute the same <n>, one insert wins.
--
-- A module claim that fails before broadcasting goes back to UNCLAIMED so it
-- can be retried. A withdrawal cannot, because its amount was the balance at
-- that moment; it becomes VOID instead, stops counting as withdrawn, and the
-- next withdrawal recomputes from scratch.
alter table public.reward_claims
  drop constraint if exists reward_claims_status_check;
alter table public.reward_claims
  add constraint reward_claims_status_check
  check (status in ('UNCLAIMED', 'CLAIM_PENDING', 'PAID', 'FAILED', 'VOID'));
