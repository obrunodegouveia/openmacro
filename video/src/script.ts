/**
 * ============================================================================
 * The script, and the numbers behind it
 * ============================================================================
 *
 * Every figure on screen is computed by the same functions the course grades
 * with — `debt_snowball` and `nominal_growth_from_productivity` from
 * `packages/core`. Nothing here is typed in by hand.
 *
 * That is the point of rendering video out of this repository rather than in
 * an editor: a lesson and its explainer cannot drift apart, because they are
 * the same arithmetic. Change the formula and the video changes with it.
 */

import { FORMULAS } from '@openmacro/core/content/formulas';

/** Fixed for the whole video, matching the lesson's simulation. */
const DEBT_RATIO = 1;
const INTEREST_RATE = 0.04;
const LABOUR_FORCE_GROWTH = 0.005;

export interface Scenario {
  productivityGrowth: number;
  inflationRate: number;
}

export interface Computed {
  nominalGrowth: number;
  /** Change in debt-to-GDP per year, from interest and growth alone. */
  snowball: number;
}

export function compute({ productivityGrowth, inflationRate }: Scenario): Computed {
  const nominalGrowth = FORMULAS.nominal_growth_from_productivity({
    productivityGrowth,
    labourForceGrowth: LABOUR_FORCE_GROWTH,
    inflationRate,
  });
  const snowball = FORMULAS.debt_snowball({
    debtRatio: DEBT_RATIO,
    interestRate: INTEREST_RATE,
    growthRate: nominalGrowth,
  });
  return { nominalGrowth, snowball };
}

/** Where the productivity gain lands, which is the whole argument. */
export const BASELINE: Scenario = { productivityGrowth: 0.015, inflationRate: 0.02 };
export const KEPT: Scenario = { productivityGrowth: 0.04, inflationRate: 0.02 };
export const GIVEN_AWAY: Scenario = { productivityGrowth: 0.04, inflationRate: 0 };

export const COPY = {
  en: {
    hook: 'America owes about $30 trillion.',
    hookSub: 'Why is that not a crisis?',
    race: 'Because a debt ratio is a race between two numbers.',
    raceSub: 'What the debt costs, against how fast the economy grows.',
    lever: 'Productivity is the lever that helps twice.',
    leverSub: 'It raises growth, and it lowers the cost of making things.',
    twist: 'But a productivity gain has to land somewhere.',
    twistSub: 'As more output — or as lower prices.',
    keptLabel: 'Taken as output',
    keptSub: 'inflation held at target',
    givenLabel: 'Taken as lower prices',
    givenSub: 'inflation falls to zero',
    punch: 'You cannot spend it twice.',
    punchSub: 'The debt is paid out of nominal growth. Only one of these delivers it.',
    outro: 'openmacro.org',
    outroSub: 'Free, open source, no account needed.',
    perYear: 'debt ratio, per year',
    growthLabel: 'nominal growth',
  },
  'pt-PT': {
    hook: 'A América deve cerca de 30 biliões de dólares.',
    hookSub: 'Porque é que isso não é uma crise?',
    race: 'Porque um rácio de dívida é uma corrida entre dois números.',
    raceSub: 'Quanto custa a dívida, contra a rapidez a que a economia cresce.',
    lever: 'A produtividade é a alavanca que ajuda duas vezes.',
    leverSub: 'Aumenta o crescimento e baixa o custo de produzir.',
    twist: 'Mas um ganho de produtividade tem de aterrar algures.',
    twistSub: 'Como mais produção — ou como preços mais baixos.',
    keptLabel: 'Levado como produção',
    keptSub: 'inflação mantida no objetivo',
    givenLabel: 'Levado como preços mais baixos',
    givenSub: 'a inflação cai para zero',
    punch: 'Não o podes gastar duas vezes.',
    punchSub: 'A dívida é paga com crescimento nominal. Só um destes o entrega.',
    outro: 'openmacro.org',
    outroSub: 'Gratuito, código aberto, sem conta.',
    perYear: 'rácio da dívida, por ano',
    growthLabel: 'crescimento nominal',
  },
} as const;

export type Locale = keyof typeof COPY;
