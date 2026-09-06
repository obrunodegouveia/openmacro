import { defineLesson } from '../../schema';

/**
 * The mechanism named most often, posted by hand — and then dated, because
 * half of it no longer exists.
 *
 * The French government's own description of the 2019 UEMOA reform:
 * "Abolition of the obligation to centralize exchange reserves on a financial
 * account at the French Treasury", and "Since the reform of monetary
 * cooperation in the UEMOA announced in 2019, France no longer has a presence
 * in the governing bodies of the BCEAO." For CEMAC it still states that
 * "France has only minority representation within the monetary policy
 * committee and the board of governors of the BEAC (1 French governor out of
 * 7)". For the Comoros, of an eight-member board, "half of whom are designated
 * by the French Government".
 */
export const theOperationsAccountLesson = defineLesson({
  id: 'the-operations-account',
  title: 'The Account in Paris',
  subtitle:
    'Post the mechanism everyone names — then find out which half of the zone still has it.',
  icon: '🏦',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'operations-account-posting',
      type: 't_account_flow',
      tags: ['cfa', 'reserves', 'france'],
      xp: 30,
      prompt:
        'A CFA central bank places reserves in the operations account at the French Treasury. Post it.',
      instructions:
        'Two sheets. The question the posting answers is: who owns this money afterwards?',
      scenario:
        'Under the arrangement as it stood before 2020, and as it still stands for the BEAC, half of the central bank’s foreign exchange reserves are centralised in an account at the French Treasury. Here it moves €500m.',
      currency: 'EUR',
      entities: [
        {
          id: 'cb',
          label: 'The CFA Central Bank',
          tier: 'central_bank',
          role: 'Issuer of the CFA franc',
          openingLines: [
            { account: 'Deposits with banks abroad', side: 'asset', amount: 3000000000 },
            { account: 'Operations account at the French Treasury', side: 'asset', amount: 2000000000 },
            { account: 'Currency in circulation', side: 'liability', amount: 5000000000 },
          ],
        },
        {
          id: 'treasury',
          label: 'French Treasury',
          tier: 'fiduciary_core',
          role: 'Holds the account, pays interest on it, guarantees convertibility',
          openingLines: [
            { account: 'Cash at the Banque de France', side: 'asset', amount: 40000000000 },
            { account: 'Operations accounts owed to CFA central banks', side: 'liability', amount: 2000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'cb-ops-up',
          shift: {
            entityId: 'cb',
            side: 'asset',
            account: 'Operations account at the French Treasury',
            delta: 500000000,
          },
        },
        {
          id: 'cb-banks-down',
          shift: {
            entityId: 'cb',
            side: 'asset',
            account: 'Deposits with banks abroad',
            delta: -500000000,
          },
        },
        {
          id: 'tr-cash-up',
          shift: {
            entityId: 'treasury',
            side: 'asset',
            account: 'Cash at the Banque de France',
            delta: 500000000,
          },
        },
        {
          id: 'tr-owed-up',
          shift: {
            entityId: 'treasury',
            side: 'liability',
            account: 'Operations accounts owed to CFA central banks',
            delta: 500000000,
          },
        },
        {
          id: 'cb-currency-down',
          shift: {
            entityId: 'cb',
            side: 'liability',
            account: 'Currency in circulation',
            delta: -500000000,
          },
          feedback:
            'No CFA francs were withdrawn from circulation. The central bank moved one of its own assets from one custodian to another; what it owes the public is unchanged.',
        },
        {
          id: 'tr-gift',
          shift: {
            entityId: 'treasury',
            side: 'liability',
            account: 'Operations accounts owed to CFA central banks',
            delta: -500000000,
          },
          feedback:
            'The wrong sign, and it is the most revealing wrong answer available. Receiving the deposit makes the Treasury owe *more*, not less. If the money were confiscated it would appear as Treasury income — and it never has.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'cb',
          side: 'asset',
          account: 'Operations account at the French Treasury',
          delta: 500000000,
        },
        {
          entityId: 'cb',
          side: 'asset',
          account: 'Deposits with banks abroad',
          delta: -500000000,
        },
        {
          entityId: 'treasury',
          side: 'asset',
          account: 'Cash at the Banque de France',
          delta: 500000000,
        },
        {
          entityId: 'treasury',
          side: 'liability',
          account: 'Operations accounts owed to CFA central banks',
          delta: 500000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'No CFA francs created or destroyed. This is a reserve manager choosing a custodian — except that it was not choosing.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'The same claims exist, held by the same central bank, in a different place.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Nothing in the domestic money supply of any member state moved.',
        },
      ],
      explanation:
        'The posting settles one question and sharpens another. The money is not taken: it sits on the Treasury’s books as a debt owed to the African central bank, and it earned interest. So "France holds their money" is true in the sense that a bank holds your deposit. What the posting cannot show is the thing that actually mattered — that the central bank was obliged to put it there, could not invest it as it chose, and needed the account to run through Paris at all.',
    },

    {
      id: 'mc-what-changed',
      type: 'multiple_choice',
      tags: ['cfa', 'reform', 'france'],
      xp: 25,
      prompt:
        'The 2019 reform of the West African arrangement changed some things and kept others. Which describes it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reserves-and-seats-gone',
          label: 'The reserve obligation and France’s seats went; the euro peg and the French guarantee stayed',
        },
        {
          id: 'everything-gone',
          label: 'The whole arrangement ended and the BCEAO is now fully independent',
          feedback:
            'The peg at 655.957 is untouched and France still guarantees convertibility. The binding constraint on monetary policy — the fixed rate — is exactly where it was.',
        },
        {
          id: 'nothing',
          label: 'Nothing substantive changed; it was a rebranding',
          feedback:
            'Two concrete things ended: the obligation to centralise reserves at the French Treasury, and French presence in the BCEAO’s governing bodies. Both are stated by the French government itself.',
        },
        {
          id: 'peg-gone',
          label: 'The peg was dropped but the institutional links remained',
        },
      ],
      correctOptionId: 'reserves-and-seats-gone',
      explanation:
        'This is the single most important update to the standard account. The two features that make the best headlines — money held in Paris, French officials in the room — were removed for West Africa around 2020. The feature that does the most economic work every single day, the fixed exchange rate, was deliberately kept. Any argument still built on the operations account is describing Central Africa and the Comoros, not the eight UEMOA states.',
    },

    {
      id: 'mc-three-arrangements',
      type: 'multiple_choice',
      tags: ['cfa', 'comparison'],
      xp: 25,
      prompt:
        'Comparing the three arrangements today, which has the deepest formal French involvement?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'comoros',
          label: 'The Comoros — half of the central bank’s eight-member board is designated by France',
        },
        {
          id: 'uemoa',
          label: 'UEMOA, the largest zone',
          feedback:
            'The opposite: it is the one where France left the governing bodies and the reserve obligation ended. Size and depth of involvement point different ways here.',
        },
        {
          id: 'cemac',
          label: 'CEMAC, where France holds one governor of seven',
          feedback:
            'More than UEMOA, less than the Comoros. One seat of seven is a minority; half the board is not.',
        },
        {
          id: 'equal',
          label: 'All three are identical',
        },
      ],
      correctOptionId: 'comoros',
      explanation:
        'Three arrangements, three degrees, and the ranking is not the one most people would guess. The smallest and least discussed — a country of under a million people — retains the deepest formal role for France, while the largest zone has the least. That spread is useful: it means the region offers something close to a natural experiment, and the next lesson uses it.',
    },

    {
      id: 'mc-guarantee-price',
      type: 'multiple_choice',
      tags: ['cfa', 'guarantee', 'france'],
      xp: 25,
      prompt:
        'France guarantees unlimited convertibility of the CFA franc into euro. What does that guarantee actually buy, and what does it cost France?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'credibility-contingent',
          label: 'It buys a peg nobody has successfully attacked; it costs France a contingent liability that has rarely been drawn',
        },
        {
          id: 'free-money',
          label: 'It is a transfer from France, funded by French taxpayers each year',
          feedback:
            'There is no annual payment. It is a promise to lend if the reserves run out, and the promise has been called on rarely — which is a real commitment, but not a subsidy line in a budget.',
        },
        {
          id: 'nothing',
          label: 'Nothing — it is symbolic',
          feedback:
            'You have just spent a module on 1992 finding out what an unguaranteed peg is worth. A credible guarantor is precisely what sterling did not have, and it is why the CFA has never faced a comparable attack.',
        },
        {
          id: 'reserves',
          label: 'It buys France the use of the reserves',
        },
      ],
      correctOptionId: 'credibility-contingent',
      explanation:
        'Compare this with the sterling module. Britain’s peg failed because a speculator could out-borrow its finite reserves — there was no backstop. A CFA speculator faces a guarantor with unlimited euro access, which is why the trade has never been attempted at scale. That is a genuine benefit. Whether the price paid for it is worth it is the question the last two lessons take seriously, and it is not answered by the guarantee being real.',
    },
  ],
  keyTakeaways: [
    'The operations account is a deposit: it sits on the French Treasury’s books as a debt owed, and it paid interest.',
    'What mattered was not confiscation but obligation — the central bank could not choose where to hold it.',
    'For UEMOA, that obligation and France’s board seats ended around 2020. The peg and the guarantee stayed.',
    'The deepest remaining French role is in the Comoros, not in the two large zones.',
  ],
});
