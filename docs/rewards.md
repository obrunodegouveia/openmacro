# Game rewards — paying EURC on Base

Finishing a module in the course pays the learner €1 in Circle's EURC on Base,
straight to their Coinbase account. This is the setup, the design, and the
parts that can lose money if you get them wrong.

The whole scheme is capped by construction: one claim per learner per module,
so a person can ever earn `number of modules × the reward`. At thirty-three
modules and €1 that is thirty-three euros, and no bug or cheat raises it. The
ceiling grows by one reward with every module published, so check it again
when the course grows.

---

## What the pieces are

| File | Role |
|---|---|
| `supabase/migrations/0002_reward_claims.sql` | `game_sessions` and `reward_claims`, plus the compare-and-set that makes double payment impossible |
| `web/src/lib/blockchain/payout.ts` | The only module holding the key or broadcasting. `server-only` |
| `web/src/lib/supabase-admin.ts` | Service-role client and bearer-token authentication. `server-only` |
| `supabase/migrations/0003_reward_recipients.sql` | Managed recipients and the admin audit trail |
| `supabase/migrations/0004_module_rewards.sql` | Claims keyed on modules; recipients bound to an account |
| `web/src/lib/rewards/modules.ts` | Whether a module is genuinely finished. `server-only` |
| `web/src/components/app/module-rewards.tsx` | The claim list on `/dashboard` |
| `web/src/lib/rewards/recipients.ts` | Turns a key into an address, only for `active` rows. `server-only` |
| `web/src/lib/rewards/admin.ts` | Who may administer the treasury, and the audit log. `server-only` |
| `web/src/app/api/claim-reward/route.ts` | Authenticates, verifies, claims, pays, records |
| `web/src/app/api/admin/rewards/route.ts` | Everything the dashboard reads and does |
| `web/src/components/app/treasury.tsx` | The dashboard at `/dashboard/treasury` |
| `supabase/migrations/0006_earnings.sql` | The `earnings` scheme, `activity_minutes`, and the `VOID` claim status |
| `web/src/lib/rewards/earnings.ts` | The balance: capped XP, active minutes, withdrawals. `server-only` |
| `web/src/lib/rewards/pay-claim.ts` | Lock, send, record — shared by module claims and withdrawals. `server-only` |
| `web/src/app/api/earnings/route.ts` | Balance, heartbeat, the learner's own address, withdraw |
| `web/src/components/app/earnings.tsx` | The balance panel on `/dashboard` |
| `web/src/components/app/activity-heartbeat.tsx` | Pings while an earnings learner is active, on every page |

---

## Setup

### 1. Apply the migration

```bash
supabase db push
```

Then check **Authentication → Policies**:

- `reward_claims` — RLS enabled, exactly one policy, a `SELECT`. If it has an
  insert or update policy, stop: a browser that can write claim state can pay
  itself twice.
- `reward_recipients` and `reward_admin_events` — RLS enabled and **no policies
  at all**. That is what makes them unreadable and unwritable except through
  the service role.

### 2. Create the treasury wallet

Generate a key that has never been used for anything else:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Import it into any wallet to see the address, or read it from the app's own
preflight (below). Then fund it **on Base**, not Ethereum mainnet:

- **EURC** for the rewards — start with €20
- **ETH** for gas — €2 of ETH is thousands of Base transactions

### 3. Collect the deposit addresses

In each family member's Coinbase account: Receive → EURC → **set the network to
Base** → copy the address.

The same account shows a *different address per network*. EURC sent to their
Ethereum-mainnet address will not arrive and is not recoverable.

You do not configure these in the environment — they are added in the dashboard,
which walks the add / test / confirm / activate sequence described below.

### 4. Configure

Copy the reward block from `web/.env.example` into your environment. In
production these go in Secret Manager and are mounted into Cloud Run — not
typed into a file on a server.

Nothing in that block may ever be prefixed `NEXT_PUBLIC_`. That prefix inlines
a value into the browser bundle, which for the treasury key means publishing it.

### 5. Verify before playing

```ts
import { readTreasuryStatus } from "@/lib/blockchain/payout";
console.log(await readTreasuryStatus());
```

Confirms the key parses, the RPC answers, and both balances are what you think.

---

## The treasury dashboard

`/dashboard/treasury`, for anyone whose signed-in email is listed in
`REWARDS_ADMIN_EMAILS`. It shows the treasury balances and the address to top
up, manages who may be paid, and surfaces claims that need a human.

Admin identity is an environment variable, never a database column. A column is
one leaked service key or one careless migration away from promoting an
attacker, and none of that is visible in a code review. Changing an env var
needs a deploy, which for a treasury is the right bar.

