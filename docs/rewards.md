# Game rewards — paying EURC on Base

A finished game pays a fixed family member in Circle's EURC on Base, straight
to their Coinbase account. This is the setup, the design, and the parts that
can lose money if you get them wrong.

---

## What the pieces are

| File | Role |
|---|---|
| `supabase/migrations/0002_reward_claims.sql` | `game_sessions` and `reward_claims`, plus the compare-and-set that makes double payment impossible |
| `web/src/lib/blockchain/payout.ts` | The only module holding the key or broadcasting. `server-only` |
| `web/src/lib/supabase-admin.ts` | Service-role client and bearer-token authentication. `server-only` |
| `web/src/app/api/claim-reward/route.ts` | Authenticates, verifies, claims, pays, records |
| `web/src/components/game/claim-reward.tsx` | The card the player sees |

---

## Setup

### 1. Apply the migration

```bash
supabase db push
```

Then check **Authentication → Policies**. `reward_claims` must show RLS enabled
with exactly one policy, a `SELECT`. If it has an insert or update policy, stop:
a browser that can write claim state can pay itself twice.

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
Ethereum-mainnet address will not arrive and is not recoverable. **Send €1 to
each address and confirm it lands before configuring it here.**

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

## Wiring it into a game

The game owns the session; the reward system only reads it.

```ts
// When play begins
const { data: session } = await supabase
  .from("game_sessions")
  .insert({ user_id: user.id, game_id: "money-machine" })
  .select("id")
  .single();

// When the player finishes
await supabase
  .from("game_sessions")
  .update({ finished_at: new Date().toISOString(), score })
  .eq("id", session.id);
```

Then render the card:

```tsx
<ClaimReward gameSessionId={session.id} recipient="daughter" recipientName="Sofia" />
```

The component names a session and a family member. It never names an address or
an amount — both are resolved server-side, so a tampered client cannot redirect
a payout or inflate one.

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

**Nonce serialisation is per-instance.** `payout.ts` queues sends within one
process. Cloud Run running two containers has two queues and could collide on a
nonce, which shows up as a dropped or replaced transaction — never as a double
payment, because the database prevents that regardless. If payouts ever become
frequent, allocate nonces from Postgres instead.

**Confirmation is the client's job.** The API returns when the network accepts
the transaction, not when it is mined, so a slow block cannot fail a claim. The
card links to BaseScan; `waitForPayout()` exists if you would rather block.

**The recipients are fixed.** By design. An endpoint that accepts an address is
an endpoint that pays whoever asks, and no amount of validation makes that safe
in a system holding its own key.
