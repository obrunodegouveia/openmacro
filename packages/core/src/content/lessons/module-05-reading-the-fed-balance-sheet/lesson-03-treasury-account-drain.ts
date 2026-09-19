import { defineLesson } from '../../schema';

/**
 * The Treasury General Account is the line that moves the most and gets
 * explained the least. On 2 September 2026 it stood at $944 billion — a
 * quarter of the size of the entire reserve balance line, sitting on the same
 * side of the same sheet and competing for the same room.
 */
export const treasuryAccountDrainLesson = defineLesson({
  id: 'treasury-account-drain',
  title: 'The Government Has a Bank Account',
  subtitle:
    'The Treasury banks at the Fed, and every dollar it collects is a dollar of reserves the banking system loses.',
  icon: '🏛️',
  difficulty: 'core',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-where-taxes-go',
      type: 'multiple_choice',
      tags: ['tga', 'treasury'],
      xp: 10,
      prompt:
        'You pay a $10,000 tax bill from your bank account. Where does the money end up?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'treasury-vault',
          label: 'In a Treasury vault, as cash',
          feedback:
            'The federal government holds almost no physical cash. Its balance is a deposit, and its bank is the Fed.',
        },
        {
          id: 'tga',
          label: "In the Treasury's account at the Fed, and out of the banking system",
        },
        {
          id: 'destroyed',
          label: 'It is destroyed — taxes delete money',
          feedback:
            'Tempting, and half right: the deposit does vanish from your bank. But the funds land in the Treasury General Account, which is a real balance the Treasury spends from. Nothing was destroyed; it moved up a tier.',
        },
        {
          id: 'commercial-bank',
          label: "In a commercial bank account belonging to the government",
        },
      ],
      correctOptionId: 'tga',
      explanation:
        "Your deposit disappears from your bank, your bank's reserves fall by the same amount, and the Treasury General Account at the Fed rises by it. The money did not leave the economy — it left the *banking system*, which is not the same thing.",
    },

    {
      id: 'flow-bill-settlement',
      type: 'order_flow',
      tags: ['tga', 'treasury', 'reserves'],
      xp: 20,
      prompt:
        'The Treasury auctions $100 billion of bills. Put the settlement in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'auction',
          label: 'The Treasury auctions bills and investors bid',
          detail: 'Primary dealers and funds submit bids; the Treasury allots',
        },
        {
          id: 'debit',
          label: "Investors' bank deposits are debited on settlement day",
          detail: 'Broad money falls: those deposits simply cease to exist',
        },
        {
          id: 'reserves',
          label: 'The banks settle by transferring reserves to the Fed',
          detail: 'Base money leaves the banking system',
        },
        {
          id: 'tga-up',
          label: 'The Treasury General Account rises by $100 billion',
          detail: 'The same reserves, now sitting on a different liability line',
        },
        {
          id: 'spend',
          label: 'The Treasury spends, and the reserves come back',
          detail: 'Contractors and pensioners are paid; deposits reappear',
        },
      ],
      correctOrder: ['auction', 'debit', 'reserves', 'tga-up', 'spend'],
      explanation:
        'The drain is temporary by construction — the Treasury borrows to spend, and spending puts every dollar back. What matters for markets is the gap in between. When the account is being rebuilt quickly, as after a debt ceiling is resolved, hundreds of billions of reserves can leave the system in weeks.',
    },

    {
      id: 'tga-posting',
      type: 't_account_flow',
      tags: ['tga', 'reserves', 'balance-sheet'],
      xp: 30,
      prompt:
        'Post the $100 billion bill settlement across all three balance sheets.',
      instructions:
        'Nothing is created here. Watch which sheet loses what the others gain.',
      scenario:
        'Investors pay for $100B of newly issued Treasury bills out of their bank deposits. Their bank settles with the Fed in reserves.',
      currency: 'USD',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Banker to the banks and to the government',
          openingLines: [
            { account: 'U.S. Treasury securities', side: 'asset', amount: 4552347000000 },
            { account: 'Reserve balances', side: 'liability', amount: 2929285000000 },
            { account: 'U.S. Treasury, General Account', side: 'liability', amount: 944364000000 },
          ],
        },
        {
          id: 'bank',
          label: "The Investors' Bank",
          tier: 'commercial_bank',
          role: 'Holds their deposits and their reserves',
          openingLines: [
            { account: 'Reserve deposits at the Fed', side: 'asset', amount: 300000000000 },
            { account: 'Customer deposits', side: 'liability', amount: 900000000000 },
          ],
        },
        {
          id: 'treasury',
          label: 'U.S. Treasury',
          tier: 'fiduciary_core',
          role: 'Issuer of the debt, holder of the account',
          openingLines: [
            { account: 'Cash at the Fed', side: 'asset', amount: 944364000000 },
            { account: 'Debt outstanding', side: 'liability', amount: 37000000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'fed-tga-up',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'U.S. Treasury, General Account',
            delta: 100000000000,
          },
        },
        {
          id: 'fed-reserves-down',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'Reserve balances',
            delta: -100000000000,
          },
        },
        {
          id: 'bank-reserves-down',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Reserve deposits at the Fed',
            delta: -100000000000,
          },
        },
        {
          id: 'bank-deposits-down',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: -100000000000,
          },
        },
        {
          id: 'treasury-cash-up',
          shift: {
            entityId: 'treasury',
            side: 'asset',
            account: 'Cash at the Fed',
            delta: 100000000000,
          },
        },
        {
          id: 'treasury-debt-up',
          shift: {
            entityId: 'treasury',
            side: 'liability',
            account: 'Debt outstanding',
            delta: 100000000000,
          },
        },
        {
          id: 'fed-buys',
          shift: {
            entityId: 'fed',
            side: 'asset',
            account: 'U.S. Treasury securities',
            delta: 100000000000,
          },
          feedback:
            'The Fed did not buy these bills — private investors did. If the Fed had bought them, reserves would have risen rather than fallen, which is the whole difference between debt issuance and quantitative easing.',
        },
        {
          id: 'bank-holds-bills',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Treasury bills held',
            delta: 100000000000,
          },
          feedback:
            'The bank processed the payment; it did not buy the bills. Its customers did, and the bills sit in their portfolios, not on the bank’s sheet.',
        },
        {
          id: 'fed-notes-up',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'Federal Reserve notes',
            delta: 100000000000,
          },
          feedback:
            'Nobody asked for cash. Notes only rise when someone withdraws physical currency, and settlement happens entirely in book entries.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'fed',
          side: 'liability',
          account: 'U.S. Treasury, General Account',
          delta: 100000000000,
        },
        {
          entityId: 'fed',
          side: 'liability',
          account: 'Reserve balances',
          delta: -100000000000,
        },
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Reserve deposits at the Fed',
          delta: -100000000000,
        },
        {
          entityId: 'bank',
          side: 'liability',
          account: 'Customer deposits',
          delta: -100000000000,
        },
        {
          entityId: 'treasury',
          side: 'asset',
          account: 'Cash at the Fed',
          delta: 100000000000,
        },
        {
          entityId: 'treasury',
          side: 'liability',
          account: 'Debt outstanding',
          delta: 100000000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'contract',
          note: 'Reserves fell $100B. The Treasury’s balance is not base money — the government is not a bank.',
        },
        {
          aggregate: 'M2',
          direction: 'contract',
          note: 'Deposits fell $100B too. Broad money shrinks the moment the public lends to the government.',
        },
        {
          aggregate: 'collateral',
          direction: 'expand',
          note: '$100B of new bills now exists to be pledged in repo — the safe asset supply grew as the money supply shrank.',
        },
      ],
      explanation:
        'The Fed’s total assets did not move by a cent. All that happened on its sheet is that $100B slid from one liability line to another. That is the mechanism to carry away: with the asset side fixed, the Treasury’s cash balance and the banking system’s reserves are in direct competition, and the Fed is not the one deciding the split.',
    },

    {
      id: 'mc-debt-ceiling',
      type: 'multiple_choice',
      tags: ['tga', 'reserves', 'liquidity'],
      xp: 15,
      prompt:
        'A debt ceiling standoff ends and the Treasury rebuilds its account from $100B back to $900B in two months. What happens to bank reserves, all else equal?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unchanged',
          label: 'Unchanged — the Treasury account and reserves are unrelated',
          feedback:
            'They sit on the same side of the same balance sheet. If the asset side has not moved, one can only grow at the other’s expense.',
        },
        {
          id: 'fall-800',
          label: 'They fall by roughly $800 billion',
        },
        {
          id: 'rise-800',
          label: 'They rise by roughly $800 billion',
          feedback:
            'That is the direction of Treasury *spending*. Rebuilding the account is the opposite: the Treasury is collecting cash, not paying it out.',
        },
        {
          id: 'fed-prints',
          label: 'Nothing, because the Fed creates whatever reserves are needed',
          feedback:
            'The Fed can do that, and sometimes does. But it is a decision someone has to take, not an automatic backstop — and in 2019 the reserve drain got ahead of it, which is exactly how the September repo spike happened.',
        },
      ],
      correctOptionId: 'fall-800',
      explanation:
        'This is not a hypothetical: it is what happened in mid-2023, and it is why the reserve drain was the most-watched number on Wall Street that summer. Every dollar the Treasury raises and does not immediately spend is a dollar of reserves parked where banks cannot use it.',
    },
  ],
  keyTakeaways: [
    'The Treasury banks at the Fed. Its balance — $944 billion on 2 September 2026 — is a Fed liability like reserves.',
    'Taxes and bill settlements move money out of the banking system without destroying it.',
    'With the asset side fixed, the Treasury account and bank reserves compete for the same room.',
    'A fast rebuild of the account is a reserve drain, and reserve drains are what break money markets.',
  ],
});
