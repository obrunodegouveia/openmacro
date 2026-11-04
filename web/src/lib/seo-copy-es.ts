/**
 * Spanish (Spain) page copy for search results, an overlay on each page's
 * English metadata.
 *
 * Written, not translated, around a ~155-character truncation and the words
 * somebody actually types: "cómo funciona el dinero", "qué hace un banco
 * central", "educación financiera". `tú`, Banco de España / BCE terminology,
 * acronyms untouched.
 */

import type { PageCopy } from '@/lib/seo-copy';

export const SEO_ES: Record<string, PageCopy> = {
  '/': {
    title: 'Aprende Cómo Funciona el Dinero',
    description:
      'Lecciones gratis y de código abierto sobre cómo se crea el dinero, qué hace un banco central y por qué suben los precios. Sin cuenta y sin registro.',
    keywords: [
      'cómo funciona el dinero',
      'cómo se crea el dinero',
      'qué hace un banco central',
      'educación financiera',
      'política monetaria',
      'banca de reserva fraccionaria',
      'enseñar a los niños sobre el dinero',
      'macroeconomía explicada',
    ],
  },
  '/learn': {
    title: 'Cómo Aprender Sobre el Dinero',
    description:
      'Por dónde empezar para entender cómo funciona el dinero: quién lo crea, qué hace un banco central y por qué suben los precios. Gratis y sin cuenta.',
    keywords: [
      'aprender sobre el dinero',
      'cómo funciona el dinero',
      'aprender macroeconomía',
      'curso de política monetaria',
      'cómo crean dinero los bancos',
    ],
  },
  '/glossary': {
    title: 'Glosario de Dinero y Banca Central',
    description:
      'Reservas, repo, QE, IORB, eurodólares y más: cada término explicado como movimientos de balance, en español sencillo y con la fuente primaria.',
    keywords: [
      'glosario de dinero',
      'glosario de banca central',
      'términos de política monetaria',
      'qué es la expansión cuantitativa',
      'qué son las reservas bancarias',
    ],
  },
  '/teach': {
    title: 'Cómo Enseñar a los Niños Sobre el Dinero',
    description:
      'Qué enseñar a cada edad, cómo explicar la inflación y de dónde sale el dinero de los bancos, con lecciones gratis para hacer sin cuenta y sin rastreo.',
    keywords: [
      'enseñar a los niños sobre el dinero',
      'cómo explicar la inflación a un niño',
      'educación financiera para niños',
      'educación financiera en el colegio',
    ],
  },
  '/login': {
    title: 'Iniciar sesión',
    description:
      'Inicia sesión en OpenMacro con Google para guardar tus XP y tu racha de días entre dispositivos. Todas las lecciones siguen siendo gratis sin cuenta.',
    keywords: ['iniciar sesión openmacro', 'login openmacro', 'cuenta openmacro'],
  },
  '/privacy': {
    title: 'Privacidad y aviso COPPA',
    description:
      'Qué guarda OpenMacro, qué no guarda y qué necesita saber una familia o un colegio antes de que un niño lo use.',
  },
};
