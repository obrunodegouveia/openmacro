import { MODULES } from "@openmacro/core/content";
/**
 * The public content model: the four balance-sheet tiers OpenMacro teaches,
 * the four-track syllabus built on them, and the reward loop.
 *
 * This mirrors the app's `MonetaryTier` taxonomy in `src/content/schema.ts`
 * (repository root). Keep the tier ids identical — a visitor who reads "Tier
 * 3: shadow banking" here should meet the same label in the app.
 */

export type TierId =
  | "central_bank"
  | "commercial_bank"
  | "shadow_bank"
  | "fiduciary_core";

export interface Tier {
  id: TierId;
  /** Display number, 1 at the top of the money hierarchy. */
  index: number;
  name: string;
  /** Who sits at this tier. */
  subject: string;
  /** The one-line reason this tier exists in the model. */
  premise: string;
  assets: string[];
  liabilities: string[];
  /** The instruments or mechanics taught here. */
  levers: string[];
  accent: "azure" | "emerald" | "violet" | "gold";
  icon: string;
}

export const TIERS: Tier[] = [
  {
    id: "central_bank",
    index: 1,
    name: "The Central Bank",
    subject: "The Fed & the ECB",
    premise:
      "The only balance sheet that settles everything else. Its liabilities are the base of the system.",
    assets: ["Sovereign bonds", "Private securities (APP/PEPP)", "Gold & FX reserves", "Discount loans"],
    liabilities: ["Banknotes in circulation", "Commercial bank reserves (M0)", "Reverse repos", "Government cash (TGA)"],
    levers: ["IORB", "ON RRP", "ECB Deposit Facility Rate", "MRO", "QE / QT"],
    accent: "azure",
    icon: "🏛️",
  },
  {
    id: "commercial_bank",
    index: 2,
    name: "The Commercial Layer",
    subject: "Deposit-taking banks",
    premise:
      "Where most of the money you actually spend is created — by lending, not by printing.",
    assets: ["Loans & mortgages", "Reserve deposits at the central bank", "Securities portfolio"],
    liabilities: ["Customer deposits (M1/M2)", "Interbank borrowing", "Capital"],
    levers: ["Loans create deposits", "Reserve management", "Clearing & settlement", "Bank runs"],
    accent: "emerald",
    icon: "🏦",
  },
  {
    id: "shadow_bank",
    index: 3,
    name: "Shadow Banking & Money Markets",
    subject: "MMFs, dealers, repo desks",
    premise:
      "Bank-like funding without a banking licence — and without access to reserves.",
    assets: ["Repo & reverse repo claims", "Treasury collateral", "Commercial paper"],
    liabilities: ["Fund shares", "Repo borrowing", "Eurodollar deposits"],
    levers: ["The eurodollar system", "Dealer balance sheet capacity", "Collateral re-use", "SOFR & €STR"],
    accent: "violet",
    icon: "🕸️",
  },
  {
    id: "fiduciary_core",
    index: 4,
    name: "The Fiduciary Core",
    subject: "The state & the legal frame",
    premise:
      "Why an unbacked token is accepted at all: tax liabilities, legal tender, and institutional confidence.",
    assets: ["Future tax claims", "Public infrastructure"],
    liabilities: ["Sovereign debt", "The currency itself"],
    levers: ["Chartalism & tax-driven demand", "Legal tender law", "Currency pegs", "Confidence & credibility"],
    accent: "gold",
    icon: "⚖️",
  },
];

export type TrackStatus = "live" | "beta" | "drafting" | "planned";

export interface Track {
  id: string;
  index: number;
  title: string;
  /** What the learner can do afterwards, not what they will have "covered". */
  promise: string;
  /** The specific instruments and mechanics, shown as chips. */
  concepts: string[];
  /** Which tiers this track operates on. */
  tiers: TierId[];
  icon: string;
  status: TrackStatus;
  accent: "emerald" | "gold" | "azure" | "violet" | "mint" | "coral";
  /** Derived from the content registry — never hand-written. */
  lessonCount: number;
}

