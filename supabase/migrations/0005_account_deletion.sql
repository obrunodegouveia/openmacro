-- ============================================================================
-- OpenMacro — deleting an account without erasing that money moved
-- ============================================================================
--
-- Apple guideline 5.1.1(v) and Google Play both require an app that creates
-- accounts to let someone delete theirs from inside the app. Everything the
-- learner owns already cascades from `auth.users`, so deleting the auth user
-- removes their profile, their lesson progress and their game sessions.
--
-- Reward claims should not follow, and this migration stops them.
--
-- A claim is a record that euros left a treasury and arrived at an address. It
-- is a financial record, and financial records are the ordinary exception to
-- erasure — you keep them, you do not keep them attached to a person. So
-- `user_id` becomes nullable and is set to null on deletion: the payout, the
-- amount, the address and the transaction hash survive as an anonymous row,
-- and nothing in it points at anybody.
--
-- ---------------------------------------------------------------------------
-- WHAT THIS DELIBERATELY DOES NOT SOLVE
-- ---------------------------------------------------------------------------
--
-- A learner who deletes their account and signs up again with the same email
-- has no claim rows, so they can claim every module a second time. Each cycle
-- is worth the full per-person cap.
--
-- Closing it properly means keeping a hash of the deleted email specifically
-- in order to recognise that person later, which is retaining an identifier
-- for the purpose of frustrating someone who asked to be forgotten. For a
-- household with two learners and a sixteen-euro ceiling, the trade is not
-- worth making. If this ever pays strangers, the answer is not a hash — it is
-- that claims should not be tied to an account you can delete at will.

alter table public.reward_claims
  drop constraint if exists reward_claims_user_id_fkey;

alter table public.reward_claims
  alter column user_id drop not null;

alter table public.reward_claims
  add constraint reward_claims_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

comment on column public.reward_claims.user_id is
  'Null once the learner has deleted their account. The payout record survives, anonymised.';

-- The owner policy already reads `auth.uid() = user_id`, and null never equals
-- a uuid, so an anonymised row is readable by nobody through the anon key.
-- Stated rather than assumed, because it is the line that keeps a deleted
-- learner''s payout out of the next learner''s dashboard.
