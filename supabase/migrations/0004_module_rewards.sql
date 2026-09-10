-- ============================================================================
-- OpenMacro — rewards for finishing a module
-- ============================================================================
--
-- Two changes, both narrowing what a request is allowed to decide.
--
-- 1. A claim is no longer tied to a game session. Finishing a module in the
--    course earns the reward, so the idempotency key becomes a generic
--    `claim_key` holding 'module:<module id>'. One claim per learner per
--    module, which also caps the whole scheme: with sixteen modules and a €1
--    reward, a person can ever earn sixteen euros.
--
-- 2. A recipient is bound to the account that may claim it. Before, the
--    browser said who to pay and the server checked the key was active. Now
--    the server derives the recipient from the signed-in account and the
--    request names nobody at all — so one family member cannot claim into
--    another's wallet, by accident or otherwise.

-- ---------------------------------------------------------------------------
-- reward_claims: a claim is about a module, not a game
-- ---------------------------------------------------------------------------
alter table public.reward_claims
  rename column game_session_id to claim_key;

alter index if exists reward_claims_session_unique
  rename to reward_claims_key_unique;

comment on column public.reward_claims.claim_key is
  'What was earned, once. ''module:<module id>'' for a finished module. Unique per learner.';

-- ---------------------------------------------------------------------------
-- reward_recipients: whose account claims into this wallet
-- ---------------------------------------------------------------------------
--
-- Null means nobody can claim into it through the normal path — the wallet
-- exists and an admin can still send a test, but no learner is bound to it.
alter table public.reward_recipients
  add column if not exists claimant_email text;

-- One account claims into at most one wallet. Without this a single learner
-- could be bound to two active recipients and the resolution would be
-- ambiguous, which for a payout is not a tie to break at runtime.
create unique index if not exists reward_recipients_claimant_unique
  on public.reward_recipients (lower(claimant_email))
  where claimant_email is not null and status = 'active';

comment on column public.reward_recipients.claimant_email is
  'The signed-in account allowed to claim into this wallet. The request never names a recipient.';
