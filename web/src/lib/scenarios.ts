import type { TAccountScenario } from "@/lib/t-accounts";

/**
 * The playable teaser: $10B of quantitative easing, posted by hand.
 *
 * This mirrors `lesson-01-qe-primary-dealer.ts` in the app (Module 3, the Fed
 * & ECB levers). It is the first challenge a visitor meets, so it is the one
 * that has to earn the rest of the page: two sheets, four correct postings,
 * three distractors that each encode a specific misconception.
 *
 * Opening balances are illustrative and rounded for legibility.
 */
export const QE_SCENARIO: TAccountScenario = {
  id: "qe-primary-dealer",
  moduleLabel: "Module 3 · The Fed & ECB Levers · Challenge 2 of 5",
  title: "Quantitative Easing, Posted by Hand",
  prompt: "The Fed executes $10B of QE, buying Treasuries from a primary dealer.",
  instructions:
    "Pick an entry, then choose whose sheet it lands on and which side. Every sheet must balance.",
  scenario:
    "The dealer banks with a commercial bank, so the Fed's payment settles there. Four entries are needed — three of the seven do not belong.",
  xp: 25,
  entities: [
    {
      id: "fed",
      label: "Federal Reserve",
      tier: "central_bank",
      role: "Issuer of the monetary base",
      openingLines: [
        { account: "US Treasuries", side: "asset", amount: 5_200_000_000_000 },
        { account: "Commercial bank reserves", side: "liability", amount: 3_100_000_000_000 },
        { account: "Banknotes in circulation", side: "liability", amount: 2_100_000_000_000 },
      ],
    },
    {
      id: "dealer-bank",
      label: "Dealer's Commercial Bank",
      tier: "commercial_bank",
      role: "Holds the dealer's deposit",
      openingLines: [
        { account: "Reserve deposits at the Fed", side: "asset", amount: 80_000_000_000 },
        { account: "Customer deposits", side: "liability", amount: 640_000_000_000 },
      ],
    },
  ],
  chips: [
    { id: "treasuries", account: "US Treasuries", delta: 10_000_000_000 },
    {
      id: "reserves-fed",
      account: "Commercial bank reserves",
      delta: 10_000_000_000,
      feedback:
        "Reserves are something the Fed owes, not something it owns — they belong on its liability side.",
    },
    {
      id: "reserve-deposits",
      account: "Reserve deposits at the Fed",
      delta: 10_000_000_000,
      feedback:
        "The bank's claim on the Fed is an asset it owns. Only the Fed records reserves as a liability.",
    },
    {
      id: "customer-deposits",
      account: "Customer deposits",
      delta: 10_000_000_000,
      feedback:
        "The deposit is money the bank owes the dealer, so it sits on the bank's liability side.",
    },
    {
      id: "banknotes",
      account: "Banknotes in circulation",
      delta: 10_000_000_000,
      feedback:
        "No new paper was printed. Settlement between the Fed and a bank happens in reserves.",
    },
    {
      id: "dealer-loan",
      account: "Loans to the dealer",
      delta: 10_000_000_000,
      feedback:
        "Nobody borrowed anything. The dealer sold an asset — it did not take out a loan.",
    },
    {
      id: "tga",
      account: "Treasury general account",
      delta: 10_000_000_000,
      feedback:
        "The Treasury's cash account is untouched. This is the Fed buying in the secondary market, not the government spending.",
    },
  ],
  expectedShifts: [
    { entityId: "fed", side: "asset", account: "US Treasuries", delta: 10_000_000_000 },
    {
      entityId: "fed",
      side: "liability",
      account: "Commercial bank reserves",
      delta: 10_000_000_000,
    },
    {
      entityId: "dealer-bank",
      side: "asset",
      account: "Reserve deposits at the Fed",
      delta: 10_000_000_000,
    },
    {
      entityId: "dealer-bank",
      side: "liability",
      account: "Customer deposits",
      delta: 10_000_000_000,
    },
  ],
  aggregateEffects: [
    {
      aggregate: "M0",
      direction: "expand",
      note: "Reserves are base money, and $10B of them now exist that did not before.",
    },
    {
      aggregate: "M2",
      direction: "expand",
      note: "The dealer's deposit is broad money. QE swapped a bond it held for a balance it can spend.",
    },
    {
      aggregate: "collateral",
      direction: "contract",
      note: "Those Treasuries left the market — pristine collateral is now scarcer for repo desks.",
    },
  ],
  explanation:
    "Both sheets expanded by $10B. The Fed paid with a liability it issued on the spot; the bank received a claim on the Fed and now owes the dealer a deposit. Note what did not happen: no bank lent anything, and no saver's balance fell.",
};
