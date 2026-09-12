/**
 * The glossary in European Portuguese.
 *
 * Same conventions as the course: `tu` rather than `você`, AO90 spelling, and
 * Banco de Portugal / BCE terminology where it exists — "reservas bancárias",
 * "activo de liquidação", "facilidade permanente de depósito". Where the
 * industry uses the English term and Portuguese has coined nothing, the
 * English stays: repo, eurodólar, dealer primário.
 *
 * Acronyms are never translated. IORB, ON RRP, SOFR and €STR are the names of
 * specific published rates; a reader who meets "TJRB" in a Portuguese lesson
 * and then opens the Fed's site will find nothing.
 *
 * Keyed by slug, merged field by field over the English — see
 * `glossary-locale.ts`. An entry missing a field falls back rather than
 * blanking it.
 */

import type { TranslatableEntry } from '@/lib/glossary-locale';

export const GLOSSARY_PT: Record<string, TranslatableEntry> = {
  'bank-reserves': {
    term: 'Reservas bancárias',
    aliases: ['saldos de reserva', 'reservas de banco central'],
    definition:
      'Depósitos que os bancos comerciais detêm no banco central — o activo de liquidação com que os bancos pagam uns aos outros, e um passivo do banco central e não um activo que ele possua.',
    explanation: [
      'As reservas estão no topo da hierarquia do dinheiro. Quando um banco paga a outro, o que se move entre eles são reservas, e as reservas só existem como registos no próprio balanço do banco central.',
      'Só instituições elegíveis — grosso modo, bancos — as podem deter. Uma família, uma empresa ou um fundo do mercado monetário não consegue abrir uma conta de reservas, e é por isso que o banco central precisa de facilidades separadas para chegar sequer a quem não é banco.',
      'As reservas não saem do sistema bancário por via do crédito. Um empréstimo move depósitos entre clientes; só duas coisas alteram a quantidade total de reservas: o banco central criá-las ou destruí-las, e o público converter depósitos em notas.',
    ],
    mechanics: [
      {
        label: 'Passivo de quem',
        detail: 'Do banco central. No balanço de um banco comercial o mesmo saldo aparece como activo.',
      },
      {
        label: 'Como são criadas',
        detail: 'O banco central compra um activo ou empresta, e credita uma conta de reservas com dinheiro que emite na hora.',
      },
      {
        label: 'Como são drenadas',
        detail: 'Vendas ou vencimentos de activos, levantamentos de notas, uma conta do Tesouro a subir, ou procura na facilidade de repo invertido.',
      },
    ],
    misreading:
      'Que os bancos emprestam as suas reservas. Não emprestam — as reservas nunca saem do sistema bancário quando se concede um empréstimo. O crédito cria um depósito novo, e a posição de reservas do banco só muda quando o pagamento de quem pediu emprestado liquida noutro sítio.',
  },

  'monetary-base': {
    term: 'Base monetária',
    aliases: ['M0', 'moeda de base', 'moeda de alto poder'],
    definition:
      'O total das notas em circulação e das reservas dos bancos comerciais — toda a forma de dinheiro que é um passivo directo do banco central.',
    explanation: [
      'A base é o que o próprio banco central emite. Tudo o resto a que as pessoas chamam dinheiro — o saldo numa conta à ordem, uma participação num fundo do mercado monetário — é a promessa de outra pessoa, liquidada em última instância em moeda de base.',
      'As suas duas componentes servem utilizadores diferentes. As notas são a moeda de base que o público pode deter; as reservas são a moeda de base que só os bancos podem deter. Um levantamento converte uma na outra sem alterar o total.',
      'Uma base a crescer não produz mecanicamente inflação ou crédito. Depois de 2008 a base cresceu enormemente enquanto o dinheiro em sentido lato e o crédito bancário cresceram muito mais devagar, o que é a prova mais clara de que o multiplicador dos manuais é um tecto e não uma descrição.',
    ],
    mechanics: [
      { label: 'Componentes', detail: 'Moeda em circulação + saldos de reserva detidos no banco central.' },
      { label: 'Expande quando', detail: 'O banco central compra activos ou empresta — sendo a flexibilização quantitativa o maior exemplo.' },
      { label: 'Contrai quando', detail: 'As carteiras vencem sem reinvestimento, ou as notas regressam e são retiradas.' },
    ],
    misreading:
      'Que a base e «a massa monetária» são a mesma coisa. A maior parte do dinheiro que as pessoas gastam de facto é dinheiro em sentido lato — depósitos em bancos comerciais — que é criado pelo crédito e não pelo banco central.',
  },

  'broad-money': {
    term: 'Dinheiro em sentido lato',
    aliases: ['M2', 'massa monetária'],
    definition:
      'O dinheiro que o público consegue mesmo gastar — notas mais depósitos bancários e substitutos próximos — a maior parte do qual é criada pelos bancos comerciais quando emprestam.',
    explanation: [
      'Quando um banco concede um empréstimo, credita a conta de quem pediu. Os dois lados do seu balanço crescem ao mesmo tempo: um activo novo (o empréstimo) e um passivo novo (o depósito). Esse depósito é dinheiro novo em sentido lato, e o saldo de nenhum aforrador desceu para o produzir.',
      'O agregado M2 dos EUA cobre notas, depósitos à ordem e de poupança, depósitos a prazo pequenos e participações de retalho em fundos do mercado monetário. A fronteira exacta é uma escolha de definição, e é por isso que «o M2 subiu?» tem por vezes uma resposta menos interessante do que «o passivo de quem é que se mexeu?».',
      'O dinheiro em sentido lato encolhe quando os empréstimos são reembolsados. O reembolso destrói o depósito que o empréstimo criou — e é por isso que a desalavancagem drena dinheiro de uma economia em vez de apenas o redistribuir.',
    ],
    mechanics: [
      { label: 'Criado por', detail: 'Crédito dos bancos comerciais, e por compras do banco central a quem não é banco.' },
      { label: 'Destruído por', detail: 'Reembolso de empréstimos, e por bancos que vendam activos aos seus próprios depositantes.' },
      { label: 'Não é o mesmo que', detail: 'Reservas. O dinheiro em sentido lato é passivo de um banco; as reservas são do banco central.' },
    ],
    misreading:
      'Que os bancos são intermediários que passam o dinheiro dos aforradores a quem pede emprestado. A causalidade vai ao contrário: os empréstimos criam depósitos, e os depósitos são o subproduto do crédito e não a sua matéria-prima.',
  },

  iorb: {
    term: 'Juro sobre Saldos de Reserva',
    aliases: ['juro sobre reservas', 'IOER'],
    definition:
      'A taxa que a Reserva Federal paga aos bancos sobre as reservas que detêm nela — a taxa administrada que ancora o piso do corredor de política monetária dos EUA para os bancos.',
    explanation: [
      'Num sistema com reservas abundantes, a Fed não consegue orientar as taxas tornando as reservas escassas. Em vez disso fixa o rendimento do activo mais seguro que um banco pode deter, e deixa a concorrência fazer o resto: um banco não empresta de um dia para o outro a ninguém por menos do que ganha sem fazer nada.',
      'O IORB substituiu em 2021 a antiga divisão entre juro sobre reservas obrigatórias e juro sobre reservas excedentárias, depois de as reservas mínimas terem sido postas a zero e a distinção ter deixado de fazer sentido.',
      'É uma taxa administrada, não uma taxa de mercado. O Conselho fixa-a directamente, e é isso que faz dela uma alavanca e não uma observação.',
    ],
    mechanics: [
      { label: 'Quem a recebe', detail: 'Instituições de depósito elegíveis — bancos — sobre os seus saldos de reserva.' },
      { label: 'O que ancora', detail: 'O piso da taxa efectiva dos fundos federais para instituições que podem deter reservas.' },
      { label: 'Porque quem não é banco precisa de mais', detail: 'Os fundos monetários e as GSE não podem deter reservas, por isso é a facilidade ON RRP que lhes chega.' },
    ],
    misreading:
      'Que pagar juro sobre reservas «subsidia os bancos para não emprestarem». O crédito não é limitado pelas reservas, para começar — o IORB fixa o custo de oportunidade do dinheiro overnight, que é como a taxa de política monetária se transmite de todo quando as reservas são abundantes.',
  },

  'on-rrp': {
    term: 'Facilidade de Repo Invertido Overnight',
    aliases: ['facilidade de repo invertido', 'repo invertido overnight'],
    definition:
      'Uma facilidade da Reserva Federal onde entidades elegíveis que não são bancos emprestam dinheiro à Fed de um dia para o outro contra colateral do Tesouro, pondo um piso rígido nas taxas de juro de curto prazo.',
    explanation: [
      'Os fundos do mercado monetário, as empresas patrocinadas pelo Estado e os dealers detêm saldos de tesouraria enormes mas não podem deter reservas. Sem alternativa, teriam de emprestar aos bancos à taxa que os bancos oferecessem. A ON RRP dá-lhes uma opção sem risco a uma taxa publicada, por isso não emprestam a ninguém abaixo dela.',
      'A procura é um termómetro, não uma definição de política. Saldos grandes significam que o dinheiro não encontra melhor rendimento nos mercados privados; uma descida costuma significar que a oferta de bilhetes do Tesouro ou as taxas de repo se tornaram mais atractivas.',
      'A operação drena reservas sem encolher o balanço da Fed. O passivo total fica igual — o dinheiro passa simplesmente da linha das reservas para a linha do repo invertido, e só uma delas é moeda de base.',
    ],
    mechanics: [
      { label: 'Sentido do dinheiro', detail: 'Do fundo para a Fed de um dia para o outro; a Fed dá títulos do Tesouro como colateral.' },
      { label: 'Efeito nas reservas', detail: 'Descem no montante procurado, porque o dinheiro saiu de um depósito bancário.' },
      { label: 'Efeito no balanço da Fed', detail: 'Nenhuma alteração de dimensão. A composição do passivo muda, e mais nada.' },
    ],
    misreading:
      'Que a Fed está a «imprimir dinheiro» quando a procura sobe. Acontece o contrário: a ON RRP absorve dinheiro e encolhe a base monetária, apesar de o balanço global da Fed ficar exactamente do mesmo tamanho.',
  },
};
