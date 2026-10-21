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
    'Taxes, borrowing or printing money. The choice decides who pays and when. It does not decide whether someone pays.',
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
        'In an economy where everyone who wants a job has one, the state starts buying €20bn of war equipment a year. Where do the workers and the steel come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'from-civilian',
          label: 'From civilian production, which shrinks by about the same amount',
        },
        {
          id: 'new-resources',
          label: 'From new resources that the spending creates',
          feedback:
            'When many people are out of work, this is partly true: idle workers and factories can start again. That is why war spending can look free in a slump. But here nobody is idle, so there is nothing extra to use.',
        },
        {
          id: 'imports',
          label: 'From imports, so nothing at home is affected',
          feedback:
            'Imports must be paid for, with exports or with borrowing. They move the limit abroad. They do not remove it.',
        },
        {
          id: 'borrowing',
          label: 'From borrowing — the money buys things that were not there',
          feedback:
            'Borrowing moves money from some people to others. It cannot create steel that does not exist. Money decides who goes without, not whether anyone does.',
        },
      ],
      correctOptionId: 'from-civilian',
      explanation:
        'The real limit is how much the economy can make. Money only decides who loses out. So the same war can be paid for in three ways that look different, with the same real cost underneath: fewer cars, fewer houses, fewer shirts.',
    },
    {
      id: 'match-three-ways',
      type: 'concept_match',
      tags: ['fiscal', 'inflation', 'war-finance'],
      xp: 30,
      prompt: 'Match each way of paying for the spending to who really bears the cost.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'tax',
          term: 'Taxes',
          definition:
            'Today’s taxpayers, openly. Their money is taken before they can spend it on the goods that are left',
        },
        {
          id: 'borrow',
          term: 'Borrowing from savers',
          definition:
            'Lenders give up spending now to be repaid later. The cost falls on whoever is taxed to repay them, maybe years later',
        },
        {
          id: 'print',
          term: 'Printing money',
          definition:
            'Everyone who holds the currency, quietly, as their money buys less. It is a tax nobody votes on',
        },
        {
          id: 'controls',
          term: 'Price controls and rationing',
          definition:
            'Nobody, on paper. The shortage shows up as queues, coupons and black markets instead of higher prices',
        },
      ],
      explanation:
        'Only the first two are decided openly. The third is what people mean by “paid for by inflation”. The fourth is what a government uses when it wants the third without prices visibly rising.',
    },
    {
      id: 'mc-deficit-inflation',
      type: 'multiple_choice',
      tags: ['deficits', 'inflation'],
      xp: 35,
      prompt:
        'A government spends more than it collects in taxes (a deficit). Does that always cause inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'conditional',
          label: 'No — it depends on spare capacity, and on who buys the debt',
        },
        {
          id: 'always',
          label: 'Yes — new spending always chases the same amount of goods',
          feedback:
            'Only if the amount of goods cannot grow. With idle workers and factories, spending leads to more production, not higher prices. In 2009–2015 the US and the euro area had big deficits, and inflation stayed below target.',
        },
        {
          id: 'never',
          label: 'No — a government that borrows in its own currency can always repay',
          feedback:
            'It can always create more of its currency. That is the risk: not failing to pay, but paying in money that buys less.',
        },
        {
          id: 'only-war',
          label: 'Only for war spending, because what it buys is destroyed',
          feedback:
            'Destruction changes what a country owns, not prices. War spending causes inflation because it is big and fast, in an economy that is already at its limit.',
        },
      ],
      correctOptionId: 'conditional',
      explanation:
        'Both sides are true. A deficit in an economy with idle workers and factories can leave prices stable: Japan has run large deficits for thirty years with inflation near zero. A deficit in an economy already at its limit, with a central bank that keeps interest rates low, causes inflation. Wars do this often, because the spending is large and fast. So the effect is real, but it depends on conditions you can check.',
    },
    {
      id: 'mc-wwii-price-index',
      type: 'multiple_choice',
      tags: ['inflation', 'history', 'price-controls'],
      xp: 35,
      prompt:
        'US government spending rose from about 10% of GDP in 1940 to over 40% in 1944. Yet prices rose only about 3% in 1943. Then they rose 8.5% in 1946 and 14.4% in 1947. What happened?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'suppressed',
          label:
            'Price controls and rationing held prices down in the war; the pressure came out when they ended',
        },
        {
          id: 'no-inflation',
          label: 'There was no wartime inflation — the spending did not push up prices',
          feedback:
            'Then nothing would have happened when the controls ended. A price index only sees official prices. It cannot see queues, coupons or illegal sales.',
        },
        {
          id: 'productivity',
          label: 'Wartime factories became more productive and kept up with the spending',
          feedback:
            'Production did grow enormously, but it went to the war. Civilian goods were so scarce they were rationed. That is not what an economy looks like when supply keeps up.',
        },
        {
          id: 'postwar-boom',
          label: 'The 1946–47 inflation came from a postwar shopping boom, not from the war',
          feedback:
            'People saved during the war because there was nothing to buy. After the war that saved money met the shops at last. It is the same pressure, arriving late.',
        },
      ],
      correctOptionId: 'suppressed',
      explanation:
        'This case shows the numbers and the reality coming apart. GDP rose hugely, but daily life did not improve; goods were rationed. Measured inflation stayed low, but the bill still came two years later, at 14%. Anyone arguing from wartime GDP figures has to explain all of this.',
    },
  ],
  keyTakeaways: [
    'The real limit is how much the economy can make. Money only decides who goes without.',
    'Printing money is a tax on everyone who holds the currency, and nobody votes on it.',
    'Deficits cause inflation when the economy is at its limit. Not always, and you can check the conditions.',
    'Price controls can hold the price index down while the pressure builds up behind it.',
  ],
});
