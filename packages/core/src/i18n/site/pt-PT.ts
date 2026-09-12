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
} as const;