The page itself is not gated — the shell renders for anyone and is empty. All
of the value comes from `/api/admin/rewards`, which checks the caller and
answers **404** to everyone else, so the endpoint's existence is not confirmed
to someone guessing. Gating the page instead would be the wrong way round: a
redirect still confirms the route, and a client-side check protects nothing.

### Adding someone who can be paid

The dashboard enforces the sequence you would follow by hand anyway:

1. **Add** the recipient with their Coinbase deposit address on Base, and the
   **email of the account that claims into it**. Without that email the wallet
   exists but nobody can earn into it. It lands as `pending`, which cannot
   receive a reward at all.
2. **Send a €1 test.** This is the only path that pays a pending address, and
   only an admin can trigger it.
3. **Confirm it arrived** in their Coinbase account.
4. **Activate.** Now the game can pay that key.

Adding an address and paying it are deliberately two separate actions. A
mistyped or malicious address has to survive a second look, and a €1 test, and
an explicit confirmation, before anything larger can reach it.

Every one of those steps is written to `reward_admin_events` with the email
that did it — the only way to answer "when did this address change, and who
changed it" after the fact.

## How a claim works

Nothing needs wiring into the course. A module is finished when every lesson in
it has a completion in `lesson_progress`, which the app already writes, and
`ModuleRewards` on `/dashboard` shows the state of every module.

The request names **one** thing — which module. It does not name a recipient,
an address, or an amount:

- **Who is paid** comes from `claimant_email` on an active recipient, matched
  against the signed-in account. One family member cannot claim into another's
  wallet, by accident or otherwise.
- **How much** comes from that recipient's row, or `REWARD_AMOUNT_DEFAULT`.
- **Where** comes from that row's address.

A signed-in account with no wallet bound to it sees no rewards UI at all. This
is a private arrangement inside a public course, and to everyone else it should
look like it does not exist.

### What the completion check cannot prove

`lesson_progress` is writable by the learner — deliberately, per migration
0001, because the honest-client model is right for XP where the worst a cheat
achieves is lying to themselves.

Money changes what that costs. Somebody using the anon key directly can insert
completions they did not earn and claim the reward. Fixing it properly means
grading server-side, which means moving the engine off the device and giving up
offline play.

What makes it acceptable is the cap rather than the check: one reward per
module per person, ever. If the reward ever grows past what you would hand
over on trust, this is the assumption to revisit first.

---

## Earnings: paying by XP and active time

A recipient is on one of two schemes, chosen when it is added in the treasury
dashboard:

- **`module`**, the original: a fixed amount for each finished module, paid to
  an address only an admin can set.
- **`earnings`**: a running balance the learner withdraws when they like.
  Defaults are **€0.002 per XP** and **€0.20 per active hour**, overridable per
  recipient in `xp_rate_euros` and `hour_rate_euros`.

The two never overlap. An earnings recipient cannot claim module rewards, and
a module recipient cannot use the earnings endpoint, so nobody is paid twice
for the same work.

### How the balance is computed

Nothing is stored. Every read recomputes:

- **XP** is the sum of `best_xp` per lesson, each capped at the most that
  lesson can award according to the content registry. A forged row of a
  million XP counts for the lesson's real maximum. The whole course is worth
  21,470 XP today, which is €42.94 at the default rate.
- **Time** is the number of rows in `activity_minutes`. The browser pings every
  thirty seconds while the tab is visible and the learner has interacted in the
  last two minutes; the server stamps the minute from its own clock, so nothing
  can be backfilled and a day holds at most 24 hours. Only enrolled learners
  ever ping — nobody else's time is recorded.
- **Withdrawn** is every withdrawal claim that is in flight, paid, or `FAILED`.
  A `FAILED` withdrawal may still have been mined, so it keeps counting. If
  BaseScan shows its `broadcast_nonce` never did anything, set the row to
  `VOID` by hand and the amount returns to the balance. The same applies to a
  withdrawal left `UNCLAIMED` by a process that died before taking the lock.

### Withdrawals

A withdrawal sends the whole balance, rounded down to the cent, with a €1.00
minimum. It is a `reward_claims` row with `claim_key = 'withdrawal:<n>'`.
Two concurrent withdrawals read the same count, try to insert the same `<n>`,
and the unique index lets one in. After that it goes through the same
lock → send → record path as module claims (`pay-claim.ts`).

One difference from module claims: a withdrawal that fails *before*
broadcasting becomes **`VOID`** rather than `UNCLAIMED`. Its amount was the
balance at one moment, so a retry must recompute it. `VOID` stops counting as
withdrawn.

### The learner sets their own address

This is the deliberate exception to "only an admin decides where money goes".
For an earnings recipient, the address the learner enters on their dashboard
takes effect **immediately**, with no pending state and no test send. That was
the treasury owner's call, and the cost is real: anyone who gets into that
learner's account can redirect the balance. What bounds it is the balance
itself. Every change is written to `reward_admin_events` as
`recipient.address-set-by-claimant`, with the old and new address.

