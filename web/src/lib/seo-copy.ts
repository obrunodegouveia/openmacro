/**
 * ============================================================================
 * Portuguese page copy for search results
 * ============================================================================
 *
 * The title and description are the whole of what a person sees before
 * deciding whether to click. A Portuguese page carrying an English title ranks
 * for English queries and reads, in the one place it matters most, as a page
 * that is not really in Portuguese.
 *
 * Overrides only. The English lives in each page file where it always has, so
 * this cannot quietly rewrite copy that is already ranking — a locale with no
 * entry here simply keeps what the page declares.
 *
 * These are written, not translated. A meta description is built around a
 * ~155-character truncation and around the words somebody actually types, and
 * the Portuguese phrases people search — "como o dinheiro é criado", "banco
 * central", "literacia financeira" — are not a word-for-word map of the
 * English ones. Spelling follows AO90, as the course does.
 */

import type { Locale } from '@openmacro/core/i18n/locales';

interface PageCopy {
  title: string;
  description: string;
  keywords?: string[];
}

/** Keyed by route path, exactly as it appears after the domain. */
const PT: Record<string, PageCopy> = {
  '/': {
    title: 'Aprende Como o Dinheiro Funciona',
    description:
      'Lições gratuitas e de código aberto sobre como o dinheiro é criado, o que fazem os bancos centrais e porque sobem os preços. Sem conta e sem registo.',
    keywords: [
      'como funciona o dinheiro',
      'como é criado o dinheiro',
      'o que faz um banco central',
      'literacia financeira',
      'política monetária',
      'banca de reservas fraccionárias',
      'ensinar dinheiro às crianças',
      'macroeconomia explicada',
    ],
  },
  '/learn': {
    title: 'Como Aprender Sobre Dinheiro',
    description:
      'Por onde começar para perceber como o dinheiro funciona: quem o cria, o que fazem os bancos centrais e porque sobem os preços. Gratuito e sem conta.',
    keywords: [
      'aprender sobre dinheiro',
      'como funciona o dinheiro',
      'aprender macroeconomia',
      'curso de política monetária',
      'como os bancos criam dinheiro',
    ],
  },
  '/glossary': {
    title: 'Glossário de Dinheiro e Banca Central',
    description:
      'Reservas, repo, QE, IORB, eurodólares e mais — cada termo explicado como movimentos de balanço, em português simples e com a fonte primária.',
    keywords: [
      'glossário de dinheiro',
      'glossário de banca central',
      'termos de política monetária',
      'o que é o QE',
      'o que são reservas bancárias',
    ],
  },
  '/teach': {
    title: 'Como Ensinar Dinheiro às Crianças',
    description:
      'O que ensinar em cada idade, como explicar a inflação e de onde vem o dinheiro dos bancos, mais lições gratuitas para jogar sem conta e sem rastreio.',
    keywords: [
      'ensinar dinheiro às crianças',
      'como explicar a inflação a uma criança',
      'lições de dinheiro para crianças',
      'literacia financeira nas escolas',
    ],
  },
  '/login': {
    title: 'Iniciar sessão',
    description:
      'Inicia sessão no OpenMacro com a Google para guardares os teus XP e a tua sequência de dias entre dispositivos. Todas as lições continuam gratuitas sem conta.',
    keywords: ['iniciar sessão openmacro', 'login openmacro', 'conta openmacro'],
  },
  '/privacy': {
    title: 'Privacidade e aviso COPPA',
    description:
      'O que o OpenMacro guarda, o que não guarda, e o que um encarregado de educação ou uma escola precisa de saber antes de uma criança o usar.',
  },
};

/**
 * Copy to merge over a page's English metadata.
 *
 * Empty for English by design: the page keeps exactly what it declares.
 */
export function localisedCopy(path: string, locale: Locale): Partial<PageCopy> {
  if (locale === 'en') return {};
  return PT[path] ?? {};
}
