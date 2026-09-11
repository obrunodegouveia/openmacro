import type { ContentDictionary } from '../../localise';

/**
 * ============================================================================
 * Module titles and descriptions — European Portuguese
 * ============================================================================
 *
 * Thirty-four strings that buy the entire learning path.
 *
 * It is by far the best value in the whole translation project, and worth
 * doing for a language before anything else. The path screen is the first
 * thing anybody sees and the only screen every learner visits; translating
 * just these makes the course look like it speaks Portuguese, while the
 * lessons behind them catch up module by module.
 *
 * The alternative ordering — translate module 1 completely, then module 2 —
 * produces an app whose home screen is entirely in English for months.
 */
export const headingsPtPT: Record<string, ContentDictionary> = {
  // `start-here` is translated in full in `start-here.ts`; its heading lives
  // there with the rest of it rather than being split across two files.

  'foundations-fiduciary-currency': {
    'module.title': 'Fundamentos da Moeda Fiduciária',
    'module.description':
      'Porque é que se aceita papel sem lastro, o que é realmente a inflação, e o que se parte quando uma moeda falha.',
  },

  'commercial-central-interface': {
    'module.title': 'A Interface entre Banca Comercial e Banco Central',
    'module.description':
      'Como se liquida realmente um pagamento, porque é que os bancos têm reservas, e o que limita mesmo o crédito.',
  },

  'fed-ecb-levers': {
    'module.title': 'As Alavancas da Fed e do BCE',
    'module.description':
      'IORB, o piso da ON RRP, a janela de redesconto e o corredor da DFR — lançamento a lançamento.',
  },

  'crisis-architecture-global-dollar': {
    'module.title': 'Arquitetura de Crise e o Dólar Global',
    'module.description':
      'Dólares offshore, linhas de swap, resolução e o laço fatal — e como distinguir um tipo de crise de outro.',
  },

  'reading-the-fed-balance-sheet': {
    'module.title': 'Ler o Balanço da Fed',
    'module.description':
      'O H.4.1 verdadeiro, linha a linha: o que a Fed tem, quem detém o seu passivo, e porque é que as reservas são o que sobra. Números tal como reportados a 2 de setembro de 2026.',
  },

  'reading-the-ecb-balance-sheet': {
    'module.title': 'Ler o Balanço do BCE',
    'module.description':
      'A situação semanal do Eurosistema face à da Fed: um quinto dela em ouro, duas contas de reservas em vez de uma, e um quadro de cedência de que já não precisa. Números a 28 de agosto de 2026.',
  },

  'the-treasury-yield-curve': {
    'module.title': 'A Curva de Rendimentos do Tesouro',
    'module.description':
      'Um só devedor, onze maturidades, onze taxas. Porque é que preço e yield são o mesmo número, o que diz realmente uma inversão, e como ler a curva tal como publicada a 3 de setembro de 2026.',
  },

  'debt-debasement-and-capital': {
    'module.title': 'Dívida, Aviltamento da Moeda e Capital',
    'module.description':
      'Quem paga de facto uma dívida que nunca é reembolsada, o que o aviltamento da moeda historicamente serviu para financiar, e o que os mesmos recursos constroem quando vão antes para capital.',
  },

  'breaking-a-peg-1992': {
    'module.title': 'Quebrar uma Paridade: setembro de 1992',
    'module.description':
      'A operação sobre a libra, feita em contas e não em anedota: porque é que a posição no MTC era insustentável, porque é que atacar uma paridade só custa o carry, o que se gasta de facto a defendê-la, e a aritmética da Quarta-Feira Negra.',
  },

  'the-bis-and-the-ecb': {
    'module.title': 'O BIS e o BCE',
    'module.description':
      'Que canais de influência entre Basileia e Frankfurt são reais: normas que têm de passar por um parlamento, investigação que fixa os termos do debate, estatísticas que mais ninguém recolhe — e quais funcionam ao contrário.',
  },

  'african-central-banks': {
    'module.title': 'Bancos Centrais Africanos e o Franco CFA',
    'module.description':
      'Catorze países, duas moedas com o mesmo nome, e uma paridade fixada em 655,957 desde 1999. O que era a conta em Paris, o que mudou em 2020, e quem suporta o custo de uma taxa que não se pode mexer.',
  },

  'real-assets-and-property': {
    'module.title': 'Ativos Reais e o Preço de uma Morada',
    'module.description':
      'O dinheiro cresceu 69%, os preços no consumidor 32%, as casas 60%. Porque é que ter imóveis durante isso transfere riqueza de quem tinha euros, o que põe um chão debaixo de um preço — e porque é que Dublin ainda assim caiu para metade.',
  },

  euribor: {
    'module.title': 'Euribor',
    'module.description':
      'A taxa a que é revisto quase todo o crédito à habitação da zona euro, e que quase ninguém sabe definir bem. O que mede, porque é que se mexe antes do BCE, quanto custa uma revisão — e cinco perguntas que separam saber de perceber.',
  },

  'buying-property-portugal': {
    'module.title': 'Comprar Casa em Portugal: As Contas',
    'module.description':
      'IMT, Imposto do Selo, IMI, manutenção e a comissão da imobiliária, ao euro — e quantos anos de valorização são precisos para os cobrir. Depois comprar contra arrendar, e o mesmo apartamento comprado só para dar lucro.',
  },

  'scrutinising-cbdcs': {
    'module.title': 'Analisar as CBDC: o Projeto Mariana',
    'module.description':
      'Uma experiência do BIS, lida como deve ser. O que uma CBDC grossista muda e o que não muda, o que a Mariana construiu de facto, quanto custa a liquidação instantânea em liquidez parada, que funcionalidades de controlo são novas — e quem teria de dizer que sim antes de qualquer disto ser dinheiro.',
  },

  'banking-and-money': {
    'module.title': 'Banca e Dinheiro (Khan Academy)',
    'module.description':
      'Sal Khan constrói o sistema bancário a partir de uma ilha, um cofre e mil moedas de ouro — passando pelas reservas fracionárias, a alavancagem, o banco central e as operações de mercado aberto, até ao balanço real da Fed. Vinte e cinco vídeos, cada um com perguntas escritas a partir do que ele diz de facto, a acabar no argumento dele próprio contra o sistema que acabou de explicar.',
  },
};

/** The course itself — the tagline under the logo on the path screen. */
export const coursePtPT: ContentDictionary = {
  'course.title': 'Fundamentos de Macroeconomia',
  'course.description':
    'Dinheiro, banca e política monetária — construídos desde o princípio, cinco minutos de cada vez.',
};