The row is always found from the signed-in email, never from an id in the
request, and only an active earnings row matches.

### Setting someone up

In `/dashboard/treasury`, add the recipient with their **claimant email**, tick
**Pay by XP and active time**, and leave the address empty. Activate it — there
is no address to test yet. The learner then sees the panel on `/dashboard`,
enters their EURC address on Base, and can withdraw once they reach €1.

This exists on the website only. Real-money rewards inside the iOS app run into
App Store guideline 3.1.5(iii), and adding them by OTA update would sidestep
review. Time in the iPhone app is not counted; XP earned there is, because it
syncs to `lesson_progress`.

---

## How double payment is prevented

Three mechanisms, and all three are needed:

1. **A unique index** on `(user_id, game_session_id)`. Two requests racing for
   the same session: one inserts, the other gets a constraint violation and is
   handed the existing claim. Uniqueness is a database guarantee, not an
   application intention.

2. **A compare-and-set** — `begin_reward_claim()` moves a row to
   `CLAIM_PENDING` only if it is currently `UNCLAIMED`, and returns nothing if
   it is not. Postgres locks the row for the update, so of two callers exactly
   one proceeds. Reading a status in application code and then writing it is
   the time-of-check-to-time-of-use bug, and here it pays twice.

   The caller must check the returned row's **id**, not whether something came
   back. The function returns a single composite, so a caller that lost gets a
   row of nulls — `{ id: null, … }` through PostgREST — which is truthy. An
   earlier `Boolean(result)` check let both callers of a double tap pay.

3. **Service-role writes only.** RLS gives the learner `SELECT` and nothing
   else, so claim state cannot be edited from a browser at all.

The chain is touched only after all three have been satisfied.

---

## When something goes wrong

**A claim stuck in `CLAIM_PENDING`.** The process died between broadcasting and
recording. `broadcast_nonce` is written *before* the send precisely for this:
look up that nonce on the treasury address in BaseScan. If a transaction
exists, the money moved — set the row to `PAID` with its hash. If none exists,
it did not — set it to `UNCLAIMED`.

**Never resolve this by retrying the payment.** A pending transaction can still
be mined minutes later, and a retry alongside it pays twice.

**`PAID BUT NOT RECORDED` in the logs.** The transfer succeeded and the
database write failed. The hash is in the log line. Update the row by hand.

**`INSUFFICIENT_EURC` / `INSUFFICIENT_GAS`.** Exactly what they say; the error
carries the address to top up. Both are marked retryable, so the claim returns
to `UNCLAIMED` and the player can try again once you have funded the wallet.

---

## What this design accepts

**It is a hot wallet.** A key in server memory that moves money without a human
is a standing risk, and no amount of code removes it. What bounds the damage is
the balance, so keep it small and top it up deliberately. The blast radius of a
compromised server is exactly what is in the drawer.

**A deleted account can claim again.** Deletion nulls `user_id` on
`reward_claims` rather than removing the row, so the payout record survives
anonymised — but a learner who deletes and signs up again with the same email
has no claims and can earn every module a second time. Closing that means
keeping a hash of the deleted email precisely to recognise someone who asked to
be forgotten, which is not a trade worth making for a handful of known
learners with a ceiling of a few tens of euros. If this ever pays strangers,
the fix is not a hash: it is that claims should not hang off an account you
can delete at will.

**Nonce serialisation is per-instance.** `payout.ts` queues sends within one
process. Cloud Run running two containers has two queues and could collide on a
nonce, which shows up as a dropped or replaced transaction — never as a double
payment, because the database prevents that regardless. If payouts ever become
frequent, allocate nonces from Postgres instead.

**Confirmation is the client's job.** The API returns when the network accepts
the transaction, not when it is mined, so a slow block cannot fail a claim. The
card links to BaseScan; `waitForPayout()` exists if you would rather block.

**Recipients are managed, not fixed.** 0002 read addresses from environment
variables, which was safer: changing where money goes required a deploy. That
was relaxed so the dashboard could manage them, and the cost is real — a row in
`reward_recipients` decides where money goes, so write access to that table is
write access to the treasury.

What replaces the deploy gate: RLS grants anon and authenticated nothing, so
the only path in is an admin route; admin identity comes from the environment,
so no row can promote anyone; and a new address is unpayable until explicitly
activated. If you would rather have the deploy gate back, delete the
`add-recipient` and `set-status` actions and seed the table by migration —
everything else keeps working.

**The claim API still never accepts an address.** It takes a key and resolves
it against an active row. An endpoint that accepts an address is an endpoint
that pays whoever asks, and no amount of validation makes that safe in a system
holding its own key.
