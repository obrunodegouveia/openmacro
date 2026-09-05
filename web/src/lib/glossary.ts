import type { TierId } from "@/lib/curriculum";

/**
 * ============================================================================
 * The monetary machine glossary
 * ============================================================================
 *
 * Reference content, and the site's main organic search surface: people
 * search "what is IORB" and "ON RRP explained" far more often than they
 * search for a learning app.
 *
 * Every entry follows the same discipline as a lesson explanation — describe
 * the mechanism as balance sheet facts, name the misconception it usually
 * carries, and cite the primary source rather than a secondary summary. An
 * entry that cannot do all three does not belong here.
 */

export interface GlossarySource {
  label: string;
  url: string;
}

export interface GlossaryEntry {
  /** URL segment: /glossary/<slug>. Stable — never rename a published one. */
  slug: string;
  term: string;
  abbreviation?: string;
  /** Other names people search for. Rendered, and used in on-page copy. */
  aliases?: string[];
  tier: TierId;
  /** One sentence. Doubles as the meta description and the DefinedTerm body. */
  definition: string;
  /** Two or three short paragraphs of real explanation. */
  explanation: string[];
  /** The mechanism, stated as balance sheet movements. */
  mechanics: Array<{ label: string; detail: string }>;
  /** The misreading this term almost always carries. */
  misreading?: string;
  /** Slugs of related entries. */
  related: string[];
  sources: GlossarySource[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: "bank-reserves",
    term: "Bank reserves",
    aliases: ["reserve balances", "central bank reserves"],
    tier: "central_bank",
    definition:
      "Deposits that commercial banks hold at the central bank — the settlement asset banks use to pay each other, and a liability of the central bank rather than an asset it owns.",
    explanation: [
      "Reserves are the top of the money hierarchy. When one bank pays another, what moves between them is reserves, and reserves exist only as entries on the central bank's own balance sheet.",
      "Only eligible institutions — broadly, banks — can hold them. A household, a company or a money market fund cannot open a reserve account, which is why the central bank needs separate facilities to reach non-banks at all.",
      "Reserves cannot leave the banking system through lending. A loan moves deposits between customers; only two things change the total quantity of reserves: the central bank creating or destroying them, and the public converting deposits into banknotes.",
    ],
    mechanics: [
      {
        label: "Whose liability",
        detail: "The central bank's. On a commercial bank's sheet the same balance appears as an asset.",
      },
      {
        label: "How they are created",
        detail: "The central bank buys an asset or lends, and credits a reserve account with money it issues on the spot.",
      },
      {
        label: "How they are drained",
        detail: "Asset sales or maturities, cash withdrawals, a rising Treasury account, or take-up at the reverse repo facility.",
      },
    ],
    misreading:
      "That banks lend out their reserves. They do not — reserves never leave the banking system when a loan is made. Lending creates a new deposit, and the bank's reserve position only changes when the borrower's payment settles somewhere else.",
    related: ["monetary-base", "iorb", "on-rrp", "treasury-general-account"],
    sources: [
      {
        label: "Federal Reserve — Reserve Requirements",
        url: "https://www.federalreserve.gov/monetarypolicy/reservereq.htm",
      },
      {
        label: "Bank of England — Money creation in the modern economy",
        url: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy",
      },
    ],
  },
  {
    slug: "monetary-base",
    term: "Monetary base",
    abbreviation: "M0",
    aliases: ["M0", "base money", "high-powered money"],
    tier: "central_bank",
    definition:
      "The total of banknotes in circulation and commercial bank reserves — every form of money that is a direct liability of the central bank.",
    explanation: [
      "The base is what the central bank itself issues. Everything else people call money — the balance in a current account, a money market fund share — is somebody else's promise, ultimately settled in base money.",
      "Its two components serve different users. Banknotes are the base money the public can hold; reserves are the base money only banks can hold. A cash withdrawal converts one into the other without changing the total.",
      "A growing base does not mechanically produce inflation or lending. After 2008 the base grew enormously while broad money and bank credit grew far more slowly, which is the clearest evidence that the textbook multiplier is a ceiling rather than a description.",
    ],
    mechanics: [
      { label: "Components", detail: "Currency in circulation + reserve balances held at the central bank." },
      { label: "Expands when", detail: "The central bank buys assets or lends — quantitative easing being the largest example." },
      { label: "Contracts when", detail: "Holdings mature without reinvestment, or cash flows back and is retired." },
    ],
    misreading:
      "That the base and 'the money supply' are the same thing. Most money people actually spend is broad money — commercial bank deposits — which is created by lending, not by the central bank.",
    related: ["bank-reserves", "broad-money", "quantitative-easing", "money-multiplier"],
    sources: [
      {
        label: "FRED — Monetary Base series",
        url: "https://fred.stlouisfed.org/series/BOGMBASE",
      },
    ],
  },
  {
    slug: "broad-money",
    term: "Broad money",
    abbreviation: "M2",
    aliases: ["M2", "money supply"],
    tier: "commercial_bank",
    definition:
      "Money the public can actually spend — currency plus bank deposits and close substitutes — most of which is created by commercial banks when they lend.",
    explanation: [
      "When a bank grants a loan it credits the borrower's account. Both sides of its balance sheet grow at once: a new asset (the loan) and a new liability (the deposit). That deposit is new broad money, and no saver's balance fell to produce it.",
      "The US M2 aggregate covers currency, chequing and savings deposits, small time deposits and retail money market fund shares. The precise boundary is a definitional choice, which is why 'did M2 rise?' sometimes has a less interesting answer than 'whose liability moved?'",
      "Broad money shrinks when loans are repaid. Repayment destroys the deposit that the loan created — which is why deleveraging drains money from an economy rather than merely redistributing it.",
    ],
    mechanics: [
      { label: "Created by", detail: "Commercial bank lending, and by central bank purchases from non-banks." },
      { label: "Destroyed by", detail: "Loan repayment, and by banks selling assets to their own depositors." },
      { label: "Not the same as", detail: "Reserves. Broad money is a bank's liability; reserves are the central bank's." },
    ],
    misreading:
      "That banks are intermediaries passing savers' money to borrowers. Causality runs the other way: loans create deposits, and deposits are the by-product of lending rather than its raw material.",
    related: ["monetary-base", "money-multiplier", "bank-reserves"],
    sources: [
      { label: "FRED — M2 money stock", url: "https://fred.stlouisfed.org/series/M2SL" },
      {
        label: "Bank of England — Money creation in the modern economy",
        url: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy",
      },
    ],
  },
  {
    slug: "iorb",
    term: "Interest on Reserve Balances",
    abbreviation: "IORB",
    aliases: ["interest on reserves", "IOER"],
    tier: "central_bank",
    definition:
      "The rate the Federal Reserve pays banks on the reserves they hold with it — the administered rate that anchors the floor of the US policy corridor for banks.",
    explanation: [
      "In a system with abundant reserves, the Fed cannot steer rates by making reserves scarce. Instead it sets the return on the safest asset a bank can hold, and lets competition do the rest: a bank will not lend overnight to anyone at less than it earns doing nothing.",
      "IORB replaced the earlier split between interest on required reserves and interest on excess reserves in 2021, once reserve requirements had been set to zero and the distinction was moot.",
      "It is an administered rate, not a market rate. The Board sets it directly, which is what makes it a lever rather than an observation.",
    ],
    mechanics: [
      { label: "Who receives it", detail: "Eligible depository institutions — banks — on their reserve balances." },
      { label: "What it anchors", detail: "The floor of the effective federal funds rate for institutions that can hold reserves." },
      { label: "Why non-banks need more", detail: "Money funds and GSEs cannot hold reserves, so the ON RRP facility reaches them instead." },
    ],
    misreading:
      "That paying interest on reserves 'subsidises banks not to lend'. Lending is not constrained by reserves in the first place — IORB sets the opportunity cost of overnight money, which is how the policy rate transmits at all when reserves are abundant.",
    related: ["on-rrp", "bank-reserves", "sofr", "deposit-facility-rate"],
    sources: [
      {
        label: "Federal Reserve — Interest on Reserve Balances",
        url: "https://www.federalreserve.gov/monetarypolicy/reqresbalances.htm",
      },
    ],
  },
  {
    slug: "on-rrp",
    term: "Overnight Reverse Repurchase Agreement Facility",
    abbreviation: "ON RRP",
    aliases: ["reverse repo facility", "overnight reverse repo"],
    tier: "central_bank",
    definition:
      "A Federal Reserve facility where eligible non-banks lend cash to the Fed overnight against Treasury collateral, putting a hard floor under short-term interest rates.",
    explanation: [
      "Money market funds, government-sponsored enterprises and dealers hold enormous cash balances but cannot hold reserves. Without an alternative they must lend to banks at whatever rate banks offer. ON RRP gives them a risk-free option at a published rate, so they will not lend below it to anyone.",
      "Take-up is a thermometer, not a policy setting. Large balances mean cash cannot find a better return in private markets; a decline usually means bill supply or repo rates have become more attractive.",
      "The operation drains reserves without shrinking the Fed's balance sheet. Total liabilities are unchanged — the money simply moves from the reserves line to the reverse repo line, and only one of those is base money.",
    ],
    mechanics: [
      { label: "Direction of cash", detail: "From the fund to the Fed overnight; the Fed pledges Treasuries as collateral." },
      { label: "Effect on reserves", detail: "Down by the amount taken up, because the cash came out of a bank deposit." },
      { label: "Effect on the Fed's sheet", detail: "No change in size. Composition of liabilities shifts, nothing more." },
    ],
    misreading:
      "That the Fed is 'printing money' when take-up rises. The opposite happens: ON RRP absorbs cash and shrinks the monetary base, even though the Fed's overall balance sheet stays exactly the same size.",
    related: ["iorb", "bank-reserves", "repurchase-agreement", "monetary-base"],
    sources: [
      {
        label: "New York Fed — Reverse Repo Operations",
        url: "https://www.newyorkfed.org/markets/desk-operations/reverse-repo",
      },
    ],
  },
  {
    slug: "quantitative-easing",
    term: "Quantitative easing",
    abbreviation: "QE",
    aliases: ["asset purchases", "large-scale asset purchases", "APP", "PEPP"],
    tier: "central_bank",
    definition:
      "Large-scale central bank purchases of bonds, paid for with newly created reserves, used to ease financial conditions once the policy rate is already near its floor.",
    explanation: [
      "Mechanically, QE is an asset swap. The seller gives up a bond and receives a deposit; the seller's bank receives reserves. Nobody's net wealth changes much — the composition of what the private sector holds does.",
      "Because it removes duration and takes high-quality collateral out of the market, QE works mainly through the price of risk and the shape of the yield curve, not through handing anyone spendable money.",
      "The ECB ran the same mechanism under its Asset Purchase Programme and, from 2020, the Pandemic Emergency Purchase Programme. The instrument names differ; the balance sheet entries do not.",
    ],
    mechanics: [
      { label: "Central bank", detail: "Assets: bonds up. Liabilities: reserves up by the same amount." },
      { label: "Seller's bank", detail: "Assets: reserves up. Liabilities: the seller's deposit up." },
      { label: "Collateral market", detail: "Pristine collateral leaves circulation, which tightens repo markets." },
    ],
    misreading:
      "That QE forces banks to lend, or is inherently inflationary via the multiplier. It creates reserves, and reserves are not what constrains lending — which is why a decade of QE coincided with historically weak credit growth.",
    related: ["quantitative-tightening", "bank-reserves", "monetary-base", "primary-dealer"],
    sources: [
      {
        label: "ECB — Asset purchase programmes",
        url: "https://www.ecb.europa.eu/mopo/implement/app/html/index.en.html",
      },
      {
        label: "Federal Reserve — Open Market Operations",
        url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm",
      },
    ],
  },
  {
    slug: "quantitative-tightening",
    term: "Quantitative tightening",
    abbreviation: "QT",
    aliases: ["balance sheet runoff", "balance sheet normalisation"],
    tier: "central_bank",
    definition:
      "The reverse of QE — shrinking the central bank's balance sheet, usually by letting bonds mature without reinvesting, which destroys reserves.",
    explanation: [
      "Runoff is passive. When a bond the central bank holds matures, the issuer repays and the central bank simply does not buy a replacement. The asset disappears from one side of the sheet and reserves disappear from the other.",
      "That makes QT slower and less controllable than QE. The pace is set by the maturity profile of what is held and by any monthly cap, not by a decision taken meeting to meeting.",
      "The binding question is where reserve scarcity begins. Nobody knows the level in advance, and overshooting it shows up first as strain in repo markets — as the US discovered in September 2019.",
    ],
    mechanics: [
      { label: "Central bank", detail: "Assets: bonds down at maturity. Liabilities: reserves down by the same amount." },
      { label: "Interacts with", detail: "The Treasury account and ON RRP balances, which move reserves independently." },
      { label: "Warning sign", detail: "Repo rates printing persistently above the administered floor." },
    ],
    misreading:
      "That QT is simply QE run backwards at the same speed and with the same effect. Purchases are chosen; runoff is inherited from a maturity schedule, and its impact lands unevenly across markets.",
    related: ["quantitative-easing", "bank-reserves", "repurchase-agreement", "sofr"],
    sources: [
      {
        label: "Federal Reserve — Policy Normalization",
        url: "https://www.federalreserve.gov/monetarypolicy/policy-normalization.htm",
      },
    ],
  },
  {
    slug: "deposit-facility-rate",
    term: "Deposit Facility Rate",
    abbreviation: "DFR",
    aliases: ["ECB deposit rate", "ECB policy rate"],
    tier: "central_bank",
    definition:
      "The rate the ECB pays euro-area banks on overnight deposits at the Eurosystem — since 2022 the rate through which the ECB steers short-term euro rates.",
    explanation: [
      "The euro area runs a corridor with three rates: the deposit facility at the bottom, the main refinancing rate in the middle, and the marginal lending facility at the top. With excess liquidity abundant, market rates sit against the floor, so the DFR is the rate that actually bites.",
      "Between 2014 and 2022 the DFR was negative — banks paid to park money at the ECB. That was a deliberate attempt to push liquidity out of the deposit facility and into lending, and it makes the euro area the largest experiment in negative policy rates ever run.",
      "The ECB narrowed the MRO–DFR spread in 2024 as part of its operational framework review, tightening the corridor around the floor.",
    ],
    mechanics: [
      { label: "Who receives it", detail: "Euro-area credit institutions on overnight deposits with their national central bank." },
      { label: "What it anchors", detail: "€STR and the whole short end of the euro curve." },
      { label: "US analogue", detail: "IORB — the same job, done for banks that can hold reserves." },
    ],
    misreading:
      "That a negative DFR was a tax on savers. It applied to banks' balances at the central bank, not to household deposits; whether banks passed it on was a separate commercial decision, and for retail depositors they mostly did not.",
    related: ["main-refinancing-operations", "euro-short-term-rate", "iorb"],
    sources: [
      {
        label: "ECB — Key interest rates",
        url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html",
      },
    ],
  },
  {
    slug: "main-refinancing-operations",
    term: "Main Refinancing Operations",
    abbreviation: "MRO",
    aliases: ["refi rate", "ECB main refinancing rate"],
    tier: "central_bank",
    definition:
      "The ECB's regular weekly collateralised lending to euro-area banks, and the rate charged on it — historically the Eurosystem's principal source of liquidity.",
    explanation: [
      "An MRO is a repo: a bank pledges eligible collateral and receives central bank money for one week. It is lending against security, not a gift, and the collateral framework is where much of the ECB's real risk policy lives.",
      "Before 2008 the MRO was the main tap through which liquidity reached the system, and the MRO rate was therefore the headline policy rate. Once excess liquidity became abundant, the deposit facility took over that role.",
      "The ECB has signalled that MROs will regain importance as excess liquidity declines, with banks meeting more of their needs through demand-driven operations again.",
    ],
    mechanics: [
      { label: "Direction", detail: "The ECB lends; the bank pledges collateral and receives central bank money." },
      { label: "Tenor", detail: "One week, allotted weekly, fully allotted at a fixed rate since 2008." },
      { label: "Balance sheet", detail: "Eurosystem assets: lending up. Liabilities: the bank's account up." },
    ],
    misreading:
      "That the MRO rate is still 'the' ECB rate. In a floor system the deposit facility rate is what markets price against; the MRO matters most as the ceiling of the narrowed corridor.",
    related: ["deposit-facility-rate", "repurchase-agreement", "discount-window"],
    sources: [
      {
        label: "ECB — Open market operations",
        url: "https://www.ecb.europa.eu/mopo/implement/omo/html/index.en.html",
      },
    ],
  },
  {
    slug: "sofr",
    term: "Secured Overnight Financing Rate",
    abbreviation: "SOFR",
    tier: "shadow_bank",
    definition:
      "A broad measure of the cost of borrowing cash overnight secured by US Treasury collateral, published each morning by the New York Fed and the main US replacement for LIBOR.",
    explanation: [
      "SOFR is calculated from actual transactions across the Treasury repo market — hundreds of billions of dollars a day — rather than from a panel of banks reporting where they think they could borrow. That is precisely the flaw in LIBOR that SOFR was designed to remove.",
      "Because it is secured, SOFR carries almost no bank credit risk. It therefore behaves differently from LIBOR in a crisis: LIBOR spikes when banks are distrusted, while SOFR can spike when collateral or dealer balance sheet capacity is scarce.",
      "Spikes are diagnostic. When SOFR prints well above the administered floor, it is usually telling you that reserves have become scarce or that dealers cannot expand their books — as in September 2019.",
    ],
    mechanics: [
      { label: "What it measures", detail: "Overnight cash borrowing collateralised by Treasuries, transaction-weighted." },
      { label: "Published by", detail: "The Federal Reserve Bank of New York, each business morning." },
      { label: "Reads against", detail: "IORB and the ON RRP rate — the administered floor it should sit near." },
    ],
    misreading:
      "That SOFR is simply the new LIBOR. It is a secured rate with no term structure of its own, which is why term SOFR had to be constructed separately and why lending spreads had to be repriced rather than merely relabelled.",
    related: ["repurchase-agreement", "iorb", "on-rrp", "quantitative-tightening"],
    sources: [
      {
        label: "New York Fed — SOFR",
        url: "https://www.newyorkfed.org/markets/reference-rates/sofr",
      },
    ],
  },
  {
    slug: "euro-short-term-rate",
    term: "Euro Short-Term Rate",
    abbreviation: "€STR",
    aliases: ["ESTR", "euro STR"],
    tier: "shadow_bank",
    definition:
      "The ECB's benchmark for unsecured overnight borrowing costs of euro-area banks, computed from reported money market transactions and the replacement for EONIA.",
    explanation: [
      "€STR is built from the borrowing side of the euro money market statistical reporting, covering unsecured overnight deposits banks take from financial counterparties. Because it is unsecured, it embeds a small amount of bank credit risk that SOFR does not.",
      "It trades slightly below the deposit facility rate in normal conditions, because some lenders in the reporting sample cannot access the ECB's facilities directly and will accept a little less.",
      "Watching the €STR–DFR spread is one of the cleanest tests of whether a floor system is working: a widening gap means the floor is leaking.",
    ],
    mechanics: [
      { label: "What it measures", detail: "Unsecured overnight borrowing by euro-area banks from financial counterparties." },
      { label: "Published by", detail: "The European Central Bank, each TARGET business day." },
      { label: "US analogue", detail: "The effective federal funds rate — unsecured — rather than SOFR." },
    ],
    misreading:
      "That €STR and SOFR are interchangeable across currencies. One is unsecured and one is secured; in a stress episode they move for opposite reasons.",
    related: ["deposit-facility-rate", "sofr", "eurodollar"],
    sources: [
      {
        label: "ECB — Euro short-term rate",
        url: "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_short-term_rate/html/index.en.html",
      },
    ],
  },
  {
    slug: "repurchase-agreement",
    term: "Repurchase agreement",
    abbreviation: "Repo",
    aliases: ["repo", "reverse repo", "sale and repurchase"],
    tier: "shadow_bank",
    definition:
      "The sale of a security combined with an agreement to buy it back at a set price and date — legally a sale, economically a loan secured by collateral.",
    explanation: [
      "Repo is the plumbing of modern finance. Dealers fund their inventory in it, money funds park cash in it, and it is how Treasuries are turned into cash without being sold outright.",
      "The legal form matters enormously in a default. Because it is a sale rather than a pledge, the cash lender can seize and sell the collateral immediately rather than queuing in bankruptcy — which is what makes lenders willing to fund at very fine spreads.",
      "The same trade has two names depending on where you stand. The cash borrower is doing a repo; the cash lender is doing a reverse repo. The Fed's ON RRP facility is named from the Fed's side.",
    ],
    mechanics: [
      { label: "Cash borrower", detail: "Delivers collateral, receives cash, agrees to repurchase — usually overnight." },
      { label: "Haircut", detail: "The collateral is worth slightly more than the cash, protecting the lender from price moves." },
      { label: "Re-use", detail: "Collateral can be pledged onward, so one bond can support several chains of credit." },
    ],
    misreading:
      "That repo is a niche technicality. It is the market where the price of overnight money is actually set, and every major post-1990 funding crisis has run through it.",
    related: ["sofr", "on-rrp", "eurodollar", "primary-dealer"],
    sources: [
      {
        label: "New York Fed — Repo and reverse repo operations",
        url: "https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements",
      },
    ],
  },
  {
    slug: "eurodollar",
    term: "Eurodollar",
    aliases: ["offshore dollars", "eurodollar system"],
    tier: "shadow_bank",
    definition:
      "A US dollar deposit held at a bank outside United States jurisdiction — dollars created offshore, beyond the Federal Reserve's direct reach.",
    explanation: [
      "The name is a historical accident: the market began with dollar deposits in European banks and has nothing to do with the euro. A dollar deposit in Tokyo or Singapore is a eurodollar too.",
      "A bank outside the US can create dollar deposits by lending dollars, exactly as a US bank does — but it cannot create the reserves that ultimately settle those claims. When offshore dollar funding dries up, there is no domestic lender of last resort standing behind it.",
      "This is why Fed swap lines exist. They are the mechanism by which the Fed lends dollars to other central banks so they can relieve stress in a dollar system that operates outside its borders.",
    ],
    mechanics: [
      { label: "Where the deposit sits", detail: "A bank outside US jurisdiction, denominated in USD." },
      { label: "What it lacks", detail: "Direct access to Fed reserves, deposit insurance, and the discount window." },
      { label: "Stress signal", detail: "Cross-currency basis swaps moving sharply negative against the dollar." },
    ],
    misreading:
      "That the dollar system is contained within the United States. Most dollar credit is created outside it, which is why a US central bank ends up acting as the world's.",
    related: ["central-bank-swap-line", "repurchase-agreement", "euro-short-term-rate"],
    sources: [
      {
        label: "BIS — The dollar and global funding markets",
        url: "https://www.bis.org/publ/qtrpdf/r_qt2209.htm",
      },
    ],
  },
  {
    slug: "primary-dealer",
    term: "Primary dealer",
    tier: "shadow_bank",
    definition:
      "A trading counterparty of the New York Fed, obliged to bid at every Treasury auction and to make markets in government securities — the channel through which open market operations reach the financial system.",
    explanation: [
      "The Fed does not buy bonds from the public. It transacts with a small list of primary dealers, and those dealers are the bridge between the central bank's balance sheet and everyone else's.",
      "The obligation runs both ways: dealers get access to Fed operations, and in exchange must participate in auctions and provide market-making even when it is unprofitable to do so.",
      "Dealer balance sheet capacity is a real constraint on the whole system. When leverage rules or risk limits stop dealers from expanding, repo markets seize even though nothing is wrong with the collateral itself.",
    ],
    mechanics: [
      { label: "Counterparty to", detail: "The New York Fed's Open Market Trading Desk." },
      { label: "Obligations", detail: "Bid at Treasury auctions; make markets; report positions and flows." },
      { label: "Why capacity matters", detail: "Intermediation requires balance sheet, and balance sheet is finite and regulated." },
    ],
    misreading:
      "That QE puts money directly into the real economy. It reaches a dealer first, and whether anything travels further depends on what the seller does next.",
    related: ["quantitative-easing", "repurchase-agreement", "sofr"],
    sources: [
      {
        label: "New York Fed — Primary Dealers",
        url: "https://www.newyorkfed.org/markets/primarydealers",
      },
    ],
  },
  {
    slug: "treasury-general-account",
    term: "Treasury General Account",
    abbreviation: "TGA",
    aliases: ["Treasury cash account"],
    tier: "central_bank",
    definition:
      "The US Treasury's operating account at the Federal Reserve — the government's chequing account, and a central bank liability that competes directly with bank reserves.",
    explanation: [
      "When you pay tax, money leaves your bank deposit, your bank loses reserves, and the TGA rises. The Fed's balance sheet does not change size; its liabilities simply shift from banks to the government.",
      "The reverse happens when the Treasury spends: the TGA falls and reserves return to the banking system. Government spending is, mechanically, a reserve injection.",
      "This makes the TGA one of the largest sources of week-to-week volatility in reserve balances — often larger than anything the central bank is doing deliberately. Debt ceiling episodes, where the balance is run down and then rebuilt, move hundreds of billions.",
    ],
    mechanics: [
      { label: "Tax payment", detail: "Deposits down, reserves down, TGA up. Base money falls." },
      { label: "Government spending", detail: "TGA down, reserves up, deposits up. Base money rises." },
      { label: "Bond issuance", detail: "Drains reserves as buyers pay, until the proceeds are spent back out." },
    ],
    misreading:
      "That government borrowing and spending are neutral for the banking system. Every movement in the TGA is a movement in reserves, which is why liquidity forecasters watch it as closely as they watch policy.",
    related: ["bank-reserves", "monetary-base", "on-rrp"],
    sources: [
      {
        label: "US Treasury — Daily Treasury Statement",
        url: "https://fiscaldata.treasury.gov/datasets/daily-treasury-statement/",
      },
    ],
  },
  {
    slug: "discount-window",
    term: "Discount window",
    aliases: ["primary credit", "lender of last resort facility"],
    tier: "central_bank",
    definition:
      "The Federal Reserve's standing facility for lending directly to banks against collateral — the backstop that is supposed to cap how high short-term rates can go.",
    explanation: [
      "In theory no bank should ever pay more than the discount rate to borrow overnight, because it can always borrow from the Fed instead. In practice the ceiling leaks, because borrowing carries stigma.",
      "Stigma is the window's central design problem. A bank that uses it may be read as unable to fund itself privately, so banks avoid it precisely when they most need it — the opposite of what a backstop should do.",
      "Bagehot's rule — lend freely, against good collateral, at a penalty rate — is the doctrine behind the facility, and it is still the sharpest one-line summary of what a lender of last resort is for.",
    ],
    mechanics: [
      { label: "Direction", detail: "The Fed lends; the bank pledges collateral and receives newly created reserves." },
      { label: "Primary credit", detail: "Available to sound institutions, short term, at a rate above the target range." },
      { label: "Euro-area analogue", detail: "The marginal lending facility, at the top of the ECB corridor." },
    ],
    misreading:
      "That discount window borrowing signals a failing bank. It signals a bank short of liquidity, which is not the same as short of capital — conflating the two is how a funding problem becomes a solvency problem.",
    related: ["central-bank-swap-line", "main-refinancing-operations", "bank-reserves"],
    sources: [
      {
        label: "Federal Reserve — The Discount Window",
        url: "https://www.frbdiscountwindow.org/",
      },
    ],
  },
  {
    slug: "central-bank-swap-line",
    term: "Central bank liquidity swap line",
    aliases: ["dollar swap lines", "Fed swap lines"],
    tier: "central_bank",
    definition:
      "An arrangement under which the Federal Reserve lends dollars to another central bank against its currency, so that bank can relieve dollar funding stress among its own banks.",
    explanation: [
      "The Fed swaps dollars for euro, yen or sterling at the prevailing spot rate, with an agreement to reverse the trade later at the same rate. The foreign central bank takes the credit risk of lending those dollars onward to its own banks; the Fed's counterparty is the central bank itself.",
      "This is the institutional answer to the eurodollar problem. Dollar liabilities are created worldwide by institutions with no access to the Fed, and in a squeeze somebody has to supply the dollars those liabilities settle in.",
      "Swap lines became standing arrangements between six major central banks after 2008 and were widened dramatically in March 2020. They are the least-discussed and most consequential piece of global crisis architecture.",
    ],
    mechanics: [
      { label: "Leg one", detail: "The Fed credits the foreign central bank with dollars; it receives its currency in exchange." },
      { label: "Onward lending", detail: "The foreign central bank auctions those dollars to its own banks against collateral." },
      { label: "Risk", detail: "The Fed faces a central bank, not a commercial bank, and holds foreign currency throughout." },
    ],
    misreading:
      "That swap lines are a bailout of foreign banks by US taxpayers. They are collateralised, reversed at the original exchange rate, and have historically been profitable — the alternative is a dollar shortage that lands back on US markets anyway.",
    related: ["eurodollar", "discount-window", "repurchase-agreement"],
    sources: [
      {
        label: "Federal Reserve — Central Bank Liquidity Swaps",
        url: "https://www.federalreserve.gov/monetarypolicy/bst_liquidityswaps.htm",
      },
    ],
  },
  {
    slug: "money-multiplier",
    term: "Money multiplier",
    aliases: ["deposit multiplier", "fractional reserve multiplier"],
    tier: "commercial_bank",
    definition:
      "The textbook ratio m = 1/R describing the maximum deposit money a banking system could support on a given reserve base — a ceiling, not a description of how banks actually operate.",
    explanation: [
      "The model runs a chain: a deposit arrives, the bank keeps a fraction R and lends the rest, the loan is redeposited, and so on. Summed to infinity, one unit of base money supports 1/R units of deposits.",
      "It is a useful first mental model and a poor description of reality. Modern central banks target an interest rate rather than a quantity of reserves, several have set reserve requirements to zero — the Fed did so in March 2020 — and banks are constrained by capital, regulation and demand for credit long before reserves bind.",
      "Keeping the model while knowing its limits is the honest position. It tells you what an unconstrained system could do, and the gap between that and observed lending is itself the interesting quantity.",
    ],
    mechanics: [
      { label: "Formula", detail: "m = 1 / R, so total deposits M = D × (1 / R)." },
      { label: "Assumes", detail: "No cash leakage, every bank lent to its limit, and a binding reserve requirement." },
      { label: "Reality check", detail: "Post-2008, base money multiplied while broad money did not." },
    ],
    misreading:
      "That the multiplier describes causation — that reserves are lent out and multiply. Lending creates deposits first; reserves are managed afterwards, and the central bank supplies whatever quantity its rate target requires.",
    related: ["broad-money", "monetary-base", "bank-reserves"],
    sources: [
      {
        label: "Bank of England — Money creation in the modern economy",
        url: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy",
      },
      {
        label: "Federal Reserve — Reserve Requirements",
        url: "https://www.federalreserve.gov/monetarypolicy/reservereq.htm",
      },
    ],
  },
  {
    slug: "legal-tender",
    term: "Legal tender",
    aliases: ["fiat currency", "chartalism", "fiduciary currency"],
    tier: "fiduciary_core",
    definition:
      "Money a creditor must accept in settlement of a debt by law — one of the props, alongside tax liabilities, that makes an intrinsically worthless token universally acceptable.",
    explanation: [
      "Legal tender law is narrower than people assume. It governs the settlement of debts already incurred; it does not oblige a shop to accept cash for a sandwich, and most countries let sellers set their own terms in advance.",
      "The stronger prop is taxation. A government that demands payment in a particular unit creates continuous, non-optional demand for it — the chartalist argument that taxes drive money, and the reason a currency's acceptability tracks the reach of the state that issues it.",
      "The rest is institutional confidence: an independent central bank, enforceable contracts, and a plausible expectation that the unit will still mean something next year. None of these is a physical backing, which is exactly why the arrangement is called fiduciary.",
    ],
    mechanics: [
      { label: "Legal prop", detail: "Statute makes the unit valid for settling debts within the jurisdiction." },
      { label: "Fiscal prop", detail: "Tax liabilities denominated in the unit create standing demand for it." },
      { label: "Institutional prop", detail: "Credibility of the issuer, and the expectation that it will be defended." },
    ],
    misreading:
      "That fiat money is 'backed by nothing'. It is backed by an enforceable claim structure — tax obligations, courts, and a central bank — which is a different thing from being backed by a commodity.",
    related: ["broad-money", "monetary-base"],
    sources: [
      {
        label: "US Treasury — Legal Tender Status",
        url: "https://home.treasury.gov/policy-issues/financing-the-government/legal-tender-status",
      },
      {
        label: "ECB — What is money?",
        url: "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html",
      },
    ],
  },
];

/** Lookup by slug. Returns `undefined` for an unknown term. */
export function findTerm(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((entry) => entry.slug === slug);
}

/** Alphabetical, for the index page and the sitemap. */
export const GLOSSARY_SORTED: GlossaryEntry[] = [...GLOSSARY].sort((a, b) =>
  a.term.localeCompare(b.term),
);
