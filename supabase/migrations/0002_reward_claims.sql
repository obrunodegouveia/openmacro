-- ============================================================================
-- OpenMacro — game reward claims (EURC payouts on Base)
-- ============================================================================
--
-- Apply with `supabase db push`, or paste into the SQL editor. See
-- docs/rewards.md for the full setup.
--
-- ---------------------------------------------------------------------------
-- THIS TABLE BREAKS THE RULE STATED IN 0001
-- ---------------------------------------------------------------------------
--
-- 0001 says: "There is deliberately no service-role path in the app: the anon
-- key plus these policies is the entire security model, which keeps the client
-- honest." That is the right model for progress, where the worst a dishonest
-- client can do is lie about its own XP.
--
-- It is the wrong model for money. If the browser can write claim state, it can
-- set a paid claim back to unclaimed and be paid again. So this table is
-- server-authoritative: the learner may SELECT their own claims and nothing
-- else. Every write goes through the service role, from the API route, which
-- is the only place the payout can be authorised.
--
-- The service-role key therefore enters the codebase for the first time. It
-- must never be prefixed NEXT_PUBLIC_, never be imported into a client
-- component, and on Cloud Run it belongs in Secret Manager rather than a
-- plain environment variable.

-- ---------------------------------------------------------------------------
-- game_sessions: what a claim is evidence of
-- ---------------------------------------------------------------------------
--
-- A reward has to be *for* something the server can verify. The game writes a
-- row when a play begins and marks it finished when it ends; the claim route
-- refuses to pay for a session that is missing, unfinished, or someone else's.
--
-- Unlike reward_claims, a learner may write here: the stakes are a game score,
-- and the honest-client model from 0001 is proportionate. What money depends
-- on is not the score but `finished_at` being set on a row the learner owns,
-- and a learner faking that can only ever claim their own single reward.
create table if not exists public.game_sessions (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users (id) on delete cascade,
  game_id      text        not null,
  score        integer     not null default 0 check (score >= 0),
  started_at   timestamptz not null default now(),
  finished_at  timestamptz
);

create index if not exists game_sessions_user_idx
  on public.game_sessions (user_id, finished_at desc);

alter table public.game_sessions enable row level security;

drop policy if exists "game sessions are private to their player" on public.game_sessions;
create policy "game sessions are private to their player"
  on public.game_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- reward_claims: one row per (learner, game session)
-- ---------------------------------------------------------------------------
create table if not exists public.reward_claims (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users (id) on delete cascade,

  -- The idempotency key. One payout per session, enforced by the unique index
  -- below rather than by application logic, so two concurrent requests cannot
  -- both decide they are the first.
  game_session_id  text        not null,

  -- Which family member this pays. A key, never an address: the address is
  -- resolved server-side from configuration, so a compromised or malicious
  -- client cannot redirect funds. This is the single most important column.
  recipient_key    text        not null check (recipient_key in ('wife', 'daughter')),

  -- Base units, not euros. EURC has 6 decimals, so €10.00 is '10000000'.
  -- Text rather than numeric because it is a uint256 to the chain and a
  -- float here would be a rounding bug waiting to happen.
  amount_base_units text       not null check (amount_base_units ~ '^[1-9][0-9]*$'),

  status           text        not null default 'UNCLAIMED'
                     check (status in ('UNCLAIMED', 'CLAIM_PENDING', 'PAID', 'FAILED')),

  -- Recorded before the transaction is broadcast, so a claim stuck in
  -- CLAIM_PENDING can be reconciled against the chain by nonce rather than
  -- guessed at. Never retry a payment without checking this first.
  broadcast_nonce  bigint,
  tx_hash          text,
  failure_reason   text,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- The idempotency guarantee. Two requests racing for the same session: one
-- inserts, the other violates this and is told the claim already exists.
create unique index if not exists reward_claims_session_unique
  on public.reward_claims (user_id, game_session_id);

create index if not exists reward_claims_status_idx
  on public.reward_claims (status)
  where status in ('CLAIM_PENDING', 'FAILED');

alter table public.reward_claims enable row level security;

-- Read-only to the learner. There is no insert, update or delete policy, and
-- that is deliberate: with RLS enabled and no permissive policy, every write
-- from the anon key is refused. The service role bypasses RLS entirely, so the
-- API route is the only writer.
drop policy if exists "learners can read their own claims" on public.reward_claims;
create policy "learners can read their own claims"
  on public.reward_claims
  for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Atomic transition to CLAIM_PENDING
-- ---------------------------------------------------------------------------
--
-- The compare-and-set that makes double payment impossible. Postgres takes a
-- row lock for the UPDATE, so of two concurrent callers exactly one sees a row
-- returned; the loser gets zero rows and must not proceed to the chain.
--
-- Doing this in application code — read status, check it, write it — is the
-- classic time-of-check-to-time-of-use bug, and with money attached it pays
-- twice.
create or replace function public.begin_reward_claim(p_claim_id uuid)
returns public.reward_claims
language sql
security definer
set search_path = public
as $$
  update public.reward_claims
     set status = 'CLAIM_PENDING',
         updated_at = now()
   where id = p_claim_id
     and status = 'UNCLAIMED'
  returning *;
$$;

revoke all on function public.begin_reward_claim(uuid) from public, anon, authenticated;
