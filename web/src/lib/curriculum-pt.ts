/**
 * The syllabus and the four-tier model in European Portuguese.
 *
 * Track titles are absent on purpose — they come from the course catalogue,
 * which already has them. What is here is the copy that exists only on the
 * site: what a learner will be able to do, and the instruments named as chips.
 *
 * Instrument names keep their published form. Fedwire, TARGET2, SOFR, €STR,
 * IORB, ON RRP, H.4.1, IMT and VPT are what the things are called; the
 * sentences around them are Portuguese.
 */

import type { CurriculumOverlay } from '@/lib/curriculum-locale';

export const CURRICULUM_PT: CurriculumOverlay = {
  tiers: {
    central_bank: {
      name: 'O Banco Central',
      subject: 'A Fed e o BCE',
      premise:
        'O único balanço que liquida todos os outros. Os seus passivos são a base do sistema.',
      assets: ['Obrigações soberanas', 'Títulos privados (APP/PEPP)', 'Ouro e reservas cambiais', 'Empréstimos de desconto'],
      liabilities: ['Notas em circulação', 'Reservas dos bancos comerciais (M0)', 'Repos invertidos', 'Tesouraria do Estado (TGA)'],
      levers: ['IORB', 'ON RRP', 'Taxa da facilidade de depósito do BCE', 'MRO', 'QE / QT'],
    },
    commercial_bank: {
      name: 'A Camada Comercial',
      subject: 'Bancos que recebem depósitos',
      premise:
        'Onde é criada a maior parte do dinheiro que gastas de facto — emprestando, não imprimindo.',
      assets: ['Empréstimos e crédito à habitação', 'Depósitos de reserva no banco central', 'Carteira de títulos'],
      liabilities: ['Depósitos de clientes (M1/M2)', 'Financiamento interbancário', 'Capital'],
      levers: ['Os empréstimos criam depósitos', 'Gestão de reservas', 'Compensação e liquidação', 'Corridas aos bancos'],
    },
    shadow_bank: {
      name: 'Banca Paralela e Mercados Monetários',
      subject: 'Fundos monetários, dealers, mesas de repo',
      premise:
        'Financiamento à maneira de um banco sem licença bancária — e sem acesso a reservas.',
      assets: ['Direitos de repo e repo invertido', 'Colateral do Tesouro', 'Papel comercial'],
      liabilities: ['Participações em fundos', 'Financiamento por repo', 'Depósitos em eurodólares'],
      levers: ['O sistema do eurodólar', 'Capacidade de balanço dos dealers', 'Reutilização de colateral', 'SOFR e €STR'],
    },
    fiduciary_core: {
      name: 'O Núcleo Fiduciário',
      subject: 'O Estado e o quadro legal',
      premise:
        'Porque é que um token sem cobertura é sequer aceite: obrigações fiscais, curso legal e confiança institucional.',
      assets: ['Direitos fiscais futuros', 'Infra-estrutura pública'],
      liabilities: ['Dívida soberana', 'A própria moeda'],
      levers: ['Cartalismo e procura induzida por impostos', 'Lei do curso legal', 'Câmbios fixos', 'Confiança e credibilidade'],
    },
  },

  tracks: {
    'start-here': {
      promise:
        'Perceber o número na tua app bancária, e porque é que uma decisão em Frankfurt chega ao teu crédito à habitação.',
      concepts: ['Depósitos como promessas', 'O que é um banco', 'O que paga uma taxa de juro', 'Quem manda e quem não manda', 'O que a inflação faz e a quem'],
    },
    'foundations-fiduciary-currency': {
      promise:
        'Explicar porque é que um papel sem cobertura é sequer aceite — sem acenos vagos à confiança.',
      concepts: ['De tokens-mercadoria ao cartalismo', 'Curso legal e obrigações fiscais', 'Poder de compra', 'Câmbios fixos e cobertura por reservas'],
    },
    'commercial-central-interface': {
      promise:
        'Seguir um pagamento de um banco para outro e dizer exactamente o que liquida, e em quê.',
      concepts: ['Banca correspondente', 'Fedwire e TARGET2', 'Reservas fraccionárias', 'SOFR e €STR'],
    },
    'fed-ecb-levers': {
      promise:
        'Lançar tu próprio todas as grandes operações de política monetária — QE, o piso, o corredor, a janela.',
      concepts: ['IORB e o corredor da SOFR', 'O piso da ON RRP', 'Janela de desconto', 'DFR', 'MRO e TLTRO', 'Controlo da curva de rendimentos'],
    },
    'crisis-architecture-global-dollar': {
      promise:
        'Seguir o sistema do dólar offshore, e ler um resgate enquanto acontece em vez de depois.',
      concepts: ['Linhas de swap entre bancos centrais', 'Emprestador de último recurso', 'Bail-in contra bail-out', 'Apertos de eurodólares'],
    },
    'reading-the-fed-balance-sheet': {
      promise:
        'Abrir o comunicado que a Fed publicou esta semana e lê-lo sem tradutor.',
      concepts: ['O comunicado H.4.1', 'Conta Geral do Tesouro', 'As reservas como residual', 'A drenagem da ON RRP', 'QT contra crescimento do balanço'],
    },
    'reading-the-ecb-balance-sheet': {
      promise:
        'Ler a situação financeira semanal do Eurosistema, e saber que partes da da Fed eram escolhas.',
      concepts: ['A situação financeira semanal', 'Ouro e contas de reavaliação', 'Facilidade de depósito contra contas correntes', 'A €STR sob o piso', 'Dois bancos centrais a divergir'],
    },
    'the-treasury-yield-curve': {
      promise:
        'Olhar para onze números e dizer o que o mercado acha que aí vem.',
      concepts: ['Taxas ao par e prémio de prazo', 'Preço', 'rendimento e duração', 'Inversão e o que diz', 'Inclinações de alta e de baixa'],
    },
    'debt-debasement-and-capital': {
      promise:
        'Descobrir quem paga uma dívida que nunca é reembolsada, e o que os mesmos recursos construiriam em vez disso.',
      concepts: ['O imposto inflacionário', 'Financiar guerras ao longo dos tempos', 'r − g e a trajectória da dívida', 'Formação e afectação de capital'],
    },
    'breaking-a-peg-1992': {
      promise:
        'Calcular tu a operação sobre a libra, e saber porque é que a defesa não podia ganhar.',
      concepts: ['O MTC e o trilema', 'Vender a descoberto uma moeda com câmbio fixo', 'Custo de carregamento contra ganho da desvalorização', 'Intervenção e esterilização', 'Reflexividade à escala'],
    },
    'the-bis-and-the-ecb': {
      promise:
        'Distinguir os canais reais de influência entre Basileia e Frankfurt dos imaginados.',
      concepts: ['Um banco para bancos centrais', 'As normas de Basileia na lei da UE', 'Independência dos bancos centrais', 'Influência sem autoridade'],
    },
    'african-central-banks': {
      promise:
        'Ler um arranjo monetário bem o suficiente para nomear quem suporta cada custo e quem fica com cada benefício.',
      concepts: ['Dois francos CFA', 'dois bancos centrais', 'A conta de operações', 'e a reforma de 2020', 'Política monetária importada', 'Apreciação real sob câmbio fixo', 'Quem ganha com uma taxa fixa'],
    },
    'real-assets-and-property': {
      promise:
        'Descobrir quem paga um boom imobiliário, e o que teria de ser verdade para que revertesse.',
      concepts: ['Activos reais contra direitos nominais', 'O efeito Cantillon', 'O crédito à habitação como dinheiro criado', 'Custo de reposição e oferta', 'O que prevê mesmo uma queda'],
    },
    euribor: {
      promise:
        'Ler o mercado monetário do euro a partir de quatro números, e saber a que está indexado o teu crédito.',
      concepts: ['A cascata híbrida', 'Euribor contra €STR', 'Prazos como curva de expectativas', 'A revisão e o seu desfasamento', 'O spread Euribor–OIS'],
    },
    'buying-property-portugal': {
      promise:
        'Saber ao euro quanto custa uma compra, e quantos anos de valorização são precisos para a compensar.',
      concepts: ['A tabela do IMT de 2026', 'Imposto do Selo e a escritura', 'IMI', 'VPT e manutenção', 'Custos de transacção de ida e volta', 'A taxa de carregamento como fasquia'],
    },
    'scrutinising-cbdcs': {
      promise:
        'Ler uma experiência de CBDC bem o suficiente para dizer o que construiu, e quem teria de dizer que sim antes de aquilo ser dinheiro.',
      concepts: ['Grossista contra retalho', 'Emissão de wCBDC como troca de passivos', 'Pontes', 'pools e curvas de emissão', 'Pré-financiamento contra liquidação pelo líquido', 'As funcionalidades de controlo', 'C.1 a C.5'],
    },
  },
};
