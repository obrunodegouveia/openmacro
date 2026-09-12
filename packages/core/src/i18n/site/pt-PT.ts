/**
 * Website copy — European Portuguese.
 *
 * Same conventions as the course: `tu` rather than `você`, European
 * vocabulary, AO90 spelling. Navigation labels are kept short because they sit
 * in a row that has to survive a narrow viewport — "Para pais" rather than a
 * literal rendering of "For parents".
 */
export const ptPT = {
  // ---- navigation ---------------------------------------------------------
  'nav.aria': 'Principal',
  'nav.demo': 'Demonstração',
  'nav.learn': 'Aprender',
  'nav.teach': 'Para pais',
  'nav.glossary': 'Glossário',
  'nav.syllabus': 'Programa',
  'nav.contribute': 'Contribuir',
  'nav.dashboard': 'Painel',
  'nav.github': 'GitHub',
  'nav.openMenu': 'Abrir menu',
  'nav.closeMenu': 'Fechar menu',

  // ---- hero ---------------------------------------------------------------
  'hero.title.lead': 'Percebe a',
  'hero.title.emphasis': 'Máquina',
  'hero.title.tail': 'por Trás do Dinheiro.',
  'hero.subtitle':
    'A plataforma aberta e gamificada que ensina macroeconomia, banca central e criação de crédito — um lançamento de balanço de cada vez.',
  'hero.start': 'Começar a aprender',
  'hero.continue': 'Continuar a aprender',
  'hero.signInA11y': 'Inicia sessão para começar a aprender',
  'hero.or': 'Ou',
  'hero.browse': 'vê as {count, number} lições',
  'hero.noAccount': '— sem precisares de conta.',
  'hero.openSource': 'Código aberto · Licença MIT · Construído com educadores',

  // ---- footer -------------------------------------------------------------
  'footer.aria': 'Rodapé',
  'footer.allLessons': 'Todas as lições',
  'footer.glossary': 'Glossário',
  'footer.privacy': 'Privacidade',
  'footer.contributors': 'contribuidores. Conteúdo apenas educativo —',
  'footer.mit': 'MIT',
  'footer.mitLicensed': 'Licenciado sob MIT',
  'footer.coppa': 'Concebido com a COPPA em mente',
  'footer.rewards': 'Recompensas sem custódia',
  'footer.mitBody':
    'O código e as lições são livres de usar, bifurcar, traduzir e ensinar — incluindo comercialmente.',
  'footer.coppaBody':
    'Não é preciso conta para aprender, não há publicidade comportamental, e não recolhemos dados pessoais de crianças com menos de 13 anos.',
  'footer.rewardsBody':
    'MacroXP e MintBucks são uma pontuação de aprendizagem, guardada no dispositivo a não ser que inicies sessão para a sincronizar. Os prémios são financiados e atribuídos pelo patrocinador — nunca ficamos com o dinheiro.',
  'footer.disclaimer': 'nada aqui é aconselhamento financeiro.',
  'footer.githubA11y': 'OpenMacro no GitHub',
  'footer.chatA11y': 'Chat da comunidade OpenMacro',

  // ---- features / philosophy ---------------------------------------------
  'features.overline': 'Funcionalidades e filosofia',
  'features.title.lead': 'As finanças pessoais ensinam-te a fazer um orçamento.',
  'features.title.mid': 'Nós ensinamos-te',
  'features.title.emphasis': 'a máquina',
  'features.lede': 'Três convicções moldam todas as lições que publicamos.',
  'features.budgeting.title': 'Não É Mais Uma App de Orçamentos',
  'features.budgeting.body':
    'Saber que deves saltar o café diário não te diz porque é que a renda subiu mais depressa do que o teu ordenado. E os cursos de «noções básicas de dinheiro» param exactamente onde a coisa fica interessante — no ponto em que terias de abrir o balanço de um banco central.',
  'features.budgeting.theirsHeading': 'As apps de orçamento perguntam',
  'features.budgeting.theirs.0': 'Para onde foi o meu dinheiro?',
  'features.budgeting.theirs.1': 'Posso dar-me a isto?',
  'features.budgeting.theirs.2': 'Quanto devo poupar?',
  'features.budgeting.oursHeading': 'O OpenMacro pergunta',
  'features.budgeting.ours.0': 'De quem é o passivo que este dinheiro representa?',
  'features.budgeting.ours.1': 'O que é liquidado quando um pagamento se concretiza?',
  'features.budgeting.ours.2': 'Que linha do balanço da Fed acabou de se mexer?',
  'features.openSource.title': '100% Código Aberto',
  'features.openSource.body':
    'As lições são JSON simples — sem React, sem passo de compilação. Um economista consegue escrever um cenário de conta-T num editor de texto e abrir um pull request pela interface web do GitHub.',
  'features.openSource.step.0': 'Bifurca o repositório',
  'features.openSource.step.1': 'Põe um ficheiro de lição em src/content/lessons',
  'features.openSource.step.2': 'A CI verifica se cada balanço fecha mesmo',
  'features.openSource.step.3': 'Um mantenedor revê a economia',
  'features.educator.title': 'Feito com Pais e Professores',
  'features.educator.body':
    'Construído com quem se vai sentar de facto ao lado de quem aprende. As ferramentas para a sala de aula e para a mesa da cozinha são funcionalidades de primeira, não um extra empresarial.',
  'features.educator.tracks.title': 'Percursos à medida',
  'features.educator.tracks.body':
    'Reordena módulos, esconde o que ainda não deste, e fixa uma lição como o trabalho de casa desta semana.',
  'features.educator.prizes.title': 'Prémios patrocinados',
  'features.educator.prizes.body':
    'Financia um prémio para a tua turma ou para o teu filho — livros, equipamento ou privilégios. Defines o objectivo e atribui-lo directamente.',
  'features.educator.ledger.title': 'Registo sem custódia',
  'features.educator.ledger.body':
    'O registo de recompensas vive no dispositivo de quem aprende. Sem carteira, sem dinheiro real, nada para levantar.',

  // ---- the four-tier model ------------------------------------------------
  'tiers.overline': 'O modelo',
  'tiers.title.lead': 'Quatro balanços,',
  'tiers.title.mid': 'uma',
  'tiers.title.emphasis': 'máquina',
  'tiers.lede':
    'O dinheiro é o passivo de alguém em todos os níveis. O OpenMacro ensina a hierarquia inteira, não uma caricatura do topo dela.',
  'tiers.tier': 'Nível {n, number}',
  'tiers.tierOf': 'Nível {n, number} · {subject}',
  'tiers.assets': 'Activo',
  'tiers.assetsHint': 'O que possui',
  'tiers.liabilities': 'Passivo',
  'tiers.liabilitiesHint': 'O que deve',
  'tiers.levers': 'O que aprendes a operar',

  // ---- account ------------------------------------------------------------
  'account.signIn': 'Iniciar sessão',
  'account.opening': 'A abrir a Google',
  'account.signOut': 'Terminar sessão',
  'account.openProgressA11y': '{name} — abre o teu progresso',
  'account.signOutOfA11y': 'Terminar a sessão da conta de {name}',
  'account.signedIn': 'Sessão iniciada',
  'account.keepProgress': 'Guarda o teu progresso',
  'account.syncedBody':
    'Os XP e a tua sequência de dias são guardados na tua conta à medida que acabas lições, por isso seguem-te para qualquer dispositivo onde inicies sessão.',
  'account.yourProgress': 'O teu progresso',
  'account.signedOutBody':
    'Uma conta guarda os teus XP e a tua sequência de dias para que sobrevivam a fechar o separador, e leva-os para o teu telemóvel. Iniciar sessão com a Google cria-a — não há registo separado nem palavra-passe para decorar.',
  'account.freeNotice':
    'Todas as lições são gratuitas sem conta — iniciar sessão só acrescenta memória. Recebemos da Google o teu nome, endereço de email e fotografia de perfil, e mais nada. Vê o nosso',
  'account.privacyLink': 'aviso de privacidade',

  // ---- animated balance sheet (home) --------------------------------------
  'sheet.eyebrow': 'Balanço do banco central',
  'sheet.easing': 'Expansão: a comprar obrigações',
  'sheet.tightening': 'Aperto: sem mexer',
  'sheet.qeOn': 'QE ligado',
  'sheet.qeOff': 'QE desligado',
  'sheet.total': 'Total',
  'sheet.note':
    'Os dois lados mexem-se juntos. As reservas com que o banco paga são criadas na hora — o balanço fecha sempre.',
  'sheet.assets.bonds': 'Obrigações do Estado',
  'sheet.assets.loans': 'Empréstimos a bancos',
  'sheet.assets.fx': 'Divisas e ouro',
  'sheet.liabilities.reserves': 'Reservas bancárias',
  'sheet.liabilities.currency': 'Moeda em circulação',
  'sheet.liabilities.capital': 'Capital e outros',

  // ---- contributor hub ----------------------------------------------------
  'contribute.overline': 'Centro de contribuição',
  'contribute.title.lead': 'Uma lição é um',
  'contribute.title.emphasis': 'ficheiro JSON',
  'contribute.title.tail': 'É essa a barreira toda.',
  'contribute.lede':
    'Economistas, professores e programadores contribuem todos da mesma maneira: um ficheiro, um pull request. Codifica uma operação de banco central como lançamentos, e a app joga-a.',
  'contribute.validated': 'Validado na CI contra',
  'contribute.validatedBy': 'por',
  'contribute.validatedTail':
    'que rejeita qualquer cenário cujos lançamentos esperados deixem um balanço por fechar — o erro que todos os contribuidores cometem à primeira.',
  'contribute.live': 'Em directo do GitHub',
  'contribute.awaiting': 'À espera da primeira versão',
  'contribute.stars': 'Estrelas no GitHub',
  'contribute.prs': 'PR abertos',
  'contribute.contributors': 'Contribuidores',
  'contribute.forks': 'Bifurcações',
  'contribute.countersNote':
    'Os contadores entram em funcionamento assim que o repositório for público. Até lá preferimos mostrar um traço a um número inventado.',
  'contribute.startHere': 'Começa por aqui',
  'contribute.goodFirst': 'As boas primeiras tarefas estão marcadas com',
  'contribute.goodFirstTail':
    'Traz a economia; nós ajudamos com as ferramentas. As revisões são sobre o mecanismo, não sobre a sintaxe.',
  'contribute.viewRepo': 'Ver o repositório',
  'contribute.joinDiscord': 'Entrar no Discord',
  'contribute.guide': 'Guia de contribuição',
  'contribute.browseLessons': 'Ver as lições',
  'contribute.openIssues': 'Questões abertas',

  // ---- playable teaser ----------------------------------------------------
  'demo.overline': 'Amostra jogável',
  'demo.title.lead': 'Não leias sobre QE.',
  'demo.title.emphasis': 'Faz os lançamentos.',
  'demo.lede':
    'Isto é um passo de lição a sério, avaliado pelo mesmo motor que a app usa: põe cada lançamento no balanço certo e do lado certo, e descobre o que se mexeu de facto. Sem registo, sem descarregar nada.',
  'demo.correct': 'É essa a operação.',
  'demo.wrong': 'Não é bem — experimenta a lição completa.',
  'demo.prompt': 'Coloca todos os lançamentos e depois verifica.',
  'demo.reset': 'Recomeçar',
  'demo.check': 'Verificar lançamentos',
  'demo.note':
    'Simplificado num aspecto: o balanço do próprio dealer fica fora do ecrã para caberem duas contas-T num telemóvel. Na app o dealer aparece como terceira entidade, e a mesma operação é repetida com contrapartes e montantes aleatórios para que a resposta não possa ser decorada.',

  // ---- syllabus -----------------------------------------------------------
  'roadmap.overline': 'Programa',
  'roadmap.title': '{count} percursos, das',
  'roadmap.title.first': 'obrigações fiscais',
  'roadmap.title.to': 'às',
  'roadmap.title.second': 'linhas de swap',
  'roadmap.lede':
    'Cada percurso constrói o mecanismo de que o seguinte depende, e todos eles acabam num balanço que lanças tu.',
  'roadmap.live': 'Em beta',
  'roadmap.beta': 'Em testes',
  'roadmap.drafting': 'Em escrita',
  'roadmap.planned': 'Planeado',

  // ---- rewards ------------------------------------------------------------
  'rewards.overline': 'O ciclo de incentivos',
  'rewards.title.lead': 'O conhecimento é gratuito.',
  'rewards.title.mid': 'A',
  'rewards.title.emphasis': 'retenção',
  'rewards.title.tail': 'é que é o produto.',
  'rewards.lede':
    'Todos os bancos centrais publicam o seu balanço. Quase ninguém lê um segunda vez. As recompensas existem para corrigir isso, e ganham-se demonstrando o mecanismo — nunca por aparecer.',
  'rewards.competency.title': 'Prova de Competência',
  'rewards.competency.body':
    'Micro-testes adaptativos e cenários de conta-T com parâmetros aleatórios. A mesma operação volta com contrapartes e montantes diferentes, por isso decorar uma chave de respostas não leva a lado nenhum.',
  'rewards.points.title': 'MacroXP e MintBucks',
  'rewards.points.body':
    'Pontos ganhos apenas através de domínio verificado, sequências diárias de análise e módulos concluídos. Não inflacionários por desenho: não há forma de os comprar, cultivar ou trocar.',
  'rewards.credentials.title': 'Credenciais por Níveis',
  'rewards.credentials.body':
    'Atestados criptográficos de uma competência demonstrada — «Especialista em Operações de Mercado Aberto», «Mecânico de Balanço: Arquitectura do BCE». Verificáveis por qualquer pessoa, emitidos só contra uma avaliação passada.',
  'rewards.prizes.title': 'Prémios e Recompensas',
  'rewards.prizes.body':
    'Patrocinados por pais, educadores e pela comunidade: livros (Mehrling, Bagehot, Stigum), equipamento ou privilégios definidos pela família. Os patrocinadores financiam e atribuem directamente — nunca a plataforma.',
  'rewards.notTitle': 'O que os pontos não são',
  'rewards.notBody':
    'Os MacroXP e os MintBucks são uma pontuação de aprendizagem. Não são moeda, não são um token que se compre ou venda, e não há bolsa, carteira nem forma de levantar dinheiro em lado nenhum do produto. Os prémios são financiados e atribuídos por quem os criou — um pai, uma escola, uma comunidade — e o OpenMacro nunca fica com a custódia do dinheiro. Nada aqui é uma aposta, e nada custa seja o que for a quem aprende.',

  // ---- footer link groups -------------------------------------------------
  'footer.group.learn': 'Aprender',
  'footer.group.build': 'Construir',
  'footer.group.legal': 'Legal',
  'footer.link.demo': 'Demonstração web',
  'footer.link.learn': 'Aprender sobre dinheiro',
  'footer.link.teach': 'Ensinar dinheiro às crianças',
  'footer.link.syllabus': 'Programa',
  'footer.link.model': 'O modelo',
  'footer.link.glossary': 'Glossário',
  'footer.link.repo': 'Repositório no GitHub',
  'footer.link.contributing': 'Guia de contribuição',
  'footer.link.issues': 'Questões abertas',
  'footer.link.privacy': 'Privacidade e aviso COPPA',
  'footer.link.licence': 'Licença MIT',

  // ---- for parents & educators --------------------------------------------
  'teach.overline': 'Para pais e educadores',
  'teach.title.lead': 'Como ensinar às crianças o que o dinheiro',
  'teach.title.emphasis': 'realmente é',
  'teach.lede':
    'A semanada ensina disciplina. Não explica porque sobem os preços nem de onde vem um empréstimo bancário — e as crianças fazem essas perguntas muito antes de ganharem seja o que for. Isto é o que ensinar, mais ou menos quando, e como dizê-lo.',
  'teach.badge.free': 'Gratuito, sem licença para comprar',
  'teach.badge.noAccounts': 'Sem contas para crianças',
  'teach.badge.noAds': 'Sem anúncios, sem rastreio',
  'teach.stagesTitle': 'O que introduzir, e quando',
  'teach.stagesLede':
    'As idades são orientação, não barreiras. Uma criança curiosa de nove anos que pergunte de onde vem o dinheiro está pronta para a resposta.',
  'teach.stage.1.age': '7 a 9 anos',
  'teach.stage.1.idea': 'O dinheiro é uma promessa, não uma coisa',
  'teach.stage.1.body':
    'Uma moeda não vale pelo metal. Funciona porque toda a gente a aceita e o Estado responde por ela. Pergunta o que aconteceria se uma loja deixasse de a aceitar — essa pergunta faz quase todo o ensino.',
  'teach.stage.2.age': '10 a 12 anos',
  'teach.stage.2.idea': 'Os bancos escrevem dinheiro quando emprestam',
  'teach.stage.2.body':
    'Pergunta de onde vem o dinheiro de um empréstimo. Quando responderem «dos aforradores», mostra-lhes que o saldo de nenhum aforrador desce. O número na conta de quem pediu é novo, e foi escrito.',
  'teach.stage.3.age': '13 a 16 anos',
  'teach.stage.3.idea': 'Alguém fixa o preço do dinheiro',
  'teach.stage.3.body':
    'As taxas de juro são decididas por um comité, e essa decisão chega à renda ou ao crédito à habitação da família. Os adolescentes que repararam nos preços a subir acham isto mais interessante do que conselhos de orçamento.',
  'teach.stage.4.age': '16+ anos',
  'teach.stage.4.idea': 'A máquina inteira',
  'teach.stage.4.body':
    'Balanços de bancos centrais, flexibilização quantitativa, o sistema do dólar offshore. A esta altura conseguem fazer os lançamentos sozinhos e verificar uma afirmação contra uma fonte da Reserva Federal.',
  'teach.questionsTitle': 'Perguntas que pais e professores fazem',
  'teach.safetyTitle': 'O que recolhemos da tua criança',
  'teach.safety.1':
    'Nada, a não ser que inicie sessão. Todas as lições se jogam por inteiro sem conta e, com a sessão fechada, o progresso e as sequências ficam no dispositivo e nunca são enviados.',
  'teach.safety.2': 'Sem analítica, sem publicidade e sem scripts de rastreio de terceiros.',
  'teach.safety.3':
    'Iniciar sessão é opcional e exige uma Conta Google, que a Google não emite a menores de 13 anos. Guarda uma coisa: os XP e a sequência de dias, para que a sigam noutro dispositivo.',
  'teach.safety.4':
    'Os pontos de recompensa são uma pontuação de aprendizagem — não são dinheiro nem carteira, e não há forma de os comprar ou levantar.',
  'teach.safety.5':
    'As contas e o progresso são guardados na UE (Irlanda), e quem aprende nunca consegue ler o de outra pessoa.',
  'teach.readPrivacy': 'Ler o aviso completo de privacidade e COPPA',
  'teach.tryLesson': 'Experimenta tu primeiro uma lição',
  'teach.learnYourself': 'Aprende tu',

  // ---- learn page ---------------------------------------------------------
  'learn.overline': 'Começa por aqui',
  'learn.title.lead': 'Como aprender o que o dinheiro',
  'learn.title.emphasis': 'realmente é',
  'learn.lede':
    'A maior parte do dinheiro não é impressa por um governo. É criada pelos bancos comerciais quando emprestam, e pelos bancos centrais quando compram activos. Tudo o resto decorre daí, e este é o caminho honesto mais curto para o perceber.',
  'learn.pathTitle': 'O percurso, por ordem',
  'learn.step.1.title': 'Faz uma operação a sério, antes de leres seja o que for',
  'learn.step.1.body':
    'A demonstração dá-te uma compra de 10 mil milhões de dólares por um banco central e pede-te que lances as entradas nos dois balanços. Dez minutos aqui tornam legível qualquer artigo sobre a Fed.',
  'learn.step.1.cta': 'Abrir a demonstração',
  'learn.step.2.title': 'Aprende o vocabulário como mecanismos, não como definições',
  'learn.step.2.body':
    'Reservas, repo, base monetária, flexibilização quantitativa. Cada entrada do glossário explica o que se move no balanço de quem, nomeia o equívoco habitual, e liga à fonte primária.',
  'learn.step.2.cta': 'Ler o glossário',
  'learn.step.3.title': 'Percorre os {count} percursos por ordem',
  'learn.step.3.body':
    'Do que torna aceitável um token sem cobertura, passando pela banca comercial e pelas alavancas da Fed e do BCE, até como se contém uma crise do dólar — e por fim o próprio balanço da Fed, tal como publicado esta semana. Cada percurso constrói o mecanismo de que o seguinte precisa.',
  'learn.step.3.cta': 'Ver o programa',
  'learn.questionsTitle': 'Perguntas frequentes',
  'learn.teachingTitle': 'Estás a ensinar alguém?',
  'learn.teachingBody':
    'Há um guia separado para pais, encarregados de educação e professores, sobre o que introduzir em que idade e como explicar a inflação e o dinheiro bancário a uma criança.',
  'learn.teachingCta': 'Como ensinar dinheiro às crianças',

  // ---- glossary -----------------------------------------------------------
  'glossary.back': 'Voltar a openmacro.org',
  'glossary.overline': 'Referência',
  'glossary.lede':
    'Todas as definições aqui descrevem um mecanismo como movimentos de balanço, nomeiam o equívoco que costuma trazer, e ligam à fonte primária. A precisão é que é o produto.',
  'glossary.read': 'Ler o mecanismo',

  // ---- login --------------------------------------------------------------
  'login.title': 'Iniciar sessão no OpenMacro',
  'login.body':
    'A tua conta faz uma coisa: lembra-se. Os XP e a tua sequência de dias seguem-te para qualquer dispositivo onde inicies sessão.',

  // ---- not found ----------------------------------------------------------
  'notFound.title': 'Esta página não fecha.',
  'notFound.body':
    'O endereço que seguiste não existe. Pode ter mudado, ou pode nunca ter estado aqui.',
  'notFound.home': 'Voltar à página inicial',
  'notFound.glossary': 'Ver o glossário',

  // ---- module briefs (working material) -----------------------------------
  'briefs.overline': 'Material de trabalho',
  'briefs.title.lead': 'Um resumo por módulo, pronto a',
  'briefs.title.emphasis': 'transformar em vídeo',
  'briefs.lede':
    'Cada ligação abaixo devolve esse módulo em texto simples: as perguntas a que responde, o mecanismo por trás de cada uma, os equívocos com as respectivas refutações, e as conclusões. Cola uma ligação no NotebookLM como fonte web e pede-lhe um Video Overview.',
  'briefs.lessons': '{count, plural, one {# lição} other {# lições}}',
  'briefs.videoLive': 'vídeo publicado',
  'briefs.videoNone': 'ainda sem vídeo',
  'briefs.howTitle': 'Como fazer um',
  'briefs.step.1': '1. Abre o NotebookLM e acrescenta a ligação do módulo como fonte web.',
  'briefs.step.2': '2. Pede um Video Overview. Os títulos do resumo tornam-se os diapositivos.',
  'briefs.step.3': '3. Publica o resultado num sítio com um endereço estável.',
  'briefs.step.4': '4. Acrescenta-o ao módulo em',
  'briefs.step.4.as': 'como',
  'briefs.step.4.tail': ', e aparece por cima das lições desse módulo.',
  'briefs.noApi':
    'Ainda não há API para isto — a API de notebooks da Google é só para empresas e não expõe a geração de vídeo — por isso o passo dois faz-se à mão, uma vez por módulo. Os resumos são a parte que vale a pena automatizar e são gerados a partir do próprio curso, por isso não conseguem descrever uma lição que já não existe.',
  'briefs.privacy':
    'Os vídeos são incorporados sem contactar o YouTube até alguém carregar em reproduzir, por isso o aviso de privacidade mantém-se verdadeiro para quem não vê. Vê',
  'briefs.privacyLink': 'o aviso de privacidade',

  // ---- a glossary entry ---------------------------------------------------
  'term.allTerms': 'Todos os termos',
  'term.mechanics': 'A mecânica',
  'term.misreading': 'O equívoco habitual',
  'term.related': 'Termos relacionados',
  'term.sources': 'Fontes primárias',
  'term.postIt': 'Lança tu',
  'term.postItBody':
    'Ler uma definição não é o mesmo que conseguir trabalhar o mecanismo. A demonstração dá-te uma operação a sério e pede-te que coloques os lançamentos.',
  'term.tryDemo': 'Experimenta a demonstração de contas-T',

  // ---- privacy & COPPA notice ---------------------------------------------
  'privacy.back': 'Voltar a openmacro.org',
  'privacy.title': 'Aviso de privacidade e de privacidade infantil',
  'privacy.updated': 'Última actualização: 5 de Setembro de 2026. Abrange {domain} e a aplicação móvel OpenMacro.',
  'privacy.authoritative':
    'Esta é uma tradução de cortesia. Em caso de divergência, prevalece a versão inglesa.',
  'privacy.short.title': 'A versão curta',
  'privacy.short.body':
    'Podes ler todas as páginas, jogar todas as simulações e acabar todas as lições deste sítio sem conta, e não usamos analítica, publicidade nem scripts de rastreio de terceiros. Se escolheres iniciar sessão com a Google, guardamos os teus XP e a tua sequência de dias para que te sigam entre dispositivos — é essa a única razão para existir uma conta, e os únicos dados pessoais que detemos.',
  'privacy.collect.title': 'O que recolhemos',
  'privacy.collect.google.label': 'Se iniciares sessão com a Google.',
  'privacy.collect.google.body':
    'A Google envia-nos o teu nome, endereço de email, fotografia de perfil e o identificador da tua conta Google. Guardamos o teu nome associado ao teu progresso, e o endereço de email fica com o nosso fornecedor de autenticação para que possas voltar a entrar.',
  'privacy.collect.progress.label': 'O teu progresso, depois de iniciares sessão.',
  'privacy.collect.progress.body':
    'O total de XP, a tua sequência de dias, a data da última lição concluída e, para cada lição, a tua melhor pontuação, quantas vezes a acabaste e quando. Sem respostas, sem tempos, nada sobre como jogaste.',
  'privacy.collect.logs.label': 'Registos do servidor.',
  'privacy.collect.logs.body':
    'O nosso alojamento regista pedidos padrão — endereço IP, data e hora, caminho pedido, agente do navegador — para manter o serviço a funcionar e bloquear abusos. São conservados 30 dias e depois apagados.',
  'privacy.collect.sim.label': 'Nada do simulador.',
  'privacy.collect.sim.body':
    'O cursor, os valores apresentados e a cadeia de crédito correm todos no teu navegador. O que introduzes nunca nos é enviado.',
  'privacy.notCollect.title': 'O que não recolhemos',
  'privacy.notCollect.1': 'Sem cookies para publicidade, perfis ou rastreio entre sítios.',
  'privacy.notCollect.2': 'Sem serviços de analítica ou de gravação de sessões.',
  'privacy.notCollect.3':
    'Sem moradas, números de telefone ou dados de pagamento. Nunca pedimos uma palavra-passe: é a Google que trata do início de sessão, por isso não há nenhuma para guardarmos.',
  'privacy.notCollect.4': 'Sem venda, aluguer ou troca de quaisquer dados, nunca.',
  'privacy.coppa.title': 'Crianças com menos de 13 anos (COPPA)',
  'privacy.coppa.intro':
    'O OpenMacro é escrito para jovens adultos e crianças, por isso tratamos a privacidade infantil como uma restrição de desenho e não como uma página de política.',
  'privacy.coppa.1':
    'Não é preciso conta para aprender. Todas as lições, no sítio e na aplicação, se jogam por inteiro sem iniciar sessão, e enquanto estiveres com a sessão fechada o progresso fica no dispositivo e nunca é enviado.',
  'privacy.coppa.2':
    'Iniciar sessão é opcional e exige uma Conta Google, que a Google não emite a crianças com menos de 13 anos — e menos de 16 nalguns países. Uma criança com uma conta Family Link só inicia sessão com aprovação de quem tem responsabilidade parental.',
  'privacy.coppa.3.lead':
    'Não recolhemos conscientemente informação pessoal de crianças com menos de 13 anos. Se achares que uma criança iniciou sessão, escreve para',
  'privacy.coppa.3.tail': 'e apagamos a conta e tudo o que lhe está associado.',
  'privacy.coppa.4':
    'Os MacroXP e os MintBucks são uma pontuação de aprendizagem. Não são moeda nem carteira, e não podem ser trocados, transferidos ou levantados. Não há forma de comprar seja o que for no produto.',
  'privacy.coppa.5':
    'As credenciais de competência só são emitidas quando quem aprende as pede e, para menores de 13 anos, apenas com autorização de quem tem responsabilidade parental. Não publicamos o desempenho, o nome ou o identificador de uma criança em nenhum registo público ou de terceiros.',
  'privacy.coppa.6':
    'Os prémios são criados, financiados e atribuídos pelo patrocinador — um pai, uma escola ou um grupo comunitário. O OpenMacro nunca fica com a custódia do dinheiro nem trata de pagamentos. A participação é sempre gratuita, e nada no produto é uma aposta.',
  'privacy.coppa.7':
    'Não há publicidade, não há compras dentro da aplicação, e não há chat nem qualquer outra comunicação entre crianças e desconhecidos em parte alguma do produto.',
  'privacy.coppa.8':
    'Não é exigida prova de identidade para pedir uma eliminação, e nunca pedimos a uma criança que prove seja o que for antes de a cumprirmos.',
  'privacy.where.title': 'Onde ficam os dados',
  'privacy.where.1':
    'O sítio corre no Google Cloud Run. As contas e o progresso são guardados na Supabase, na região Oeste da UE (Irlanda) — os dados de quem aprende não saem da UE. O início de sessão em si é tratado pela Google.',
  'privacy.where.2':
    'Cada linha está protegida por segurança ao nível da linha na base de dados, associada à tua conta, para que ninguém consiga ler o progresso de outra pessoa, e a chave incluída no sítio só consegue alcançar as tuas próprias linhas. Guardamos o teu progresso até nos pedires que o apaguemos.',
  'privacy.choices.title': 'As tuas opções',
  'privacy.choices.1': 'Termina a sessão quando quiseres. Podes continuar a usar todas as lições com a sessão fechada.',
  'privacy.choices.2.lead': 'Escreve para',
  'privacy.choices.2.tail':
    'para veres, corrigires ou apagares o que temos, incluindo a tua conta inteira. Respondemos no prazo de 30 dias.',
  'privacy.choices.3.lead': 'Também podes revogar o acesso do OpenMacro nas tuas',
  'privacy.choices.3.link': 'permissões da conta Google',
  'privacy.choices.4':
    'Apaga a aplicação para eliminar o progresso guardado no dispositivo. Se nunca iniciaste sessão, não sobra nada do nosso lado.',
  'privacy.changes.title': 'Alterações e questões',
  'privacy.changes.lead':
    'As alterações materiais serão publicadas aqui com uma data nova. Este aviso vive no mesmo repositório de código aberto que o sítio, por isso o seu histórico completo é público — lê-o no',
  'privacy.changes.tail': '. As questões vão para',

  // ---- treasury (admin) ---------------------------------------------------
  'treasury.loading': 'A carregar…',
  'treasury.notFound': 'Não encontrado',
  'treasury.denied': 'Não há nada aqui para esta conta.',
  'treasury.loadError': 'Não foi possível carregar a tesouraria.',
  'treasury.title': 'Tesouraria',
  'treasury.signedInAs': 'Sessão iniciada como {email}',
  'treasury.funds': 'Fundos',
  'treasury.eurc': 'EURC',
  'treasury.eth': 'ETH (gás)',
  'treasury.topUp': 'Carregar este endereço',
  'treasury.copy': 'Copiar',
  'treasury.networkWarning.lead': 'Envia EURC e ETH apenas na rede',
  'treasury.networkWarning.tail':
    '. O mesmo endereço noutra rede não chega e não pode ser recuperado.',
  'treasury.attention': 'Precisa de atenção',
  'treasury.attentionBody':
    'Estas pararam entre a difusão e o registo. Procura o nonce do endereço da tesouraria no BaseScan: se existir uma transacção o dinheiro saiu, se não existir não saiu. Não repitas o pagamento — uma transacção pendente ainda pode ser minada.',
  'treasury.nonce': 'nonce',
  'treasury.wasPaid': 'Foi paga',
  'treasury.neverSent': 'Nunca saiu',
  'treasury.recipients': 'Quem pode ser pago',
  'treasury.recipientsBody.lead': 'Um endereço novo começa',
  'treasury.recipientsBody.pending': 'pendente',
  'treasury.recipientsBody.tail':
    'e não pode receber uma recompensa do jogo. Envia um teste, confirma que chegou à conta Coinbase, e só depois activa.',
  'treasury.perModule': '{amount} € por módulo',
  'treasury.defaultAmount': 'valor por omissão',
  'treasury.claimedBy': 'reclamado por {email}',
  'treasury.unbound': 'sem conta associada — ninguém pode ganhar para esta carteira',
  'treasury.sending': 'A enviar…',
  'treasury.testSend': 'Enviar teste de 1 €',
  'treasury.activate': 'Activar',
  'treasury.disable': 'Desactivar',
  'treasury.nobody': 'Ainda ninguém.',
  'treasury.payouts': 'Pagamentos recentes',
  'treasury.baseScan': 'BaseScan ↗',
  'treasury.noPayouts': 'Ainda sem pagamentos.',
  'treasury.adminLog': 'Registo de administração',
  'treasury.noLog': 'Ainda sem registos.',
  'treasury.addRecipient': 'Adicionar destinatário',
  'treasury.field.key': 'Chave (usada pelo jogo)',
  'treasury.field.keyPlaceholder': 'filha',
  'treasury.field.name': 'Nome',
  'treasury.field.namePlaceholder': 'Sofia',
  'treasury.field.address': 'Endereço de depósito Coinbase na Base',
  'treasury.field.amount': 'Recompensa por módulo em euros (opcional)',
  'treasury.field.claimant': 'Conta que reclama para ele',
  'treasury.field.claimantPlaceholder': 'ela@email.com',
  'treasury.field.note': 'Nota (opcional)',
  'treasury.addedPending':
    'Adicionado como pendente. Não pode receber recompensa enquanto não enviares um teste e o activares.',
  'treasury.add': 'Adicionar',
  'treasury.cancel': 'Cancelar',

  // ---- dashboard ----------------------------------------------------------
  'dash.noBackend.lead':
    'Esta versão não tem servidor de contas configurado, por isso não há progresso para mostrar. Todas as lições continuam a funcionar — vê',
  'dash.noBackend.link': 'o curso',
  'dash.nothingYet': 'Ainda não acabaste nada — escolhe o que quiseres aqui em baixo.',
  'dash.finished': '{done, number} de {total, number} lições concluídas',
  'dash.signOut': 'Terminar sessão',
  'dash.loadFailed':
    'Não foi possível carregar o teu progresso agora. As tuas lições continuam a funcionar — tenta recarregar a página.',
  'dash.progressAria': 'O teu progresso',
  'dash.totalXp': 'XP total',
  'dash.dayStreak': 'Dias seguidos',
  'dash.courseComplete': 'Curso concluído',
  'dash.lessonsOf': '{done, number} de {total, number} lições',
  'dash.continueAria': 'Continuar',
  'dash.startHere': 'Começa por aqui',
  'dash.pickUp': 'Continua de onde ficaste',
  'dash.allDone': 'Todas as lições concluídas.',
  'dash.allDoneBody':
    'Repete qualquer uma para subir a melhor pontuação — ou escreve uma, já que o conteúdo é de código aberto.',
  'dash.onDevice': 'Isto fica guardado neste dispositivo',
  'dash.onDeviceBody':
    'Tudo o que está acima está guardado neste navegador. Iniciar sessão mantém-no se limpares o navegador, e leva-o para o teu telemóvel — o que já fizeste é integrado, não substituído.',
  'dash.allModulesAria': 'Todos os módulos',
  'dash.moduleProgressAria': 'Progresso de {title}',
  'dash.best': 'Melhor {best, number} / {max, number} XP',
  'dash.runs': '· {count, number} tentativas',
  'dash.xpAvailable': '{max, number} XP disponíveis',
  'dash.fullMarks': 'Pontuação máxima',
  'dash.replay': 'Repetir',

  // ---- module rewards -----------------------------------------------------
  'moduleRewards.title': 'Recompensas',
  'moduleRewards.rate': '{amount} por módulo · {earned} € ganhos',
  'moduleRewards.body':
    'Acaba todas as lições de um módulo e a recompensa é tua, paga em EURC directamente para a tua conta Coinbase.',
  'moduleRewards.ready': '{count, number} prontas a reclamar',
  'moduleRewards.lessons': '{done, number} de {total, number} lições',
  'moduleRewards.paidLink': 'Pago ↗',
  'moduleRewards.paid': 'Pago',
  'moduleRewards.sending': 'A enviar…',
  'moduleRewards.claim': 'Reclamar {amount} €',

  // ---- challenge widgets --------------------------------------------------
  'tflow.entries': 'Lançamentos a fazer',
  'tflow.placed': '{done, number} de {total, number} colocados',
  'tflow.chooseSide': 'Agora escolhe em que balanço cai, e de que lado.',
  'tflow.pickEntry':
    'Escolhe um lançamento, e depois em que balanço cai e de que lado. Todos os balanços têm de fechar.',
  'tflow.startOver': 'Recomeçar',
  'tflow.balanced': 'Equilibrado',
  'tflow.offBalance': 'Não fecha',
  'tflow.assets': 'Activo',
  'tflow.liabilities': 'Passivo',
  'tflow.assetsHint': 'O que possui',
  'tflow.liabilitiesHint': 'O que deve',
  'tflow.removeA11y': 'Remover {account} de {entity} {side}',
  'tflow.placeA11y': 'Colocar o lançamento escolhido no {side} de {entity}',
  'tflow.placeHere': 'Colocar aqui',
  'tflow.opening': 'Abertura {amount}',
  'match.nowDefinition': 'Agora escolhe a definição',
  'match.pickTerm': 'Escolhe um termo e depois a sua definição',
  'match.change': 'Mudar',
  'order.earliestTop': 'A causa mais antiga em cima',
  'order.moveEarlier': 'Mover «{label}» para cima',
  'order.moveLater': 'Mover «{label}» para baixo',
  'sim.done': '— feito',
  'sim.notYet': '— ainda não',
  'player.min': '{count, number} min',
  'player.xpAvailable': '{count, number} XP disponíveis',
  'player.challenges': '{count, plural, one {# desafio} other {# desafios}}',
  'player.xp': '{count, number} XP',
  'map.play': 'Jogar',
  'map.replay': 'Repetir',
  'video.overview': '{title} — visão geral',
  'snippet.copy': 'Copiar',
  'snippet.copied': 'Copiado',
  'permalink.copy': 'Copiar uma ligação para {label}',
  'permalink.copied': 'Ligação copiada',
  'permalink.copiedLive': 'Ligação copiada para a área de transferência',
  'google.opening': 'A abrir a Google',
  'layout.skip': 'Saltar para o conteúdo',
  'glossary.title.lead': 'A',
  'glossary.title.emphasis': 'máquina monetária',
  'glossary.title.tail': ', termo a termo.',
  'glossary.tier': 'Nível {n, number}',
  'glossary.terms': '{count, plural, one {# termo} other {# termos}}',
  'glossary.alsoCalled': 'Também conhecido por:',
  'learn.badge.free': 'Gratuito para sempre',
  'learn.badge.noAccount': 'Sem necessidade de conta',
  'learn.badge.mit': 'Licenciado sob MIT',
  'login.noAccount.lead': 'Sem conta? Iniciar sessão com a Google cria uma. Ou',
  'login.noAccount.link': 'começa a aprender',
  'login.noAccount.tail': '— todas as lições são gratuitas, com ou sem sessão iniciada.',
  'roadmap.track': 'Percurso {n, number}',
  'roadmap.lessons': '{count, plural, one {# lição} other {# lições}}',
  'roadmap.operatesOn': 'Opera sobre',
} as const;