/**
 * How many lessons a track actually contains, from the shared content package.
 *
 * Previously each track restated its own count, which is the kind of number
 * that silently goes stale the moment a lesson ships. `id` here matches the
 * module id in `@openmacro/core`, so the syllabus cannot advertise a lesson
 * that does not exist — or omit one that does.
 */
function lessonsIn(moduleId: string): number {
  return MODULES.find((module) => module.id === moduleId)?.lessons.length ?? 0;
}

const TRACKS: Omit<Track, "lessonCount">[] = [
  {
    id: "foundations-fiduciary-currency",
    index: 1,
    title: "Foundations of Fiduciary Currency",
    promise:
      "Explain why a piece of unbacked paper is accepted at all — without hand-waving about trust.",
    concepts: ["Commodity tokens to chartalism", "Legal tender & tax liabilities", "Purchasing power", "Pegs & reserve backing"],
    tiers: ["fiduciary_core"],
    icon: "🪙",
    status: "live",
    accent: "gold",
  },
  {
    id: "commercial-central-interface",
    index: 2,
    title: "The Commercial–Central Bank Interface",
    promise:
      "Trace a payment from one bank to another and say exactly what settles, and in what.",
    concepts: ["Correspondent banking", "Fedwire & TARGET2", "Fractional reserves", "SOFR & €STR"],
    tiers: ["central_bank", "commercial_bank"],
    icon: "🏦",
    status: "live",
    accent: "emerald",
  },
  {
    id: "fed-ecb-levers",
    index: 3,
    title: "The Fed & ECB Levers",
    promise:
      "Post every major policy operation yourself — QE, the floor, the corridor, the window.",
    concepts: ["IORB & the SOFR corridor", "ON RRP floor", "Discount window", "DFR, MRO & TLTROs", "Yield curve control"],
    tiers: ["central_bank", "shadow_bank"],
    icon: "🎛️",
    status: "live",
    accent: "azure",
  },
  {
    id: "crisis-architecture-global-dollar",
    index: 4,
    title: "Crisis Architecture & The Global Dollar",
    promise:
      "Follow the offshore dollar system, and read a rescue as it happens rather than after.",
    concepts: ["Central bank swap lines", "Lender of last resort", "Bail-ins vs bail-outs", "Eurodollar squeezes"],
    tiers: ["shadow_bank", "central_bank"],
    icon: "🌍",
    status: "live",
    accent: "violet",
  },
  {
    id: "reading-the-fed-balance-sheet",
    index: 5,
    title: "Reading the Fed's Balance Sheet",
    promise:
      "Open the release the Fed published this week and read it without a translator.",
    concepts: [
      "The H.4.1 release",
      "Treasury General Account",
      "Reserves as a residual",
      "The ON RRP drain",
      "QT vs. balance sheet growth",
    ],
    tiers: ["central_bank", "fiduciary_core"],
    icon: "📄",
    status: "live",
    accent: "mint",
  },
  {
    id: "reading-the-ecb-balance-sheet",
    index: 6,
    title: "Reading the ECB's Balance Sheet",
    promise:
      "Read the Eurosystem's weekly statement, and know which parts of the Fed's were choices.",
    concepts: [
      "The weekly financial statement",
      "Gold and revaluation accounts",
      "Deposit facility vs. current accounts",
      "€STR under the floor",
      "Two central banks diverging",
    ],
    tiers: ["central_bank", "commercial_bank"],
    icon: "🇪🇺",
    status: "live",
    accent: "azure",
  },
  {
    id: "the-treasury-yield-curve",
    index: 7,
    title: "The Treasury Yield Curve",
    promise:
      "Look at eleven numbers and say what the market thinks is coming.",
    concepts: [
      "Par yields and term premium",
      "Price, yield and duration",
      "Inversion and what it says",
      "Bull and bear steepeners",
    ],
    tiers: ["shadow_bank", "fiduciary_core"],
    icon: "📐",
    status: "live",
    accent: "gold",
  },
  {
    id: "debt-debasement-and-capital",
    index: 8,
    title: "Debt, Debasement and Capital",
    promise:
      "Work out who pays for a debt that is never repaid, and what the same resources build instead.",
    concepts: [
      "The inflation tax",
      "War finance through the ages",
      "r − g and the debt path",
      "Capital formation and allocation",
    ],
    tiers: ["fiduciary_core", "commercial_bank"],
    icon: "🏗️",
    status: "live",
    accent: "violet",
  },
  {
    id: "breaking-a-peg-1992",
    index: 9,
    title: "Breaking a Peg: September 1992",
    promise:
      "Price the sterling trade yourself, and know why the defence could not win.",
    concepts: [
      "The ERM and the trilemma",
      "Shorting a pegged currency",
      "Carry cost vs. devaluation payoff",
      "Intervention and sterilisation",
      "Reflexivity at size",
    ],
    tiers: ["central_bank", "shadow_bank"],
    icon: "📉",
    status: "live",
    accent: "coral",
  },
  {
    id: "the-bis-and-the-ecb",
    index: 10,
    title: "The BIS and the ECB",
    promise:
      "Tell the real channels of influence between Basel and Frankfurt from the imagined ones.",
    concepts: [
      "A bank for central banks",
      "Basel standards into EU law",
      "Central bank independence",
      "Influence without authority",
    ],
    tiers: ["central_bank", "fiduciary_core"],
    icon: "🏛️",
    status: "live",
    accent: "emerald",
  },
];

