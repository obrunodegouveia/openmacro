/**
 * The glossary in European Portuguese.
 *
 * Same conventions as the course: `tu` rather than `você`, AO90 spelling, and
 * Banco de Portugal / BCE terminology where it exists — "reservas bancárias",
 * "ativo de liquidação", "facilidade permanente de depósito". Where the
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
      'Depósitos que os bancos comerciais detêm no banco central — o ativo de liquidação com que os bancos pagam uns aos outros, e um passivo do banco central e não um ativo que ele possua.',
    explanation: [
      'As reservas estão no topo da hierarquia do dinheiro. Quando um banco paga a outro, o que se move entre eles são reservas, e as reservas só existem como registos no próprio balanço do banco central.',
      'Só instituições elegíveis — grosso modo, bancos — as podem deter. Uma família, uma empresa ou um fundo do mercado monetário não consegue abrir uma conta de reservas, e é por isso que o banco central precisa de facilidades separadas para chegar sequer a quem não é banco.',
      'As reservas não saem do sistema bancário por via do crédito. Um empréstimo move depósitos entre clientes; só duas coisas alteram a quantidade total de reservas: o banco central criá-las ou destruí-las, e o público converter depósitos em notas.',
    ],
    mechanics: [
      {
        label: 'Passivo de quem',
        detail: 'Do banco central. No balanço de um banco comercial o mesmo saldo aparece como ativo.',
      },
      {
        label: 'Como são criadas',
        detail: 'O banco central compra um ativo ou empresta, e credita uma conta de reservas com dinheiro que emite na hora.',
      },
      {
        label: 'Como são drenadas',
        detail: 'Vendas ou vencimentos de ativos, levantamentos de notas, uma conta do Tesouro a subir, ou procura na facilidade de repo invertido.',
      },
    ],
    misreading:
      'Que os bancos emprestam as suas reservas. Não emprestam — as reservas nunca saem do sistema bancário quando se concede um empréstimo. O crédito cria um depósito novo, e a posição de reservas do banco só muda quando o pagamento de quem pediu emprestado liquida noutro sítio.',
  },

  'monetary-base': {
    term: 'Base monetária',
    aliases: ['M0', 'moeda de base', 'moeda de alto poder'],
    definition:
      'O total das notas em circulação e das reservas dos bancos comerciais — toda a forma de dinheiro que é um passivo direto do banco central.',
    explanation: [
      'A base é o que o próprio banco central emite. Tudo o resto a que as pessoas chamam dinheiro — o saldo numa conta à ordem, uma participação num fundo do mercado monetário — é a promessa de outra pessoa, liquidada em última instância em moeda de base.',
      'As suas duas componentes servem utilizadores diferentes. As notas são a moeda de base que o público pode deter; as reservas são a moeda de base que só os bancos podem deter. Um levantamento converte uma na outra sem alterar o total.',
      'Uma base a crescer não produz mecanicamente inflação ou crédito. Depois de 2008 a base cresceu enormemente enquanto o dinheiro em sentido lato e o crédito bancário cresceram muito mais devagar, o que é a prova mais clara de que o multiplicador dos manuais é um teto e não uma descrição.',
    ],
    mechanics: [
      { label: 'Componentes', detail: 'Moeda em circulação + saldos de reserva detidos no banco central.' },
      { label: 'Expande quando', detail: 'O banco central compra ativos ou empresta — sendo a flexibilização quantitativa o maior exemplo.' },
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
      'Quando um banco concede um empréstimo, credita a conta de quem pediu. Os dois lados do seu balanço crescem ao mesmo tempo: um ativo novo (o empréstimo) e um passivo novo (o depósito). Esse depósito é dinheiro novo em sentido lato, e o saldo de nenhum aforrador desceu para o produzir.',
      'O agregado M2 dos EUA cobre notas, depósitos à ordem e de poupança, depósitos a prazo pequenos e participações de retalho em fundos do mercado monetário. A fronteira exata é uma escolha de definição, e é por isso que «o M2 subiu?» tem por vezes uma resposta menos interessante do que «o passivo de quem é que se mexeu?».',
      'O dinheiro em sentido lato encolhe quando os empréstimos são reembolsados. O reembolso destrói o depósito que o empréstimo criou — e é por isso que a desalavancagem drena dinheiro de uma economia em vez de apenas o redistribuir.',
    ],
    mechanics: [
      { label: 'Criado por', detail: 'Crédito dos bancos comerciais, e por compras do banco central a quem não é banco.' },
      { label: 'Destruído por', detail: 'Reembolso de empréstimos, e por bancos que vendam ativos aos seus próprios depositantes.' },
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
      'Num sistema com reservas abundantes, a Fed não consegue orientar as taxas tornando as reservas escassas. Em vez disso fixa o rendimento do ativo mais seguro que um banco pode deter, e deixa a concorrência fazer o resto: um banco não empresta de um dia para o outro a ninguém por menos do que ganha sem fazer nada.',
      'O IORB substituiu em 2021 a antiga divisão entre juro sobre reservas obrigatórias e juro sobre reservas excedentárias, depois de as reservas mínimas terem sido postas a zero e a distinção ter deixado de fazer sentido.',
      'É uma taxa administrada, não uma taxa de mercado. O Conselho fixa-a diretamente, e é isso que faz dela uma alavanca e não uma observação.',
    ],
    mechanics: [
      { label: 'Quem a recebe', detail: 'Instituições de depósito elegíveis — bancos — sobre os seus saldos de reserva.' },
      { label: 'O que ancora', detail: 'O piso da taxa efetiva dos fundos federais para instituições que podem deter reservas.' },
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
      'A procura é um termómetro, não uma definição de política. Saldos grandes significam que o dinheiro não encontra melhor rendimento nos mercados privados; uma descida costuma significar que a oferta de bilhetes do Tesouro ou as taxas de repo se tornaram mais atrativas.',
      'A operação drena reservas sem encolher o balanço da Fed. O passivo total fica igual — o dinheiro passa simplesmente da linha das reservas para a linha do repo invertido, e só uma delas é moeda de base.',
    ],
    mechanics: [
      { label: 'Sentido do dinheiro', detail: 'Do fundo para a Fed de um dia para o outro; a Fed dá títulos do Tesouro como colateral.' },
      { label: 'Efeito nas reservas', detail: 'Descem no montante procurado, porque o dinheiro saiu de um depósito bancário.' },
      { label: 'Efeito no balanço da Fed', detail: 'Nenhuma alteração de dimensão. A composição do passivo muda, e mais nada.' },
    ],
    misreading:
      'Que a Fed está a «imprimir dinheiro» quando a procura sobe. Acontece o contrário: a ON RRP absorve dinheiro e encolhe a base monetária, apesar de o balanço global da Fed ficar exatamente do mesmo tamanho.',
  },

  'quantitative-easing': {
    term: 'Flexibilização quantitativa',
    aliases: ['compras de ativos', 'compras de ativos em larga escala', 'APP', 'PEPP'],
    definition:
      'Compras de obrigações em larga escala por um banco central, pagas com reservas criadas de novo, usadas para aliviar as condições financeiras quando a taxa de política monetária já está perto do seu piso.',
    explanation: [
      'Mecanicamente, o QE é uma troca de ativos. Quem vende entrega uma obrigação e recebe um depósito; o banco de quem vende recebe reservas. A riqueza líquida de ninguém muda muito — o que muda é a composição daquilo que o setor privado detém.',
      'Como retira duração e tira do mercado colateral de alta qualidade, o QE atua sobretudo através do preço do risco e da forma da curva de rendimentos, e não entregando a alguém dinheiro para gastar.',
      'O BCE correu o mesmo mecanismo no seu Asset Purchase Programme e, a partir de 2020, no Pandemic Emergency Purchase Programme. Os nomes dos instrumentos diferem; os lançamentos no balanço não.',
    ],
    mechanics: [
      { label: 'Banco central', detail: 'Ativo: obrigações a subir. Passivo: reservas a subir no mesmo montante.' },
      { label: 'Banco de quem vende', detail: 'Ativo: reservas a subir. Passivo: o depósito de quem vende a subir.' },
      { label: 'Mercado de colateral', detail: 'Colateral impecável sai de circulação, o que aperta os mercados de repo.' },
    ],
    misreading:
      'Que o QE obriga os bancos a emprestar, ou que é inerentemente inflacionista por via do multiplicador. Cria reservas, e não são as reservas que limitam o crédito — e é por isso que uma década de QE coincidiu com um crescimento do crédito historicamente fraco.',
  },

  'quantitative-tightening': {
    term: 'Aperto quantitativo',
    aliases: ['redução do balanço', 'normalização do balanço'],
    definition:
      'O inverso do QE — encolher o balanço do banco central, normalmente deixando as obrigações vencer sem reinvestir, o que destrói reservas.',
    explanation: [
      'A redução é passiva. Quando uma obrigação que o banco central detém vence, o emitente reembolsa e o banco central simplesmente não compra outra. O ativo desaparece de um lado do balanço e as reservas desaparecem do outro.',
      'Isso torna o QT mais lento e menos controlável do que o QE. O ritmo é fixado pelo perfil de maturidades daquilo que se detém e por qualquer teto mensal, não por uma decisão tomada reunião a reunião.',
      'A pergunta que aperta é onde começa a escassez de reservas. Ninguém sabe o nível à partida, e passar dele aparece primeiro como tensão nos mercados de repo — como os EUA descobriram em Setembro de 2019.',
    ],
    mechanics: [
      { label: 'Banco central', detail: 'Ativo: obrigações a descer no vencimento. Passivo: reservas a descer no mesmo montante.' },
      { label: 'Interage com', detail: 'A conta do Tesouro e os saldos da ON RRP, que movem reservas por conta própria.' },
      { label: 'Sinal de alarme', detail: 'Taxas de repo persistentemente acima do piso administrado.' },
    ],
    misreading:
      'Que o QT é simplesmente o QE ao contrário, à mesma velocidade e com o mesmo efeito. As compras são escolhidas; a redução é herdada de um calendário de maturidades, e o seu impacto cai de forma desigual pelos mercados.',
  },

  'deposit-facility-rate': {
    term: 'Taxa da Facilidade Permanente de Depósito',
    aliases: ['taxa de depósito do BCE', 'taxa diretora do BCE'],
    definition:
      'A taxa que o BCE paga aos bancos da área do euro sobre depósitos overnight no Eurosistema — desde 2022, a taxa através da qual o BCE orienta as taxas de curto prazo do euro.',
    explanation: [
      'A área do euro funciona com um corredor de três taxas: a facilidade de depósito em baixo, a taxa das operações principais de refinanciamento no meio, e a facilidade permanente de cedência de liquidez em cima. Com excesso de liquidez abundante, as taxas de mercado assentam no piso, por isso é a DFR que realmente morde.',
      'Entre 2014 e 2022 a DFR foi negativa — os bancos pagavam para estacionar dinheiro no BCE. Foi uma tentativa deliberada de empurrar liquidez para fora da facilidade de depósito e para o crédito, e faz da área do euro a maior experiência de taxas diretoras negativas alguma vez feita.',
      'O BCE estreitou a diferença entre a MRO e a DFR em 2024, no âmbito da revisão do seu quadro operacional, apertando o corredor à volta do piso.',
    ],
    mechanics: [
      { label: 'Quem a recebe', detail: 'Instituições de crédito da área do euro sobre depósitos overnight no seu banco central nacional.' },
      { label: 'O que ancora', detail: 'A €STR e toda a ponta curta da curva do euro.' },
      { label: 'Equivalente nos EUA', detail: 'O IORB — o mesmo trabalho, feito para bancos que podem deter reservas.' },
    ],
    misreading:
      'Que uma DFR negativa era um imposto sobre os aforradores. Aplicava-se aos saldos dos bancos no banco central, não aos depósitos das famílias; se os bancos a repercutiam era uma decisão comercial separada, e para os depositantes de retalho na sua maioria não repercutiram.',
  },

  'main-refinancing-operations': {
    term: 'Operações Principais de Refinanciamento',
    aliases: ['taxa refi', 'taxa das operações principais de refinanciamento do BCE'],
    definition:
      'O crédito semanal regular e colateralizado do BCE aos bancos da área do euro, e a taxa cobrada sobre ele — historicamente a principal fonte de liquidez do Eurosistema.',
    explanation: [
      'Uma MRO é um repo: um banco dá colateral elegível e recebe moeda de banco central por uma semana. É emprestar contra garantia, não uma oferta, e é no quadro de colateral que vive boa parte da verdadeira política de risco do BCE.',
      'Antes de 2008 a MRO era a torneira principal por onde a liquidez chegava ao sistema, e a taxa da MRO era por isso a taxa diretora de referência. A partir do momento em que o excesso de liquidez se tornou abundante, foi a facilidade de depósito que assumiu esse papel.',
      'O BCE sinalizou que as MRO vão recuperar importância à medida que o excesso de liquidez diminuir, com os bancos a satisfazerem de novo mais das suas necessidades através de operações determinadas pela procura.',
    ],
    mechanics: [
      { label: 'Sentido', detail: 'O BCE empresta; o banco dá colateral e recebe moeda de banco central.' },
      { label: 'Prazo', detail: 'Uma semana, colocada semanalmente, com colocação integral a taxa fixa desde 2008.' },
      { label: 'Balanço', detail: 'Ativo do Eurosistema: crédito a subir. Passivo: a conta do banco a subir.' },
    ],
    misreading:
      'Que a taxa da MRO ainda é «a» taxa do BCE. Num sistema de piso é a taxa da facilidade de depósito que os mercados usam como referência; a MRO importa sobretudo como teto do corredor estreitado.',
  },

  sofr: {
    term: 'Secured Overnight Financing Rate',
    definition:
      'Uma medida abrangente do custo de pedir dinheiro emprestado de um dia para o outro com garantia de colateral do Tesouro dos EUA, publicada todas as manhãs pela Fed de Nova Iorque e a principal substituta da LIBOR nos EUA.',
    explanation: [
      'A SOFR é calculada a partir de transações reais em todo o mercado de repo de títulos do Tesouro — centenas de milhares de milhões de dólares por dia — e não a partir de um painel de bancos a declarar onde acham que conseguiriam financiar-se. É precisamente essa a falha da LIBOR que a SOFR foi desenhada para eliminar.',
      'Por ser garantida, a SOFR quase não tem risco de crédito bancário. Comporta-se por isso de forma diferente da LIBOR numa crise: a LIBOR dispara quando se desconfia dos bancos, enquanto a SOFR pode disparar quando o colateral ou a capacidade de balanço dos dealers escasseiam.',
      'Os picos são diagnósticos. Quando a SOFR fixa bem acima do piso administrado, costuma estar a dizer-te que as reservas se tornaram escassas ou que os dealers não conseguem expandir os seus livros — como em Setembro de 2019.',
    ],
    mechanics: [
      { label: 'O que mede', detail: 'Financiamento overnight garantido por títulos do Tesouro, ponderado por transação.' },
      { label: 'Publicada por', detail: 'O Banco da Reserva Federal de Nova Iorque, todas as manhãs úteis.' },
      { label: 'Lê-se contra', detail: 'O IORB e a taxa da ON RRP — o piso administrado junto ao qual deveria assentar.' },
    ],
    misreading:
      'Que a SOFR é simplesmente a nova LIBOR. É uma taxa garantida sem estrutura de prazos própria, e é por isso que a SOFR a prazo teve de ser construída à parte e que os spreads de crédito tiveram de ser reavaliados em vez de apenas mudarem de nome.',
  },

  'euro-short-term-rate': {
    term: 'Taxa de Curto Prazo do Euro',
    aliases: ['ESTR', 'euro STR'],
    definition:
      'O índice de referência do BCE para o custo do financiamento overnight sem garantia dos bancos da área do euro, calculado a partir de transações declaradas do mercado monetário e substituto da EONIA.',
    explanation: [
      'A €STR é construída a partir do lado da tomada de fundos do reporte estatístico do mercado monetário do euro, cobrindo depósitos overnight sem garantia que os bancos aceitam de contrapartes financeiras. Por ser sem garantia, incorpora uma pequena dose de risco de crédito bancário que a SOFR não tem.',
      'Transacciona ligeiramente abaixo da taxa da facilidade de depósito em condições normais, porque alguns dos que emprestam na amostra reportada não têm acesso direto às facilidades do BCE e aceitam um pouco menos.',
      'Olhar para a diferença entre a €STR e a DFR é um dos testes mais limpos de se um sistema de piso está a funcionar: uma diferença a alargar significa que o piso está a verter.',
    ],
    mechanics: [
      { label: 'O que mede', detail: 'Financiamento overnight sem garantia obtido por bancos da área do euro junto de contrapartes financeiras.' },
      { label: 'Publicada por', detail: 'O Banco Central Europeu, em cada dia útil do TARGET.' },
      { label: 'Equivalente nos EUA', detail: 'A taxa efetiva dos fundos federais — sem garantia — e não a SOFR.' },
    ],
    misreading:
      'Que a €STR e a SOFR são intermutáveis entre moedas. Uma é sem garantia e a outra é garantida; num episódio de tensão movem-se por razões opostas.',
  },

  'repurchase-agreement': {
    term: 'Acordo de recompra',
    aliases: ['repo', 'repo invertido', 'venda com acordo de recompra'],
    definition:
      'A venda de um título combinada com um acordo de o recomprar a um preço e numa data fixados — juridicamente uma venda, economicamente um empréstimo com garantia.',
    explanation: [
      'O repo é a canalização das finanças modernas. Os dealers financiam nele o seu inventário, os fundos monetários estacionam nele dinheiro, e é assim que os títulos do Tesouro se transformam em dinheiro sem serem vendidos de vez.',
      'A forma jurídica importa enormemente num incumprimento. Por ser uma venda e não um penhor, quem emprestou o dinheiro pode apreender e vender o colateral de imediato em vez de ficar na fila da insolvência — e é isso que faz com que aceite financiar com spreads muito finos.',
      'A mesma operação tem dois nomes consoante o lado em que estás. Quem pede o dinheiro faz um repo; quem o empresta faz um repo invertido. A facilidade ON RRP da Fed tem o nome visto do lado da Fed.',
    ],
    mechanics: [
      { label: 'Quem pede o dinheiro', detail: 'Entrega colateral, recebe dinheiro, compromete-se a recomprar — normalmente no dia seguinte.' },
      { label: 'Margem de avaliação', detail: 'O colateral vale um pouco mais do que o dinheiro, protegendo quem empresta de movimentos de preço.' },
      { label: 'Reutilização', detail: 'O colateral pode ser dado de novo em garantia, por isso uma obrigação sustenta várias cadeias de crédito.' },
    ],
    misreading:
      'Que o repo é um pormenor técnico de nicho. É o mercado onde o preço do dinheiro overnight é de facto fixado, e todas as grandes crises de financiamento desde 1990 passaram por ele.',
  },

  eurodollar: {
    term: 'Eurodólar',
    aliases: ['dólares offshore', 'sistema do eurodólar'],
    definition:
      'Um depósito em dólares norte-americanos detido num banco fora da jurisdição dos Estados Unidos — dólares criados no estrangeiro, fora do alcance direto da Reserva Federal.',
    explanation: [
      'O nome é um acidente histórico: o mercado começou com depósitos em dólares em bancos europeus e não tem nada que ver com o euro. Um depósito em dólares em Tóquio ou em Singapura também é um eurodólar.',
      'Um banco fora dos EUA consegue criar depósitos em dólares emprestando dólares, exatamente como um banco americano — mas não consegue criar as reservas que em última instância liquidam esses direitos. Quando o financiamento em dólares offshore seca, não há emprestador de último recurso doméstico por trás.',
      'É por isso que existem as linhas de swap da Fed. São o mecanismo pelo qual a Fed empresta dólares a outros bancos centrais para que estes possam aliviar tensões num sistema de dólares que funciona fora das suas fronteiras.',
    ],
    mechanics: [
      { label: 'Onde está o depósito', detail: 'Num banco fora da jurisdição dos EUA, denominado em USD.' },
      { label: 'O que lhe falta', detail: 'Acesso direto às reservas da Fed, seguro de depósitos, e janela de desconto.' },
      { label: 'Sinal de tensão', detail: 'Swaps de base cambial a mover-se fortemente para território negativo contra o dólar.' },
    ],
    misreading:
      'Que o sistema do dólar está contido dentro dos Estados Unidos. A maior parte do crédito em dólares é criada fora dele, e é por isso que um banco central americano acaba a atuar como o banco central do mundo.',
  },

  'primary-dealer': {
    term: 'Dealer primário',
    definition:
      'Uma contraparte de negociação da Fed de Nova Iorque, obrigada a licitar em todos os leilões do Tesouro e a fazer mercado em títulos de dívida pública — o canal pelo qual as operações de mercado aberto chegam ao sistema financeiro.',
    explanation: [
      'A Fed não compra obrigações ao público. Transacciona com uma lista pequena de dealers primários, e esses dealers são a ponte entre o balanço do banco central e o de toda a gente.',
      'A obrigação vai nos dois sentidos: os dealers ganham acesso às operações da Fed e, em troca, têm de participar nos leilões e fazer mercado mesmo quando não é rentável.',
      'A capacidade de balanço dos dealers é uma restrição a sério sobre todo o sistema. Quando as regras de alavancagem ou os limites de risco impedem os dealers de se expandirem, os mercados de repo travam mesmo sem nada de errado com o próprio colateral.',
    ],
    mechanics: [
      { label: 'Contraparte de', detail: 'A mesa de operações de mercado aberto da Fed de Nova Iorque.' },
      { label: 'Obrigações', detail: 'Licitar nos leilões do Tesouro; fazer mercado; reportar posições e fluxos.' },
      { label: 'Porque a capacidade importa', detail: 'A intermediação exige balanço, e o balanço é finito e regulado.' },
    ],
    misreading:
      'Que o QE mete dinheiro diretamente na economia real. Chega primeiro a um dealer, e se alguma coisa viaja mais longe depende do que quem vendeu fizer a seguir.',
  },

  'treasury-general-account': {
    term: 'Conta Geral do Tesouro',
    aliases: ['conta de tesouraria do Tesouro'],
    definition:
      'A conta operacional do Tesouro dos EUA na Reserva Federal — a conta à ordem do Estado, e um passivo do banco central que concorre diretamente com as reservas bancárias.',
    explanation: [
      'Quando pagas impostos, sai dinheiro do teu depósito bancário, o teu banco perde reservas, e a TGA sobe. O balanço da Fed não muda de tamanho; o seu passivo passa simplesmente dos bancos para o Estado.',
      'O inverso acontece quando o Tesouro gasta: a TGA desce e as reservas voltam ao sistema bancário. A despesa pública é, mecanicamente, uma injeção de reservas.',
      'Isto faz da TGA uma das maiores fontes de volatilidade semanal nos saldos de reservas — muitas vezes maior do que tudo o que o banco central esteja a fazer deliberadamente. Os episódios do teto da dívida, em que o saldo é esgotado e depois reconstruído, movem centenas de milhares de milhões.',
    ],
    mechanics: [
      { label: 'Pagamento de imposto', detail: 'Depósitos a descer, reservas a descer, TGA a subir. A moeda de base cai.' },
      { label: 'Despesa pública', detail: 'TGA a descer, reservas a subir, depósitos a subir. A moeda de base sobe.' },
      { label: 'Emissão de dívida', detail: 'Drena reservas à medida que os compradores pagam, até o produto ser gasto de volta.' },
    ],
    misreading:
      'Que o endividamento e a despesa do Estado são neutros para o sistema bancário. Cada movimento na TGA é um movimento nas reservas, e é por isso que quem faz previsões de liquidez a acompanha tão de perto como acompanha a política monetária.',
  },

  'discount-window': {
    term: 'Janela de desconto',
    aliases: ['crédito primário', 'facilidade de emprestador de último recurso'],
    definition:
      'A facilidade permanente da Reserva Federal para emprestar diretamente aos bancos contra colateral — a rede de segurança que deveria limitar até onde as taxas de curto prazo podem subir.',
    explanation: [
      'Em teoria nenhum banco deveria pagar mais do que a taxa de desconto para se financiar de um dia para o outro, porque pode sempre pedir à Fed. Na prática o teto verte, porque pedir traz estigma.',
      'O estigma é o problema central de desenho da janela. Um banco que a use pode ser lido como incapaz de se financiar privadamente, por isso os bancos evitam-na exatamente quando mais precisam dela — o oposto do que uma rede de segurança deveria fazer.',
      'A regra de Bagehot — emprestar sem reservas, contra bom colateral, a uma taxa penalizadora — é a doutrina por trás da facilidade, e continua a ser o resumo de uma linha mais afiado sobre para que serve um emprestador de último recurso.',
    ],
    mechanics: [
      { label: 'Sentido', detail: 'A Fed empresta; o banco dá colateral e recebe reservas criadas de novo.' },
      { label: 'Crédito primário', detail: 'Disponível a instituições sólidas, a curto prazo, a uma taxa acima do intervalo-alvo.' },
      { label: 'Equivalente na área do euro', detail: 'A facilidade permanente de cedência de liquidez, no topo do corredor do BCE.' },
    ],
    misreading:
      'Que recorrer à janela de desconto sinaliza um banco a falir. Sinaliza um banco com falta de liquidez, o que não é o mesmo que falta de capital — confundir as duas coisas é como um problema de financiamento se torna um problema de solvência.',
  },

  'central-bank-swap-line': {
    term: 'Linha de swap de liquidez entre bancos centrais',
    aliases: ['linhas de swap de dólares', 'linhas de swap da Fed'],
    definition:
      'Um acordo ao abrigo do qual a Reserva Federal empresta dólares a outro banco central contra a moeda deste, para que esse banco possa aliviar tensões de financiamento em dólares entre os seus próprios bancos.',
    explanation: [
      'A Fed troca dólares por euros, ienes ou libras à taxa de câmbio à vista em vigor, com um acordo de reverter a operação mais tarde à mesma taxa. O banco central estrangeiro assume o risco de crédito de emprestar esses dólares aos seus próprios bancos; a contraparte da Fed é o próprio banco central.',
      'Esta é a resposta institucional ao problema do eurodólar. Criam-se passivos em dólares por todo o mundo em instituições sem acesso à Fed e, num aperto, alguém tem de fornecer os dólares em que esses passivos liquidam.',
      'As linhas de swap passaram a acordos permanentes entre seis grandes bancos centrais depois de 2008 e foram alargadas drasticamente em Março de 2020. São a peça menos discutida e mais consequente da arquitetura global de crise.',
    ],
    mechanics: [
      { label: 'Primeira perna', detail: 'A Fed credita o banco central estrangeiro com dólares; recebe a moeda dele em troca.' },
      { label: 'Cedência subsequente', detail: 'O banco central estrangeiro leiloa esses dólares aos seus bancos contra colateral.' },
      { label: 'Risco', detail: 'A Fed tem à sua frente um banco central, não um banco comercial, e fica com moeda estrangeira todo o tempo.' },
    ],
    misreading:
      'Que as linhas de swap são um resgate a bancos estrangeiros pago pelos contribuintes americanos. São colateralizadas, revertidas à taxa de câmbio original, e historicamente deram lucro — a alternativa é uma escassez de dólares que acaba por cair nos mercados americanos de qualquer maneira.',
  },

  'money-multiplier': {
    term: 'Multiplicador monetário',
    aliases: ['multiplicador de depósitos', 'multiplicador das reservas fracionárias'],
    definition:
      'O rácio dos manuais m = 1/R que descreve o máximo de dinheiro em depósitos que um sistema bancário poderia sustentar sobre uma dada base de reservas — um teto, não uma descrição de como os bancos funcionam de facto.',
    explanation: [
      'O modelo corre uma cadeia: chega um depósito, o banco guarda uma fração R e empresta o resto, o empréstimo volta a ser depositado, e assim por diante. Somado até ao infinito, uma unidade de moeda de base sustenta 1/R unidades de depósitos.',
      'É um primeiro modelo mental útil e uma má descrição da realidade. Os bancos centrais modernos têm por alvo uma taxa de juro e não uma quantidade de reservas, vários puseram as reservas mínimas a zero — a Fed fê-lo em Março de 2020 — e os bancos são limitados por capital, regulação e procura de crédito muito antes de as reservas apertarem.',
      'Manter o modelo sabendo os seus limites é a posição honesta. Diz-te o que um sistema sem restrições poderia fazer, e a diferença entre isso e o crédito observado é ela própria a quantidade interessante.',
    ],
    mechanics: [
      { label: 'Fórmula', detail: 'm = 1 / R, portanto o total de depósitos M = D × (1 / R).' },
      { label: 'Pressupõe', detail: 'Sem fuga para notas, todos os bancos emprestados até ao limite, e uma reserva mínima que aperte.' },
      { label: 'Prova dos factos', detail: 'Depois de 2008, a moeda de base multiplicou-se e o dinheiro em sentido lato não.' },
    ],
    misreading:
      'Que o multiplicador descreve causalidade — que as reservas são emprestadas e se multiplicam. O crédito cria primeiro os depósitos; as reservas são geridas depois, e o banco central fornece a quantidade que o seu alvo de taxa exigir.',
  },

  'legal-tender': {
    term: 'Curso legal',
    aliases: ['moeda fiduciária', 'cartalismo', 'moeda sem cobertura'],
    definition:
      'Dinheiro que um credor é obrigado por lei a aceitar para liquidar uma dívida — um dos apoios, a par das obrigações fiscais, que torna universalmente aceitável um token sem valor intrínseco.',
    explanation: [
      'A lei do curso legal é mais estreita do que se supõe. Rege a liquidação de dívidas já contraídas; não obriga uma loja a aceitar notas por uma sandes, e a maioria dos países deixa quem vende fixar as suas condições à partida.',
      'O apoio mais forte é a tributação. Um Estado que exige pagamento numa determinada unidade cria procura contínua e não opcional por ela — o argumento cartalista de que são os impostos que sustentam o dinheiro, e a razão por que a aceitabilidade de uma moeda acompanha o alcance do Estado que a emite.',
      'O resto é confiança institucional: um banco central independente, contratos que se fazem cumprir, e uma expectativa plausível de que a unidade ainda significará alguma coisa para o ano. Nenhuma destas coisas é uma cobertura física, e é exatamente por isso que ao arranjo se chama fiduciário.',
    ],
    mechanics: [
      { label: 'Apoio legal', detail: 'A lei torna a unidade válida para liquidar dívidas dentro da jurisdição.' },
      { label: 'Apoio fiscal', detail: 'As obrigações fiscais denominadas na unidade criam procura permanente por ela.' },
      { label: 'Apoio institucional', detail: 'A credibilidade de quem emite, e a expectativa de que será defendida.' },
    ],
    misreading:
      'Que a moeda fiduciária «não tem cobertura nenhuma». Tem por trás uma estrutura de direitos que se faz cumprir — obrigações fiscais, tribunais e um banco central — o que é coisa diferente de ter por trás uma mercadoria.',
  },
};
