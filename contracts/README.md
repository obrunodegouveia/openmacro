# OpenMacroRewards

The escrow behind teacher rewards: a teacher deposits EURC on Base, and their
students are paid from it for the XP and active time they earn on OpenMacro.

OpenMacro never holds a key that can move a teacher's money. The server only
**signs statements** of what each student has earned. The contract pays from
that teacher's deposit, up to limits the teacher sets on-chain.

## How money moves

```
teacher wallet ──deposit──▶ OpenMacroRewards ──claim(statement)──▶ student's address
       ▲                          │
       └──── executeWithdrawal ◀──┘  (7 days after requestWithdrawal)
```

1. **Deposit.** The teacher approves EURC and calls `deposit`. The deposit is
   theirs. Nobody else can withdraw it.
2. **Daily cap.** `setDailyCap` limits how much all of that teacher's students
   can claim in total per UTC day. It starts at zero, so nothing can be claimed
   until the teacher chooses a cap.
3. **Statement.** When a student withdraws, the web server signs an EIP-712
   `Statement(teacher, student, recipient, cumulative, deadline)`:
   - `student` is a hash of the learner's account id. A new payout address
     doesn't reset what was already paid.
   - `cumulative` is the running total ever owed. A statement can be replayed
     safely: the contract pays only `cumulative − claimed`.
4. **Claim.** Anyone can submit the statement. OpenMacro relays it and pays the
   gas, because a Coinbase deposit address can't send transactions. The money
   can only go to the `recipient` that was signed.

## Who is protected from whom

| Risk | What stops it |
|---|---|
| OpenMacro takes a teacher's money | It can't. The owner's only power is `setSigner`. |
| The signing key leaks | Each teacher's daily cap bounds the loss per day. The owner rotates the signer. `setSigner(address(0))` stops every claim, and teachers can still withdraw. |
| A teacher pulls money a student already earned | `requestWithdrawal` and *lowering* the cap both wait `WITHDRAWAL_DELAY` (7 days). Students can keep claiming during that time. |
| One teacher's students drain another teacher | Statements name the teacher, the signature covers it, and claims are paid only from that teacher's balance. |
| A statement is reused on another chain or contract | The EIP-712 domain includes the chain id and the contract address. |
| The same euro is paid twice | `claimed[teacher][student]` only goes up, and a claim pays only the difference. |

**What the contract cannot know.** It trusts the signer about *how much* a
student earned. Whether XP and active time were real is the web server's job:
it caps XP per lesson and stamps active minutes from its own clock. The daily
cap is the on-chain backstop if that judgement, or the key, fails.

## Develop

Requires [Foundry](https://getfoundry.sh) (`brew install foundry`).

```bash
cd contracts
git submodule update --init --recursive   # forge-std, OpenZeppelin v5.4.0
forge test                                # unit, fuzz and invariant tests
forge fmt --check
```

The invariant suite runs random deposits, caps, claims, withdrawals and time
jumps by three teachers, and checks that:

- the contract always holds exactly the sum of teacher balances;
- every euro that came in is either still held, claimed or withdrawn;
- no teacher ever pays out more than they deposited.

## Deploy

```bash
export REWARDS_SIGNER=0x…   # address of the web server's signing key
export REWARDS_OWNER=0x…    # who may rotate it — a multisig on mainnet
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast \
  --private-key "$DEPLOYER_PRIVATE_KEY"
```

The EURC address is chosen from the chain id. Base Sepolia uses
`0x808456652fdb597867f38412077A9182bf77359F` and Base uses
`0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42`. To use another token, set
`EURC_ADDRESS`.

**Before mainnet:** have the contract reviewed by someone outside the project,
make the owner a multisig, and get legal advice on whether signing statements
keeps OpenMacro outside MiCA custody.