/**
 * The syllabus as rendered, with each track's lesson count read from the
 * shared content package rather than restated here.
 */
export const SYLLABUS: Track[] = TRACKS.map((track) => ({
  ...track,
  lessonCount: lessonsIn(track.id),
}));

const NUMBER_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
] as const;

/**
 * "Five" rather than "5", for the syllabus headline.
 *
 * Spelled out because it reads as prose there, and derived because the last
 * time this was a word in the copy it said "Four" for a while after the fifth
 * track shipped.
 */
export const TRACK_COUNT_LABEL: string =
  NUMBER_WORDS[SYLLABUS.length] ?? String(SYLLABUS.length);

/**
 * A real excerpt from `lesson-02-rrp-floor-mechanics.json` in the app,
 * rendered verbatim in the contributor hub.
 *
 * Trimmed to one challenge so it fits on screen; the full file is linked
 * beside it. Every field here validates against `src/content/schema.ts`.
 */
export const SAMPLE_LESSON_JSON = `{
  "id": "rrp-floor-mechanics",
  "title": "The Floor Under Every Overnight Rate",
  "subtitle": "Watch the ON RRP facility drain reserves and set the price of cash.",
  "icon": "🪜",
  "difficulty": "advanced",
  "challenges": [
    {
      "id": "rrp-flow-step",
      "type": "t_account_flow",
      "prompt": "A money market fund parks $500M at the Fed's ON RRP window overnight.",
      "explanation": "Total Fed liabilities are unchanged: $500M moved from the reserves line to the reverse repo line. But reserves are base money and reverse repos are not.",
      "currency": "USD",
      "entities": [
        { "id": "fed", "label": "Federal Reserve", "tier": "central_bank",
          "openingLines": [
            { "account": "Commercial bank reserves", "side": "liability", "amount": 3100000000000 },
            { "account": "Reverse repurchase agreements", "side": "liability", "amount": 420000000000 }
          ] },
        { "id": "mmf", "label": "Money Market Fund", "tier": "shadow_bank",
          "role": "Cannot hold reserves" }
      ],
      "expectedShifts": [
        { "entityId": "fed", "side": "liability",
          "account": "Reverse repurchase agreements", "delta": 500000000 },
        { "entityId": "fed", "side": "liability",
          "account": "Commercial bank reserves", "delta": -500000000 },
        { "entityId": "mmf", "side": "asset",
          "account": "Reverse repo claims", "delta": 500000000 },
        { "entityId": "mmf", "side": "asset",
          "account": "Bank deposits", "delta": -500000000 }
      ],
      "aggregateEffects": [
        { "aggregate": "M0", "direction": "contract",
          "note": "Reserves fell by $500M. Reverse repos are a Fed liability too, but they are not base money." }
      ],
      "xp": 30
    }
  ]
}`;