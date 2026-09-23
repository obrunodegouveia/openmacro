import { defineLesson } from '../../schema';

/**
 * Non-bank intermediation. Everything the course has said about banks is
 * true; most of the system stopped being banks.
 */
export const moneyThatIsntABankLesson = defineLesson({
  id: 'money-that-isnt-a-bank',
  title: 'Runs on Things That Are Not Banks',
  subtitle:
    'Deposit insurance, capital requirements, a lender of last resort. None of it applies to half the financial system, which performs the same function anyway.',
  icon: '🫧',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-what-makes-a-run',
      type: 'multiple_choice',
      tags: ['non-banks', 'runs'],
      xp: 35,
      prompt: 'What makes something runnable, whether or not it is a bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'mismatch',
          label: 'It promises instant exit from slow assets',
        },
        {
          id: 'leverage',
          label: 'It is very highly leveraged',
          feedback:
            'Leverage magnifies losses and does not by itself create the incentive to be first out. An unleveraged fund holding illiquid assets is runnable.',
        },
        {
          id: 'uninsured',
          label: 'Its investors are not insured',
          feedback:
            'Insurance removes the incentive rather than creating it, which is why it works. What creates it is the mismatch in the answer.',
        },
        {
          id: 'risky',
          label: 'It holds unusually risky assets',
          feedback:
            'Risk means investors might lose money. A run is about the advantage of leaving before others do, which comes from the liquidity promise, not the risk.',
        },
      ],
      correctOptionId: 'mismatch',
      explanation:
        'The structure is what matters, never the label. If redeeming today gets you today’s stated value while the manager must sell assets tomorrow at whatever they fetch, then leaving early is strictly better than leaving late — and everyone can see that. That is a bank run, whether the institution is a bank, a money market fund, an open-ended property fund, or a stablecoin. Recognising the structure rather than the legal form is the single most transferable skill in financial stability work, because the structure keeps reappearing somewhere new.',
      
    },
    {
      id: 'match-nonbank-types',
      type: 'concept_match',
      tags: ['non-banks'],
      xp: 35,
      prompt: 'Four non-banks. Match each to the mismatch it runs.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'mmf',
          term: 'Money market funds',
          definition: 'Offer par on demand against commercial paper that stops trading under stress',
        },
        {
          id: 'openend',
          term: 'Open-ended property funds',
          definition: 'Daily dealing against buildings that take months to sell',
        },
        {
          id: 'insurer',
          term: 'Life insurers with guarantees',
          definition: 'Fixed long-dated promises funded by assets whose yield fell below them',
        },
        {
          id: 'hedge',
          term: 'Leveraged relative value funds',
          definition: 'Small price gaps traded at very high leverage, funded in overnight repo',
        },
      ],
      explanation:
        'The first and the last were both at the centre of March 2020 and they are opposite problems. Money market funds faced redemptions and could not sell paper; leveraged funds holding the basis between Treasuries and futures faced margin calls and had to sell the Treasuries themselves — which is why the safest asset in the world became briefly unsellable. Neither has access to the central bank, neither is subject to bank capital rules, and both required intervention. That is the structural situation this module exists to describe.',
    },
    {
      id: 'mc-why-migrated',
      type: 'multiple_choice',
      tags: ['non-banks', 'regulation'],
      xp: 40,
      prompt: 'Why did so much intermediation move outside the banking system after 2009?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cost',
          label: 'The same activity became more expensive inside a regulated bank',
        },
        {
          id: 'innovation',
          label: 'Technology made new intermediaries possible',
          feedback:
            'Technology helped and most of these structures predate it. Money market funds and finance companies are decades old.',
        },
        {
          id: 'demand',
          label: 'Investors wanted higher returns',
          feedback:
            'Reaching for yield drove where the money went. It does not explain why the intermediation itself relocated.',
        },
        {
          id: 'failure',
          label: 'Banks lost the ability to perform it',
          feedback:
            'They retained the capability and found it costly to use. That is the constraint in the answer, stated from the other side.',
        },
      ],
      correctOptionId: 'cost',
      explanation:
        'Capital and liquidity requirements raised the cost of holding certain assets on a bank balance sheet, so the activity moved to where those requirements do not apply. This is not an argument against the requirements — the banking system genuinely is safer — but it is an honest accounting of what was bought. Risk that leaves a supervised, backstopped sector for an unsupervised one without a backstop has not been eliminated; it has been relocated to where it is harder to see and harder to address. Every tightening of bank regulation should be accompanied by the question of where the activity will go.',
    },
    {
      id: 'mc-does-it-matter',
      type: 'multiple_choice',
      tags: ['non-banks', 'policy'],
      xp: 35,
      prompt:
        'A fund fails and its investors lose money. When does that become a central bank’s problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'firesale',
          label: 'When its forced selling sets everyone else’s price',
        },
        {
          id: 'size',
          label: 'When the fund is large enough',
          feedback:
            'Size matters through the channel in the answer. A large fund selling into a deep market does no damage; a small one selling into a frozen one can.',
        },
        {
          id: 'retail',
          label: 'When retail investors are the ones affected',
          feedback:
            'That is a consumer protection question for a conduct regulator. Losses alone, however painful, are not a systemic event.',
        },
        {
          id: 'banks',
          label: 'When banks turn out to be exposed to it',
          feedback:
            'A genuine channel, and the 2021 family office failure showed banks can lose billions without a systemic event. Contagion through prices is broader than contagion through counterparties.',
        },
      ],
      correctOptionId: 'firesale',
      explanation:
        'Investors losing money is a market functioning correctly. The systemic event is when selling to meet redemptions pushes prices down, which triggers losses and margin calls at everyone else holding those assets, which forces them to sell. That loop is the entire concern, and it explains the otherwise odd fact that central banks intervene in some fund failures and not others of similar size. The question is never whether the institution matters — it is whether the price it is selling at becomes everybody’s price.',
    },
  ],
  keyTakeaways: [
    'Runnability comes from the liquidity promise, not from the legal form.',
    'The same structure reappears as funds, insurers and stablecoins.',
    'Tighter bank rules relocated risk rather than removing it.',
    'A fund failure is systemic when its forced selling sets everyone’s price.',
  ],
});
