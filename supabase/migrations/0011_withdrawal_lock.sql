-- ============================================================================
-- OpenMacro — hold an earnings balance until the learner passes a final exam
-- ============================================================================
--
-- A teacher can lock an 'earnings' recipient's withdrawals. The balance keeps
-- growing as before (XP, active time, exam bonuses); only withdrawing waits.
-- The lock lifts by itself the moment the learner hands in an assigned exam
-- marked final with a passing score: 70% or more right, the mark in
-- `examPassed` (packages/core/src/engine/assignedExam.ts).
--
-- Enforced on the server, in /api/earnings (web/src/lib/rewards/earnings.ts):
-- a locked recipient's withdraw is refused before a claim row is opened.
--
-- A final exam is one attempt, like every assigned exam. A learner who fails
-- it stays locked until the teacher assigns another final exam.
--
-- The score is still graded on the learner's device (0008), so the lock is as
-- strong as that: it keeps an honest learner on the course, and the paper's
-- fingerprint lets a teacher check a suspicious pass offline.

alter table public.reward_recipients
  add column if not exists locked_until_final_exam boolean not null default false;

comment on column public.reward_recipients.locked_until_final_exam is
  'Withdrawals wait until the claimant passes an assigned exam with is_final.';

alter table public.assigned_exams
  add column if not exists is_final boolean not null default false;

comment on column public.assigned_exams.is_final is
  'Passing this exam (70% or more) releases earnings locked until a final exam.';
