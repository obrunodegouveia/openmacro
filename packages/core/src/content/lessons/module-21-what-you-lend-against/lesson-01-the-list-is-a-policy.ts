import { defineLesson } from '../../schema';

/**
 * Eligibility. The least discussed instrument a central bank holds, and the
 * one that quietly decides what the banking system owns.
 */
export const theListIsAPolicyLesson = defineLesson({
  id: 'the-list-is-a-policy',
  title: 'The List Is an Instrument',
  subtitle:
    'Publish what you will lend against and you have decided what every bank wants to hold. Nobody calls this monetary policy.',
  icon: '📋',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-eligibility-creates-demand',
      type: 'multiple_choice',
      tags: ['collateral', 'eligibility'],
      xp: 30,
      prompt:
        'A central bank adds a class of bonds to its list of eligible collateral. What happens to those bonds?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'demand',
          label: 'They become more valuable, because they can now be turned into cash on any day',
        },
        {
          id: 'nothing',
          label: 'Nothing, until someone actually pledges them',
          feedback:
            'The option has value before it is exercised. A bond you can always convert into central bank money is a different instrument from one you can only sell to whoever is buying — and it is priced as one, immediately.',
        },
        {
          id: 'riskier',
          label: 'They are treated as riskier, since the central bank had to intervene',
          feedback:
            'Inclusion is read as the opposite: a statement that this asset can be relied on for funding in a stress.',
        },
        {
          id: 'supply',
          label: 'More of them are issued, with no effect on price',
          feedback:
            'Issuance usually does rise, which is the second-round effect. It happens *because* the price rose and the funding advantage appeared.',
        },
      ],
      correctOptionId: 'demand',
      explanation:
        'Eligibility is a put option written by the central bank and handed out for free. An eligible bond can be turned into cash on any day at a known haircut, which makes it worth holding for reasons that have nothing to do with its yield or its issuer. Banks therefore tilt their portfolios towards the list — and the list is drawn up by a committee that mostly thinks of itself as managing risk to its own balance sheet.',
    },
    {
      id: 'match-eligibility-criteria',
      type: 'concept_match',
      tags: ['collateral', 'eligibility'],
      xp: 30,
      prompt: 'Four tests an asset has to pass. Match each to what it is protecting against.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'credit',
          term: 'A credit quality threshold',
          definition: 'The issuer defaulting while you hold the asset as security',
        },
        {
          id: 'valuation',
          term: 'A reliable daily price',
          definition: 'Not knowing what you are holding — you cannot haircut what you cannot value',
        },
        {
          id: 'legal',
          term: 'Legal certainty of the claim',
          definition: 'Discovering in a court, after the borrower has failed, that the security was not yours',
        },
        {
          id: 'correlation',
          term: 'Close links between issuer and borrower',
          definition: 'Collateral that becomes worthless at the exact moment the borrower fails',
        },
      ],
      explanation:
        'The fourth is the subtle one and the one that matters most in a crisis. A bank pledging bonds issued by its own government, in a country whose banks and sovereign fail together, has handed you security that evaporates precisely when you need it. The rule against own-use collateral exists for that reason, and the euro area spent 2010 to 2012 discovering how hard it is to enforce the principle when the correlation is between a bank and its own state.',
    },
    {
      id: 'mc-btfp',
      type: 'multiple_choice',
      tags: ['collateral', 'crisis', 'history'],
      xp: 35,
      prompt:
        'In March 2023 the Fed created a facility that lent against bonds valued at *par* — their face value — rather than at market price, for banks holding securities worth less than they paid. What did that do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'removes-forced-sale',
          label: 'It removed the reason to sell at a loss, which was the mechanism killing those banks',
        },
        {
          id: 'gift',
          label: 'It handed banks the difference between par and market value',
          feedback:
            'It lent against that difference; it did not give it away. The loan is repaid and the bonds come back — which is exactly the distinction between liquidity support and a subsidy, and it is thinner here than usual.',
        },
        {
          id: 'illegal',
          label: 'It broke the rule that a central bank lends only against good collateral',
          feedback:
            'The collateral was US Treasuries — as good as it gets on credit. The question was valuation, not quality, and valuing a hold-to-maturity bond at par is defensible if the holder is not forced to sell.',
        },
        {
          id: 'inflation',
          label: 'It expanded the money supply and added to inflation',
          feedback:
            'It did expand the balance sheet, and the amounts were small against the aggregate. The effect being sought was on one specific failure mechanism.',
        },
      ],
      correctOptionId: 'removes-forced-sale',
      explanation:
        'Read it against the previous module. Those banks were killed by having to sell bonds early to meet withdrawals, converting a paper loss into a real one. Lending against those same bonds at par removes the need to sell — the loss stays unrealised and the bank survives to hold them to maturity. That is the collateral framework being used as the crisis instrument, and it was decided in a weekend by changing one valuation rule. No interest rate was involved.',
    },
    {
      id: 'mc-what-it-decides',
      type: 'multiple_choice',
      tags: ['collateral', 'allocation'],
      xp: 35,
      prompt:
        'Why is the collateral framework sometimes described as the most political instrument a central bank holds, despite never being debated?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'allocation',
          label: 'It decides which borrowers are cheapest to fund',
        },
        {
          id: 'secret',
          label: 'It is decided in private, away from any published debate',
          feedback:
            'The lists and haircut schedules are published in detail. Being public and being noticed are different things, and this is the clearest case of the second.',
        },
        {
          id: 'legal',
          label: 'It requires legislation in most jurisdictions',
          feedback:
            'It is usually an operational decision within an existing mandate, which is precisely why it attracts no debate.',
        },
        {
          id: 'size',
          label: 'The sums involved are larger than asset purchases',
          feedback:
            'Usually much smaller. The influence comes from what the framework makes attractive to hold, not from the amount lent.',
        },
      ],
      correctOptionId: 'allocation',
      explanation:
        'Make a class of asset eligible and lending against it becomes cheaper, so more of it is issued and held. The previous module argued that a central bank picking sectors is doing industrial policy without a mandate — and the collateral framework does a quieter version of that every day, by deciding whose paper is money-like and whose is not. The proposals to tilt it towards green assets are not introducing a new power. They are proposing to use an existing one on purpose.',
    },
  ],
  keyTakeaways: [
    'Eligibility is a free put option, and it is priced the moment it is granted.',
    'Collateral correlated with the borrower fails exactly when it is needed.',
    'Changing one valuation rule can defuse a crisis without touching the policy rate.',
    'Deciding whose paper is money-like is credit allocation, whether or not it is called that.',
  ],
});
