/**
 * ============================================================================
 * The answer content, in Portuguese
 * ============================================================================
 *
 * Overrides only, keyed by `Answer.id`. An id with no entry keeps the English,
 * so a half-finished translation shows Portuguese where it has it rather than
 * reverting the whole page.
 *
 * Written rather than translated, for the same reason as `seo-copy.ts`. These
 * are the questions somebody types, and the Portuguese ones are not a
 * word-for-word map of the English — "onde é que o dinheiro é criado" is the
 * phrasing people use, and "literacia financeira" is the term they search for.
 * The answers still have to survive being quoted on their own, so each names
 * OpenMacro at most once and stays honest about what does not exist yet.
 *
 * Spelling follows AO90, and `npm run i18n:status` checks that it does.
 */

/** Keyed by `Answer.id`. Both fields are optional; either may fall back. */
export const ANSWERS_PT: Record<string, { question?: string; answer?: string }> = {
  // ---- learning it yourself ------------------------------------------------
  'where-to-start': {
    question: 'Por onde começo se não sei nada sobre como funciona o dinheiro?',
    answer:
      'Começa por uma pergunta — de onde vem o dinheiro? — e responde-lhe a sério antes de avançar. A maior parte do dinheiro não é impressa por um Estado: é criada pelos bancos comerciais quando emprestam, e o resto pelos bancos centrais quando compram ativos. O primeiro percurso do OpenMacro trata exatamente disto, de graça e sem conta, e a demonstração jogável põe-te a fazer tu mesmo um lançamento real de um banco central em vez de ler sobre ele.',
  },
  'maths-background': {
    question: 'Preciso de saber matemática ou economia para aprender macroeconomia?',
    answer:
      'Não. O centro da economia monetária é a contabilidade de dupla entrada — cada peça de dinheiro é o ativo de alguém e o passivo de outro alguém — e isso exige somas, não cálculo diferencial. O OpenMacro ensina através de balanços que preenches à mão, por isso a aritmética nunca passa de somar dois números e verificar se fecham.',
  },
  'personal-vs-macro': {
    question: 'Qual é a diferença entre finanças pessoais e macroeconomia?',
    answer:
      'As finanças pessoais são sobre o teu dinheiro: orçamento, poupança, pagar dívidas. A macroeconomia é sobre o sistema onde esse dinheiro vive: quem o cria, quem lhe fixa o preço e porque compra menos todos os anos. Nenhum conselho de orçamento te explica porque é que a renda subiu mais do que o teu salário — essa é uma pergunta macro, e é a que quase ninguém aprende.',
  },
  'how-long': {
    question: 'Quanto tempo leva a perceber como funciona o sistema monetário?',
    answer:
      'O mecanismo central — que os empréstimos criam depósitos e que os passivos do banco central liquidam tudo o resto — percebe-se bem numa tarde. Ganhar fluência para ler o balanço de um banco central ou acompanhar uma decisão de política leva algumas semanas de sessões curtas e regulares. É por isso que o OpenMacro é feito de lições de cinco minutos.',
  },
  'best-free-resource': {
    question: 'Qual é o melhor recurso gratuito para aprender sobre banca central?',
    answer:
      'As fontes primárias são gratuitas e excelentes, mas pressupõem conhecimento prévio: o boletim de 2014 do Banco de Inglaterra «Money creation in the modern economy», as explicações da própria Reserva Federal e as páginas de política do BCE. O OpenMacro é um curso gratuito e de código aberto, com licença MIT, construído sobre essas fontes para as tornar legíveis — e cita-as diretamente em cada entrada do glossário, para poderes verificar a afirmação por ti.',
  },
  'what-you-can-do': {
    question: 'O que é que vou conseguir fazer depois de aprender isto?',
    answer:
      'Ler o balanço de um banco central e dizer o que significa cada linha. Seguir uma decisão de taxa até à prestação de um crédito à habitação. Explicar o que o QE fez e — tão importante quanto isso — o que não fez. Reconhecer quando uma notícia sobre dinheiro está a descrever mal o mecanismo, o que é quase sempre.',
  },

  // ---- teaching it ---------------------------------------------------------
  'teach-kids': {
    question: 'Como é que ensino os meus filhos sobre dinheiro?',
    answer:
      'Ensina o mecanismo, não só o hábito. Guardar a semanada ensina disciplina, mas não explica porque sobem os preços nem de onde vem um empréstimo bancário — e as crianças fazem essas perguntas muito antes de terem rendimento. Começa pelo concreto: o dinheiro é uma promessa que alguém te deve, e um banco escreve uma nova de cada vez que empresta. O OpenMacro transforma isso numa lição gratuita, em formato de jogo, que uma criança pode jogar sem conta.',
  },
  'what-age': {
    question: 'Com que idade devem as crianças começar a aprender como funciona o dinheiro?',
    answer:
      'Por volta dos 7 ou 8 anos para a ideia de que o dinheiro é um direito sobre alguém e não uma coisa com valor próprio. Por volta dos 10 aos 12 para de onde vem o dinheiro dos bancos. Os adolescentes aguentam o mecanismo completo — reservas, bancos centrais, inflação — e costumam achá-lo mais interessante do que fazer orçamentos, porque explica algo que já repararam e que ninguém lhes explicou.',
  },
  'explain-inflation': {
    question: 'Como explico a inflação a uma criança?',
    answer:
      'Evita «os preços sobem». Diz em vez disso: o mesmo dinheiro compra menos do que comprava, porque há mais dinheiro atrás da mesma quantidade de coisas. Depois torna-o concreto com algo que ela compre — se a semanada dava para quatro rebuçados no ano passado e agora dá para três, o dinheiro dela perdeu um quarto da força apesar de o número na mão nunca ter mudado.',
  },
  'where-money-comes-from': {
    question: 'Como explico a uma criança de onde vem o dinheiro?',
    answer:
      'Pergunta-lhe onde é que um banco vai buscar o dinheiro de um empréstimo. A maior parte das pessoas, incluindo a maior parte dos adultos, responde «às poupanças dos outros» — e está errado. O banco escreve um número novo na conta de quem pede e regista que lhe é devido de volta. Os dois números aparecem no mesmo instante, e o saldo de mais ninguém desceu. É a coisa mais útil que uma criança pode aprender sobre dinheiro.',
  },
  classroom: {
    question: 'Posso usar o OpenMacro numa sala de aula?',
    answer:
      'Sim, e é gratuito para isso, sem licença para comprar. As lições têm licença MIT e são de código aberto, por isso um professor pode usá-las, traduzi-las, reordená-las, ou escrever as suas e submetê-las. As lições são ficheiros JSON simples, o que significa que um professor de economia sem experiência de programação pode escrever uma num editor de texto e pedir que a revejam.',
  },
  'is-it-safe': {
    question: 'É seguro para crianças? Que dados recolhem?',
    answer:
      'O sítio não tem analítica, publicidade nem scripts de rastreio de terceiros, e podes ler todas as páginas e acabar todas as lições sem conta. Com a sessão fechada, o progresso e os pontos ficam no dispositivo e nunca são enviados. Iniciar sessão é opcional — com a Apple ou com a Google — e guarda apenas os teus XP, a tua sequência de dias e que lições acabaste, armazenados na UE. Não é uma verificação de idade e não a tratamos como tal: o que protege uma criança aqui é não haver nada para recolher, não haver publicidade e não haver forma de chegar a outra pessoa a partir de dentro do produto. Não recolhemos conscientemente informação pessoal de crianças com menos de 13 anos.',
  },
  'not-confident': {
    question: 'E se eu não perceber de economia o suficiente para ensinar?',
    answer:
      'Não precisas. Cada lição explica o mecanismo à medida que avança, e cada entrada do glossário liga à fonte primária — a Reserva Federal, o BCE, o Banco de Inglaterra — para poderes verificar qualquer afirmação sem acreditar na nossa palavra. A maior parte dos pais que faz o primeiro percurso diz ter percebido, pela primeira vez, como os bancos criam dinheiro.',
  },
};
