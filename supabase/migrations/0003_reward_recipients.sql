-- ============================================================================
-- OpenMacro — managed reward recipients and an audit trail
-- ============================================================================
--
-- 0002 resolved payout addresses from environment variables. That is the safer
-- arrangement and it is being deliberately relaxed: addresses now live here so
-- they can be managed from the treasury dashboard without a deploy.
--
-- What that costs, stated plainly: a row in this table decides where money
-- goes, so write access to it is equivalent to write access to the treasury.
-- Three things hold the line instead of the deploy pipeline:
--
--   1. No policy grants anon or authenticated anything. Every read and write
--      goes through the service role, from an admin route.
--   2. Who counts as an admin is read from REWARDS_ADMIN_EMAILS in the server
--      environment, never from a column here. A row cannot promote anyone.
--   3. A new or edited address lands as 'pending' and cannot be paid. Making
--      it payable is a separate, deliberate action, recorded below.
--
-- The intended flow mirrors what you would do by hand anyway: add the address,
-- send a €1 test, confirm it arrived in the Coinbase account, then activate.

-- ---------------------------------------------------------------------------
-- reward_recipients: who may be paid
-- ---------------------------------------------------------------------------
create table if not exists public.reward_recipients (
  id           uuid        primary key default gen_random_uuid(),

  -- The stable slug the game asks for, e.g. 'daughter'. Kept separate from the
  -- label so the address behind a key can change without touching game code.
  key          text        not null unique
                 check (key ~ '^[a-z][a-z0-9_-]{1,30}$'),
  label        text        not null,

  -- Checksummed 0x address on Base. Stored lowercase for comparison; the
  -- application checksums it on read.
  address      text        not null check (address ~ '^0x[0-9a-f]{40}$'),

  -- 'pending'  — configured but NOT payable. New addresses start here.
  -- 'active'   — payable.
  -- 'disabled' — retained for history, not payable.
  status       text        not null default 'pending'
                 check (status in ('pending', 'active', 'disabled')),

  -- Per-recipient reward, in euros, as a string. Null falls back to the
  -- default in the environment. A float here would be a rounding bug.
  amount_euros text        check (amount_euros ~ '^\d+(\.\d{1,6})?$'),

  note         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  activated_at timestamptz
);

-- Two active recipients must never share a key: that is what makes a key
-- resolve to exactly one address.
create unique index if not exists reward_recipients_active_key
  on public.reward_recipients (key)
  where status = 'active';

alter table public.reward_recipients enable row level security;
-- Intentionally no policies. RLS with no permissive policy denies everything,
-- so the anon and authenticated roles cannot read an address, let alone write
-- one. The service role bypasses RLS and is the only path in.

-- ---------------------------------------------------------------------------
-- reward_admin_events: what was done, by whom
-- ---------------------------------------------------------------------------
--
-- An append-only record of every change that could move money somewhere new.
-- Small, cheap, and the only way to answer "when did this address change and
-- who changed it" after the fact.
create table if not exists public.reward_admin_events (
  id           uuid        primary key default gen_random_uuid(),
  actor_email  text        not null,
  action       text        not null,
  -- Free-form context: the recipient, the old and new address, the tx hash.
  detail       jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists reward_admin_events_recent_idx
  on public.reward_admin_events (created_at desc);

alter table public.reward_admin_events enable row level security;
-- Same reasoning: no policies, service role only.

-- ---------------------------------------------------------------------------
-- reward_claims: recipients are no longer a fixed pair
-- ---------------------------------------------------------------------------
--
-- 0002 constrained recipient_key to ('wife', 'daughter') because the set was
-- closed by configuration. It is now open, so the check becomes a shape rule
-- rather than a membership one. Which keys are payable is decided by
-- reward_recipients, not by this constraint.
alter table public.reward_claims
  drop constraint if exists reward_claims_recipient_key_check;

alter table public.reward_claims
  add constraint reward_claims_recipient_key_check
  check (recipient_key ~ '^[a-z][a-z0-9_-]{1,30}$');

-- The address actually paid, captured at payout time. reward_recipients holds
-- the current address; this holds the one that was used, so history stays true
-- after an address is changed or disabled.
alter table public.reward_claims
  add column if not exists paid_to_address text;
