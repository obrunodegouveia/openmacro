import { defineLesson } from '../../schema';

/**
 * How a war is paid for, and the conditions under which the bill arrives as
 * inflation.
 *
 * The claim this lesson is careful with: "deficits are paid by inflation".
 * Sometimes, and not always, and the difference is not a matter of opinion —
 * it turns on whether the spending runs into a capacity ceiling and on what
 * the central bank does. Overstating it would make the course worse at the
 * exact moment it is at its most useful, so the conditions are taught as the
 * content rather than left as a caveat.
 *
 * US figures: federal spending rose from about 10% of GDP in 1940 to over 40%
 * by 1944; measured consumer prices rose about 8.4% in 1942 and 3% in 1943
 * under the Emergency Price Control Act and rationing, then 8.5% in 1946 and
 * 14.4% in 1947 once controls came off.
 */
export const whoPaysForItLesson = defineLesson({
  id: 'who-pays-for-it',
  title: 'The Bill Arrives in One of Three Ways',
  subtitle:
    'Taxes, borrowing, or money creation. Which one you choose decides who pays and when, not whether.',
  icon: '🧾',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-real-constraint',
      type: 'multiple_choice',
      tags: ['gdp', 'war', 'capacity'],
      xp: 25,
      prompt:
        'An economy at full employment starts producing €20bn of war materiel a year. Where does the labour and steel come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'from-civilian',
          label: 'From civilian production, which shrinks by roughly as much',
        },
        {
          id: 'new-resources',
          label: 'From new resources the spending calls into being',
          feedback:
            'Below full employment that is partly true — idle workers and factories can be put back to work, which is why war spending can look like a free lunch in a slump. At full employment there is nothing idle to call on.',
        },
        {
          id: 'imports',
          label: 'From imports, so nothing domestic is displaced',
          feedback:
            'Imports have to be paid for in exports or borrowing, and they are subtracted from GDP. They move the constraint abroad; they do not remove it.',
        },
        {
          id: 'borrowing',
          label: 'From borrowing — the money buys resources that were not there',
          feedback:
            'Borrowing moves purchasing power between people. It cannot move steel that does not exist. This is the central confusion the lesson is about: finance decides who goes without, not whether anyone does.',
        },
      ],
      correctOptionId: 'from-civilian',
      explanation:
        'The real constraint is capacity, and money is how a society decides who bears the loss of it. That is why the same war can be financed three ways with three different-looking outcomes and the same underlying sacrifice: fewer cars, fewer houses, fewer shirts.',
    },
    {
      id: 'match-three-ways',
      type: 'concept_match',
      tags: ['fiscal', 'inflation', 'war-finance'],
      xp: 30,
      prompt: 'Match each way of paying for the spending to who actually bears it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'tax',
          term: 'Taxation',
          definition:
            'Today’s taxpayers, visibly — purchasing power is taken before it can compete for the goods that are left',
        },
        {
          id: 'borrow',
          term: 'Borrowing from savers',
          definition:
            'Those who lend give up spending now for a claim later; the burden lands on whoever is taxed to service it, which may be a different generation',
        },
        {
          id: 'print',
          term: 'Money creation',
          definition:
            'Everyone holding the currency, invisibly and in proportion to how much of it they hold — a tax nobody votes on',
        },
        {
          id: 'controls',
          term: 'Price controls and rationing',
          definition:
            'Nobody, on paper — the shortage shows up as queues, coupons and black markets instead of as a price',
        },
      ],
      explanation:
        'Only the first two are decided in the open. The third is the one that gives the phrase "paid by inflation" its meaning, and the fourth is what a state reaches for when it wants the third without the number appearing in the price index.',
    },
    {
      id: 'mc-deficit-inflation',
      type: 'multiple_choice',
      tags: ['deficits', 'inflation'],
      xp: 35,
      prompt:
        'Is a deficit automatically paid for by inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'conditional',
          label: 'No — it turns on spare capacity, and on who buys the debt',
        },
        {
          id: 'always',
          label: 'Yes — new spending always ends up chasing the same quantity of goods',
          feedback:
            'Only if the goods are fixed. With idle workers and factories, spending calls forth more output rather than higher prices — which is the whole case for deficit spending in a slump, and the reason 2009-2015 deficits in the US and euro area coincided with inflation persistently *below* target.',
        },
        {
          id: 'never',
          label: 'No — governments that borrow in their own currency can always repay',
          feedback:
            'They can always produce the currency, which is exactly why the risk is not default but what that currency ends up buying. Being able to pay is not the same as paying in something worth having.',
        },
        {
          id: 'only-war',
          label: 'Only for war spending, because the output is destroyed',
          feedback:
            'Destruction changes the capital stock, not the price level. What makes war spending inflationary is its size and speed against a capacity ceiling, not the fate of what it buys.',
        },
      ],
      correctOptionId: 'conditional',
      explanation:
        'Hold both halves. A deficit into an economy with slack can leave prices alone — Japan has run large deficits for three decades with inflation near zero. A deficit into a full-employment economy, financed by a central bank that will not let rates rise, is the textbook inflation, and wars produce it reliably because they are large, fast and land on an economy that is already working flat out. The mechanism is real. It is conditional, and the conditions are knowable.',
    },
    {
      id: 'mc-wwii-price-index',
      type: 'multiple_choice',
      tags: ['inflation', 'history', 'price-controls'],
      xp: 35,
      prompt:
        'US federal spending went from about 10% of GDP in 1940 to over 40% by 1944, yet measured consumer prices rose only about 3% in 1943. Then 1946 and 1947 came in at 8.5% and 14.4%. What happened?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'suppressed',
          label:
            'Price controls and rationing held the index down while the pressure built; it surfaced when they were lifted',
        },
        {
          id: 'no-inflation',
          label: 'There was no wartime inflation — the spending was genuinely non-inflationary',
          feedback:
            'Then nothing would have happened when the controls came off. A price index measures posted prices; it cannot see a queue, a coupon or a purchase that was illegal.',
        },
        {
          id: 'productivity',
          label: 'Wartime productivity growth absorbed the spending',
          feedback:
            'Output did rise enormously, and it went to the war. Civilian goods were scarce enough to be rationed — which is not what an economy looks like when supply has kept up.',
        },
        {
          id: 'postwar-boom',
          label: 'The 1946-47 inflation came from the postwar consumer boom, unrelated to the war',
          feedback:
            'The boom was savings accumulated during the war — forced savings, because there was nothing to buy — meeting goods for the first time. It is the same pressure, arriving late.',
        },
      ],
      correctOptionId: 'suppressed',
      explanation:
        'This is the most useful case in the module, because it shows the measurement and the mechanism coming apart. GDP rose spectacularly; living standards did not, and were rationed; measured inflation stayed modest; and the bill arrived anyway, two years later, at 14%. Anyone who wants to argue from wartime GDP figures has to deal with all four of those facts at once.',
    },
  ],
  keyTakeaways: [
    'The real constraint is capacity; finance decides who goes without, not whether anyone does.',
    'Money creation is a tax on everyone holding the currency, and nobody votes on it.',
    'Deficits are inflationary against a capacity ceiling — not automatically, and the conditions are knowable.',
    'A price index can be held down by controls while the pressure builds behind it.',
  ],
});
