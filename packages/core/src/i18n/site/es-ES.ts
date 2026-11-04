/**
 * Website copy — Spanish (Spain), readable across Latin America.
 *
 * Same conventions as the course: `tú`, never `usted` or `vosotros`, and Banco
 * de España / BCE terminology — `tipo de interés`, not `tasa`. Navigation
 * labels are kept short because they sit in a row that has to survive a narrow
 * viewport. Acronyms and proper names stay as they are.
 */
export const esES = {
  // ---- navigation ---------------------------------------------------------
  'embed.frameTitle': 'Vídeo de lección de OpenMacro',
  'nav.signIn': 'Iniciar sesión',
  'nav.home': 'Inicio',
  'nav.aria': 'Principal',
  'nav.demo': 'Demo',
  'nav.learn': 'Aprender',
  'nav.teach': 'Familias y docentes',
  'nav.glossary': 'Glosario',
  'nav.syllabus': 'Programa',
  'nav.contribute': 'Colaborar',
  'nav.dashboard': 'Hoy',
  'nav.github': 'GitHub',
  'nav.menu.title': 'Menú',
  'nav.menu.browse': 'Explorar',
  'nav.menu.account': 'Cuenta',
  'nav.menu.project': 'Proyecto',
  'nav.openMenu': 'Abrir menú',
  'nav.closeMenu': 'Cerrar menú',
  'nav.tabs': 'Secciones',
  'nav.more': 'Más',

  // ---- hero ---------------------------------------------------------------
  'hero.title.lead': 'Entiende la',
  'hero.title.emphasis': 'máquina',
  'hero.title.tail': 'detrás del dinero.',
  'hero.stat.tiers': 'Niveles de balance',
  'hero.stat.lessons': 'Lecciones disponibles',
  'hero.stat.free': 'Gratis, para siempre',
  'hero.subtitle':
    'La plataforma gamificada y de código abierto que enseña macroeconomía, banca central y creación de crédito, un asiento de balance cada vez.',
  'hero.start': 'Empezar a aprender',
  'hero.continue': 'Seguir aprendiendo',
  'hero.signInA11y': 'Inicia sesión para empezar a aprender',
  'hero.startFirst': 'Empezar la primera lección',
  'hero.haveAccount': '¿Ya estás aprendiendo?',
  'hero.signIn': 'Iniciar sesión',
  'hero.or': 'O',
  'hero.browse': 'mira las {count, number} lecciones',
  'hero.noAccount': '— sin necesidad de cuenta.',
  'hero.openSource': 'Código abierto · Licencia MIT · Creado con educadores',

  // ---- footer -------------------------------------------------------------
  'footer.aria': 'Pie de página',
  'footer.allLessons': 'Todas las lecciones',
  'footer.glossary': 'Glosario',
  'footer.privacy': 'Privacidad',
  'footer.contributors': 'colaboradores. Contenido solo educativo —',
  'footer.mit': 'MIT',
  'footer.mitLicensed': 'Licencia MIT',
  'footer.coppa': 'Pensado para cumplir la COPPA desde el diseño',
  'footer.rewards': 'Recompensas pagadas por gente que conoces',
  'footer.mitBody':
    'El código y las lecciones se pueden usar, bifurcar, traducir y enseñar gratis, también con fines comerciales.',
  'footer.coppaBody':
    'No hace falta cuenta para aprender, no hay anuncios basados en el comportamiento y no se recogen datos personales de menores de 13 años.',
  'footer.rewardsBody':
    'MacroXP y MintBucks son una puntuación de aprendizaje que nadie puede comprar ni intercambiar. Un padre, una madre o un docente puede decidir pagar por ella a quien aprende en euros (EURC). Eso se configura y se retira en la web, nunca en la app.',
  'footer.disclaimer': 'nada de esto es asesoramiento financiero.',
  'footer.githubA11y': 'OpenMacro en GitHub',
  'footer.chatA11y': 'Chat de la comunidad de OpenMacro',

  // ---- features / philosophy ---------------------------------------------
  'features.overline': 'Características y filosofía',
  'features.title.lead': 'Las finanzas personales te enseñan a hacer un presupuesto.',
  'features.title.mid': 'Nosotros te enseñamos',
  'features.title.emphasis': 'la máquina',
  'features.lede': 'Tres convicciones dan forma a cada lección que publicamos.',
  'features.budgeting.title': 'No es otra app de presupuestos',
  'features.budgeting.body':
    'Saber que debes saltarte el café diario no te dirá por qué el alquiler ha subido más que tu sueldo. Y los cursos de «conceptos básicos del dinero» se detienen justo donde se pone interesante: en el punto en que tendrías que abrir el balance de un banco central.',
  'features.budgeting.theirsHeading': 'Las apps de presupuestos preguntan',
  'features.budgeting.theirs.0': '¿Adónde ha ido mi dinero?',
  'features.budgeting.theirs.1': '¿Me lo puedo permitir?',
  'features.budgeting.theirs.2': '¿Cuánto debería ahorrar?',
  'features.budgeting.oursHeading': 'OpenMacro pregunta',
  'features.budgeting.ours.0': '¿De quién es pasivo este dinero?',
  'features.budgeting.ours.1': '¿Qué se liquida cuando se compensa un pago?',
  'features.budgeting.ours.2': '¿Qué línea del balance de la Fed se acaba de mover?',
  'features.openSource.title': '100 % código abierto',
  'features.openSource.body':
    'Las lecciones son JSON sin más: ni React ni paso de compilación. Una economista puede escribir un escenario de cuenta en T en un editor de texto y abrir un pull request desde la web de GitHub.',
  'features.openSource.step.0': 'Haz un fork del repositorio',
  'features.openSource.step.1': 'Añade un archivo de lección en src/content/lessons',
  'features.openSource.step.2': 'La CI comprueba que todos los balances cuadran de verdad',
  'features.openSource.step.3': 'Una persona responsable revisa la economía',
  'features.educator.title': 'Guiado por familias y docentes',
  'features.educator.body':
    'Creado con quienes de verdad se sientan junto a quien aprende. Las herramientas para el aula y para la mesa de la cocina son funciones de primera clase, no un extra de pago para empresas.',
  'features.educator.tracks.title': 'Itinerarios a medida',
  'features.educator.tracks.body':
    'Reordena módulos, oculta lo que aún no hayas visto y fija una lección como los deberes de esta semana.',
  'features.educator.prizes.title': 'Bolsas de premios patrocinadas',
  'features.educator.prizes.body':
    'Financia un premio para tu clase o para tu hijo o hija: libros, equipos o privilegios. Tú fijas el objetivo y lo entregas directamente.',
  'features.educator.ledger.title': 'Recompensas reales, si quieres',
  'features.educator.ledger.body':
    'Un padre, una madre o un docente puede recompensar en euros (EURC) los XP y el tiempo activo que gane quien aprende. El dinero es suyo y solo se retira en la web. La app muestra XP, nunca dinero.',

  // ---- the four-tier model ------------------------------------------------
  'tiers.overline': 'El modelo',
  'tiers.title.lead': 'Cuatro balances,',
  'tiers.title.mid': 'una',
  'tiers.title.emphasis': 'máquina',
  'tiers.lede':
    'En cada nivel, el dinero es el pasivo de alguien. OpenMacro enseña toda la jerarquía, no una caricatura de su parte más alta.',
  'tiers.tier': 'Nivel {n, number}',
  'tiers.tierOf': 'Nivel {n, number} · {subject}',
  'tiers.assets': 'Activo',
  'tiers.assetsHint': 'Lo que posee',
  'tiers.liabilities': 'Pasivo',
  'tiers.liabilitiesHint': 'Lo que debe',
  'tiers.levers': 'Lo que aprendes a manejar',

  // ---- account ------------------------------------------------------------
  'account.signIn': 'Iniciar sesión',
  'account.opening': 'Abriendo Google',
  'account.signOut': 'Cerrar sesión',
  'account.openProgressA11y': '{name}: abrir tu progreso',
  'account.signOutOfA11y': 'Cerrar la sesión de {name}',
  'account.signedIn': 'Has iniciado sesión',
  'account.keepProgress': 'Conserva tu progreso',
  'account.syncedBody':
    'Tus XP y tu racha de días se guardan en tu cuenta a medida que terminas lecciones, y te siguen a cualquier dispositivo en el que inicies sesión.',
  'account.yourProgress': 'Tu progreso',
  'account.signedOutBody':
    'Una cuenta guarda tus XP y tu racha de días para que sobrevivan al cerrar la pestaña, y los lleva a tu móvil. Se crea al iniciar sesión con Google: no hay registro aparte ni contraseña que recordar.',
  'account.freeNotice':
    'Todas las lecciones se pueden hacer gratis sin cuenta: iniciar sesión solo añade memoria. Recibimos de Google tu nombre, tu correo electrónico y tu foto de perfil, y nada más. Consulta nuestro',
  'account.privacyLink': 'aviso de privacidad',

  // ---- animated balance sheet (home) --------------------------------------
  'sheet.eyebrow': 'Balance de un banco central',
  'sheet.easing': 'Expansión: comprando bonos',
  'sheet.tightening': 'Endurecimiento: sin cambios',
  'sheet.qeOn': 'QE activada',
  'sheet.qeOff': 'QE desactivada',
  'sheet.total': 'Total',
  'sheet.note':
    'Los dos lados se mueven juntos. Las reservas con las que paga el banco se crean en el momento: el balance siempre cuadra.',
  'sheet.assets.bonds': 'Deuda pública',
  'sheet.assets.loans': 'Préstamos a bancos',
  'sheet.assets.fx': 'Divisas y oro',
  'sheet.liabilities.reserves': 'Reservas bancarias',
  'sheet.liabilities.currency': 'Efectivo en circulación',
  'sheet.liabilities.capital': 'Capital y otros',

  // ---- contributor hub ----------------------------------------------------
  'contribute.overline': 'Centro de colaboradores',
  'contribute.title.lead': 'Una lección es un',
  'contribute.title.emphasis': 'archivo JSON',
  'contribute.title.tail': 'Esa es toda la barrera.',
  'contribute.lede':
    'Economistas, docentes y desarrolladores colaboran todos igual: un archivo, un pull request. Codifica una operación de un banco central como asientos y la app la reproduce.',
  'contribute.validated': 'Validado en la CI con',
  'contribute.validatedBy': 'por',
  'contribute.validatedTail':
    'que rechaza cualquier escenario cuyos asientos esperados dejen un balance sin cuadrar, el error que comete todo el que colabora por primera vez.',
  'contribute.live': 'En directo desde GitHub',
  'contribute.awaiting': 'A la espera de la primera versión',
  'contribute.stars': 'Estrellas en GitHub',
  'contribute.prs': 'PR abiertos',
  'contribute.contributors': 'Colaboradores',
  'contribute.forks': 'Forks',
  'contribute.countersNote':
    'Los contadores se activan en cuanto el repositorio sea público. Hasta entonces preferimos mostrar un guion antes que un número inventado.',
  'contribute.startHere': 'Empieza aquí',
  'contribute.goodFirst': 'Las buenas primeras incidencias llevan la etiqueta',
  'contribute.goodFirstTail':
    'Tú pones la economía; nosotros te ayudamos con las herramientas. Las revisiones tratan del mecanismo, no de la sintaxis.',
  'contribute.viewRepo': 'Ver el repositorio',
  'contribute.joinDiscord': 'Unirse a Discord',
  'contribute.guide': 'Guía para colaborar',
  'contribute.browseLessons': 'Ver lecciones',
  'contribute.openIssues': 'Incidencias abiertas',

  // ---- playable teaser ----------------------------------------------------
  'demo.overline': 'Avance jugable',
  'demo.title.lead': 'No leas sobre la QE.',
  'demo.title.emphasis': 'Registra los asientos.',
  'demo.lede':
    'Este es un paso real de una lección, corregido por el mismo motor que usa la app: coloca cada asiento en el balance y el lado correctos, y luego descubre qué se ha movido de verdad. Sin registro ni descargas.',
  'demo.correct': 'Esa es la operación.',
  'demo.wrong': 'No del todo: prueba la lección completa.',
  'demo.prompt': 'Coloca todos los asientos y comprueba.',
  'demo.reset': 'Restablecer',
  'demo.check': 'Comprobar asientos',
  'demo.note':
    'Simplificado en un aspecto: el balance del propio dealer queda fuera de la pantalla para que quepan dos cuentas en T en un móvil. En la app, el dealer aparece como tercera entidad, y la misma operación se repite con contrapartes e importes aleatorios para que la respuesta no se pueda memorizar.',

  // ---- syllabus -----------------------------------------------------------
  'roadmap.overline': 'Programa',
  'roadmap.title': '{count} itinerarios, de las',
  'roadmap.title.first': 'obligaciones fiscales',
  'roadmap.title.to': 'a las',
  'roadmap.title.second': 'líneas de swap',
  'roadmap.lede':
    'Cada itinerario construye el mecanismo del que depende el siguiente, y todos terminan en un balance que registras tú.',
  'roadmap.live': 'Disponible en beta',
  'roadmap.beta': 'En pruebas',
  'roadmap.drafting': 'En redacción',
  'roadmap.planned': 'Previsto',

  // ---- rewards ------------------------------------------------------------
  'rewards.overline': 'El ciclo de incentivos',
  'rewards.title.lead': 'El conocimiento es gratis.',
  'rewards.title.mid': 'La',
  'rewards.title.emphasis': 'retención',
  'rewards.title.tail': 'es el producto.',
  'rewards.lede':
    'Todos los bancos centrales publican su balance. Casi nadie lee uno dos veces. Las recompensas existen para arreglar eso, y se ganan demostrando el mecanismo, nunca por aparecer.',
  'rewards.competency.title': 'Prueba de competencia',
  'rewards.competency.body':
    'Micropruebas adaptativas y escenarios de cuentas en T con parámetros aleatorios. La misma operación vuelve con otras contrapartes e importes, así que memorizar las respuestas no te lleva a ninguna parte.',
  'rewards.points.title': 'MacroXP y MintBucks',
  'rewards.points.body':
    'Puntos que solo se ganan con un dominio verificado, rachas diarias de análisis y módulos completados. No inflacionarios por diseño: no hay forma de comprarlos, acumularlos con trucos ni intercambiarlos.',
  'rewards.credentials.title': 'Credenciales por niveles',
  'rewards.credentials.body':
    'Certificados criptográficos de una habilidad demostrada: «Especialista en operaciones de mercado abierto», «Mecánica de balances: arquitectura del BCE». Cualquiera puede verificarlos, y solo se emiten tras superar una evaluación.',
  'rewards.prizes.title': 'Bolsas de premios y recompensas',
  'rewards.prizes.body':
    'Patrocinados por familias, docentes y la comunidad: libros (Mehrling, Bagehot, Stigum), equipos o privilegios fijados en casa. Quienes patrocinan los financian y entregan directamente, nunca la plataforma.',
  'rewards.notTitle': 'Los puntos y el dinero van por separado',
  'rewards.notBody':
    'MacroXP y MintBucks son una puntuación de aprendizaje. Nadie puede comprarlos, venderlos ni intercambiarlos. Aparte, un padre, una madre o un docente puede decidir pagar en euros (EURC) los XP y el tiempo activo que gane quien aprende. Ese dinero lo pone quien lo configura, solo se retira en la web y nunca aparece en la app. Nada de esto es una apuesta, y nada le cuesta nada a quien aprende.',

  // ---- footer link groups -------------------------------------------------
  'footer.group.learn': 'Aprender',
  'footer.group.build': 'Construir',
  'footer.group.legal': 'Legal',
  'footer.link.demo': 'Demo web',
  'footer.link.learn': 'Aprende sobre el dinero',
  'footer.link.teach': 'Enseña a los niños sobre el dinero',
  'footer.link.syllabus': 'Programa',
  'footer.link.model': 'El modelo',
  'footer.link.glossary': 'Glosario',
  'footer.link.repo': 'Repositorio en GitHub',
  'footer.link.contributing': 'Guía para colaborar',
  'footer.link.issues': 'Incidencias abiertas',
  'footer.link.privacy': 'Aviso de privacidad y COPPA',
  'footer.link.licence': 'Licencia MIT',

  // ---- for parents & educators --------------------------------------------
  'teach.overline': 'Para familias y docentes',
  'teach.title.lead': 'Cómo enseñar a los niños qué es',
  'teach.title.emphasis': 'de verdad el dinero',
  'teach.lede':
    'La paga enseña disciplina. No explica por qué suben los precios ni de dónde sale un préstamo bancario, y los niños hacen esas preguntas mucho antes de ganar nada. Esto es lo que hay que enseñar, más o menos cuándo y cómo decirlo.',
  'teach.badge.free': 'Gratis, sin licencia que comprar',
  'teach.badge.noAccounts': 'Sin cuentas infantiles',
  'teach.badge.noAds': 'Sin anuncios ni rastreo',
  'teach.stagesTitle': 'Qué presentar y cuándo',
  'teach.stagesLede':
    'Las edades son orientativas, no barreras. Un niño curioso de nueve años que pregunta de dónde sale el dinero está listo para la respuesta.',
  'teach.stage.1.age': 'De 7 a 9 años',
  'teach.stage.1.idea': 'El dinero es una promesa, no una cosa',
  'teach.stage.1.body':
    'Una moneda no tiene valor por su metal. Funciona porque todo el mundo la acepta y el Estado la respalda. Pregunta qué pasaría si una tienda dejara de aceptarla: esa pregunta hace casi todo el trabajo de enseñar.',
  'teach.stage.2.age': 'De 10 a 12 años',
  'teach.stage.2.idea': 'Los bancos crean dinero cuando prestan',
  'teach.stage.2.body':
    'Pregunta de dónde saca un banco el dinero para un préstamo. Cuando respondan «de los ahorradores», enséñales que el saldo de ningún ahorrador baja. El número de la cuenta de quien pide prestado es nuevo, y alguien lo ha tecleado.',
  'teach.stage.3.age': 'De 13 a 16 años',
  'teach.stage.3.idea': 'Alguien fija el precio del dinero',
  'teach.stage.3.body':
    'Los tipos de interés los decide un comité, y esa decisión llega al alquiler o a la hipoteca de su familia. A los adolescentes que han notado que suben los precios esto les resulta más convincente que los consejos sobre presupuestos.',
  'teach.stage.4.age': 'A partir de 16 años',
  'teach.stage.4.idea': 'Toda la máquina',
  'teach.stage.4.body':
    'Balances de bancos centrales, expansión cuantitativa, el sistema de dólares offshore. A estas alturas pueden registrar ellos mismos los asientos y contrastar una afirmación con una fuente de la Reserva Federal.',
  'teach.questionsTitle': 'Preguntas que hacen las familias y los docentes',
  'teach.safetyTitle': 'Qué recogemos de tu hijo o hija',
  'teach.safety.1':
    'Nada, a menos que inicie sesión. Todas las lecciones se pueden hacer completas sin cuenta y, sin sesión iniciada, el progreso y las rachas se quedan en el dispositivo y nunca se suben.',
  'teach.safety.2': 'Sin analítica, publicidad ni scripts de rastreo de terceros.',
  'teach.safety.3':
    'Iniciar sesión es opcional y requiere una cuenta de Google, que Google no da a menores de 13 años. Guarda una sola cosa: sus XP y su racha de días, para que le sigan a otro dispositivo.',
  'teach.safety.4':
    'Los puntos de recompensa son una puntuación de aprendizaje: no son dinero ni un monedero, y no hay forma de comprarlos ni de cobrarlos.',
  'teach.safety.5':
    'Las cuentas y el progreso se guardan en la UE (Irlanda), y nadie que aprenda puede leer los datos de otra persona.',
  'teach.readPrivacy': 'Lee el aviso completo de privacidad y COPPA',
  'teach.tryLesson': 'Prueba antes una lección tú',
  'teach.learnYourself': 'Apréndelo tú',

  // ---- learn page ---------------------------------------------------------
  'learn.overline': 'Empieza aquí',
  'learn.title.lead': 'Cómo aprender qué es',
  'learn.title.emphasis': 'de verdad el dinero',
  'learn.lede':
    'La mayor parte del dinero no la imprime un Gobierno. La crean los bancos comerciales cuando prestan y los bancos centrales cuando compran activos. Todo lo demás se deriva de eso, y este es el camino honesto más corto para entenderlo.',
  'learn.pathTitle': 'El camino, en orden',
  'learn.step.1.title': 'Haz una operación real, antes de leer nada',
  'learn.step.1.body':
    'La demo te da una compra de 10.000 millones de $ de un banco central y te pide que registres los asientos en los dos balances. Diez minutos aquí hacen legible cualquier artículo sobre la Fed.',
  'learn.step.1.cta': 'Abrir la demo',
  'learn.step.2.title': 'Aprende el vocabulario como mecanismos, no como definiciones',
  'learn.step.2.body':
    'Reservas, repo, la base monetaria, la expansión cuantitativa. Cada entrada del glosario explica qué se mueve en el balance de quién, nombra el error habitual y enlaza la fuente primaria.',
  'learn.step.2.cta': 'Leer el glosario',
  'learn.step.3.title': 'Sigue los {count} itinerarios en orden',
  'learn.step.3.body':
    'Desde qué hace aceptable una ficha sin respaldo, pasando por la banca comercial y las palancas de la Fed y del BCE, hasta cómo se contiene una crisis del dólar y, por último, el propio balance de la Fed, tal como se publica esta semana. Cada itinerario construye el mecanismo que necesita el siguiente.',
  'learn.step.3.cta': 'Ver el programa',
  'learn.questionsTitle': 'Preguntas frecuentes',
  'learn.teachingTitle': '¿Vas a enseñar a alguien?',
  'learn.teachingBody':
    'Hay una guía aparte para madres, padres, tutores y docentes, que cubre qué presentar a cada edad y cómo explicarle a un niño la inflación y el dinero de los bancos.',
  'learn.teachingCta': 'Cómo enseñar a los niños sobre el dinero',

  // ---- glossary -----------------------------------------------------------
  'glossary.back': 'Volver a openmacro.org',
  'glossary.overline': 'Referencia',
  'glossary.lede':
    'Cada definición describe un mecanismo como movimientos de balance, nombra el error que suele acompañarlo y enlaza la fuente primaria. La precisión es el producto.',
  'glossary.read': 'Leer el mecanismo',

  // ---- login --------------------------------------------------------------
  'login.title': 'Inicia sesión en OpenMacro',
  'login.body':
    'Tu cuenta hace una sola cosa: recuerda. Tus XP y tu racha de días te siguen a cualquier dispositivo en el que inicies sesión.',

  // ---- not found ----------------------------------------------------------
  'notFound.title': 'Esta página no cuadra.',
  'notFound.body':
    'La URL que has seguido no existe. Puede que se haya movido, o puede que nunca haya estado aquí.',
  'notFound.home': 'Volver a la página de inicio',
  'notFound.glossary': 'Ver el glosario',

  // ---- module briefs (working material) -----------------------------------
  'briefs.overline': 'Material de trabajo',
  'briefs.title.lead': 'Un resumen por módulo, listo para',
  'briefs.title.emphasis': 'convertirse en vídeo',
  'briefs.lede':
    'Cada enlace de abajo devuelve ese módulo como texto sin formato: las preguntas que responde, el mecanismo detrás de cada una, los errores habituales con sus refutaciones y las ideas clave. Pega un enlace en NotebookLM como fuente de sitio web y pídele un Video Overview.',
  'briefs.lessons': '{count, plural, one {# lección} other {# lecciones}}',
  'briefs.videoLive': 'vídeo disponible',
  'briefs.videoNone': 'aún sin vídeo',
  'briefs.howTitle': 'Cómo hacer uno',
  'briefs.step.1': '1. Abre NotebookLM y añade el enlace del módulo de arriba como fuente de sitio web.',
  'briefs.step.2': '2. Pide un Video Overview. Los encabezados del resumen se convierten en las diapositivas.',
  'briefs.step.3': '3. Publica el resultado en algún sitio con una URL estable.',
  'briefs.step.4': '4. Añádelo al módulo en',
  'briefs.step.4.as': 'como',
  'briefs.step.4.tail': ', y aparecerá encima de las lecciones de ese módulo.',
  'briefs.noApi':
    'Aún no hay API para esto (la API de cuadernos de Google es solo para empresas y no ofrece generación de vídeo), así que el paso dos se hace a mano, una vez por módulo. Los resúmenes son la parte que merece la pena automatizar y se generan a partir del propio curso, de modo que no pueden describir una lección que ya no existe.',
  'briefs.privacy':
    'Los vídeos se insertan sin contactar con YouTube hasta que quien aprende pulsa reproducir, así que el aviso de privacidad sigue siendo cierto para quien no los vea. Consulta',
  'briefs.privacyLink': 'el aviso de privacidad',

  // ---- a glossary entry ---------------------------------------------------
  'term.metaTitle': '{name}: qué es y cómo funciona',
  'term.allTerms': 'Todos los términos',
  'term.mechanics': 'La mecánica',
  'term.misreading': 'El error habitual',
  'term.related': 'Términos relacionados',
  'term.sources': 'Fuentes primarias',
  'term.postIt': 'Regístralo tú',
  'term.postItBody':
    'Leer una definición no es lo mismo que saber manejar el mecanismo. La demo te da una operación real y te pide que coloques los asientos.',
  'term.tryDemo': 'Prueba la demo de cuentas en T',

  // ---- privacy & COPPA notice ---------------------------------------------
  'privacy.back': 'Volver a openmacro.org',
  'privacy.title': 'Aviso de privacidad y de privacidad infantil',
  'privacy.updated': 'Última actualización: 16 de octubre de 2026. Cubre {domain} y la app móvil de OpenMacro.',
  'privacy.authoritative': 'Esta es una traducción de cortesía. En caso de discrepancia, prevalece la versión inglesa.',
  'privacy.short.title': 'La versión corta',
  'privacy.short.body':
    'Puedes leer todas las páginas, usar todas las simulaciones y terminar todas las lecciones de este sitio sin cuenta, y no usamos analítica, publicidad ni scripts de rastreo de terceros. Si decides iniciar sesión (con Google o, en la app de iOS, con Apple), guardamos tus XP y tu racha de días para que te sigan entre dispositivos; esa es la única razón por la que existe una cuenta, y los únicos datos personales que conservamos.',
  'privacy.collect.title': 'Qué recogemos',
  'privacy.collect.signin.label': 'Si inicias sesión.',
  'privacy.collect.signin.body':
    'Pedimos a Apple o a Google un nombre y una dirección de correo electrónico, y nada más. Google también envía una foto de perfil, que aparece en la fila de tu propia cuenta y en ningún otro sitio. Iniciar sesión con Apple te permite ocultar tu dirección real y, si lo haces, solo vemos la dirección de reenvío: nada de esto necesita llegarte por correo. Iniciar sesión con Apple solo se ofrece en la app de iOS, así que una cuenta creada de esa forma no se puede abrir en la web. Guardamos el nombre junto a tu progreso, y la dirección la conserva nuestro proveedor de autenticación para que puedas volver a iniciar sesión.',
  'privacy.collect.progress.label': 'Tu progreso, una vez iniciada la sesión.',
  'privacy.collect.progress.body':
    'El total de XP, tu racha de días, la fecha de tu última lección terminada y, para cada lección, tu mejor puntuación, cuántas veces la has terminado y cuándo. Ni respuestas, ni tiempos, ni nada sobre cómo has jugado.',
  'privacy.collect.logs.label': 'Registros del servidor.',
  'privacy.collect.logs.body':
    'Nuestro proveedor de alojamiento guarda registros estándar de peticiones (dirección IP, fecha y hora, ruta solicitada, agente de usuario) para mantener el servicio en marcha y bloquear abusos. Se conservan 30 días y después se eliminan.',
  'privacy.collect.sim.label': 'Nada del simulador.',
  'privacy.collect.sim.body':
    'El control deslizante, las lecturas y la cadena de préstamos funcionan en tu navegador. Tus datos nunca se nos envían.',
  'privacy.notCollect.title': 'Qué no recogemos',
  'privacy.notCollect.1': 'Ninguna cookie de publicidad, elaboración de perfiles o rastreo entre sitios.',
  'privacy.notCollect.2': 'Ningún servicio de analítica o de grabación de sesiones.',
  'privacy.notCollect.3':
    'Ninguna dirección postal, número de teléfono ni dato de tarjeta. Nunca pedimos una contraseña: Apple y Google se encargan del inicio de sesión, así que no tenemos ninguna que guardar.',
  'privacy.notCollect.4': 'Ninguna venta, alquiler ni intercambio de datos, nunca.',
  'privacy.coppa.title': 'Menores de 13 años (COPPA)',
  'privacy.coppa.intro':
    'OpenMacro está escrito para jóvenes y niños, así que tratamos la privacidad infantil como una condición de diseño y no como una página de políticas.',
  'privacy.coppa.1':
    'No hace falta cuenta para aprender. Todas las lecciones, en el sitio y en la app, se pueden hacer completas sin iniciar sesión y, mientras no hay sesión iniciada, el progreso se queda en el dispositivo y nunca se sube.',
  'privacy.coppa.2':
    'Iniciar sesión es opcional, y pedimos al proveedor un nombre y una dirección de correo electrónico, y nada más. Ni Apple ni Google nos dicen la edad de nadie, así que iniciar sesión no es una comprobación de edad y no lo tratamos como tal. Lo que protege aquí a un menor es que no hay nada que recoger: ni publicidad, ni elaboración de perfiles, ni campos de texto libre, ni forma de contactar con otra persona desde el producto. Cuando un menor inicia sesión, un Apple ID gestionado en familia o una cuenta de Google Family Link solo existe con la aprobación de uno de sus progenitores.',
  'privacy.coppa.3.lead':
    'No recogemos a sabiendas información personal de menores de 13 años. Si crees que un menor ha iniciado sesión, escribe a',
  'privacy.coppa.3.tail': 'y eliminaremos la cuenta y todo lo vinculado a ella.',
  'privacy.coppa.4':
    'MacroXP y MintBucks son una puntuación de aprendizaje. No son una moneda y no se pueden comprar, canjear ni transferir. No hay ninguna vía de compra en todo el producto.',
  'privacy.coppa.5':
    'Las credenciales de habilidades solo se emiten cuando quien aprende las pide y, para menores de 13 años, solo con uno de sus progenitores o tutores. No publicamos los logros, el nombre ni ningún identificador de un menor en ningún registro público ni de terceros.',
  'privacy.coppa.6':
    'Un padre, una madre o un docente puede decidir pagar en euros (EURC) los XP y el tiempo activo que gane quien aprende. Solo para esas personas registramos los minutos que han estado activas en la web y la dirección de cobro que introducen, y enviamos cada retirada desde el monedero que la financia. Los pagos en la blockchain son públicos. Todo esto ocurre solo en la web, la participación es siempre gratuita y nada en el producto es una apuesta.',
  'privacy.coppa.7':
    'No hay publicidad, ni compras dentro de la app, ni chat u otra comunicación entre menores y desconocidos en ninguna parte del producto.',
  'privacy.coppa.8':
    'No se exige ningún justificante de identidad para pedir una eliminación, y nunca pedimos a un menor que demuestre nada antes de atenderla.',
  'privacy.where.title': 'Dónde están los datos',
  'privacy.where.1':
    'El sitio web funciona en Google Cloud Run. Las cuentas y el progreso se guardan en Supabase, en su región West EU (Irlanda): los datos de quienes aprenden no salen de la UE. El inicio de sesión lo gestionan Apple y Google, según lo que hayas elegido.',
  'privacy.where.2':
    'Cada fila está protegida por seguridad a nivel de fila de la base de datos, vinculada a tu cuenta, de modo que nadie que aprenda puede leer el progreso de otra persona, y la clave incluida en el sitio web solo puede llegar a tus propias filas. Conservamos tu progreso hasta que nos pidas eliminarlo.',
  'privacy.choices.title': 'Tus opciones',
  'privacy.choices.1': 'Cierra sesión cuando quieras. Puedes seguir usando todas las lecciones sin sesión iniciada.',
  'privacy.choices.2.lead': 'Escribe a',
  'privacy.choices.2.tail':
    'para ver, corregir o eliminar lo que conservamos, incluida toda tu cuenta. Respondemos en un plazo de 30 días.',
  'privacy.choices.3.lead': 'También puedes revocar el acceso de OpenMacro desde',
  'privacy.choices.3.link': 'los permisos de tu cuenta de Google',
  'privacy.choices.3.tail':
    ' o, si iniciaste sesión con Apple, en Iniciar sesión con Apple, en los ajustes de tu cuenta de Apple.',
  'privacy.choices.4':
    'Elimina la app para borrar el progreso guardado en el dispositivo. Si nunca iniciaste sesión, no queda nada por nuestra parte.',
  'privacy.changes.title': 'Cambios y preguntas',
  'privacy.changes.lead':
    'Los cambios importantes se publicarán aquí con una fecha nueva. Este aviso está en el mismo repositorio de código abierto que el sitio, así que todo su historial es público: léelo en',
  'privacy.changes.tail': '. Las preguntas, a',

  // ---- treasury (admin) ---------------------------------------------------
  'treasury.loading': 'Cargando…',
  'treasury.notFound': 'No encontrado',
  'treasury.denied': 'Aquí no hay nada para esta cuenta.',
  'treasury.loadError': 'No se pudo cargar la tesorería.',
  'treasury.title': 'Tesorería',
  'treasury.signedInAs': 'Sesión iniciada como {email}',
  'treasury.funds': 'Fondos',
  'treasury.eurc': 'EURC',
  'treasury.eth': 'ETH (gas)',
  'treasury.topUp': 'Recargar esta dirección',
  'treasury.copy': 'Copiar',
  'treasury.networkWarning.lead': 'Envía EURC y ETH solo en',
  'treasury.networkWarning.tail':
    '. La misma dirección en otra red no recibirá los fondos y no se podrán recuperar.',
  'treasury.attention': 'Requiere atención',
  'treasury.attentionBody':
    'Estos se detuvieron entre la difusión y el registro. Busca el nonce de la dirección de la tesorería en BaseScan: si existe una transacción, el dinero se movió; si no, no se movió. No reintentes el pago: una transacción pendiente todavía se puede minar.',
  'treasury.nonce': 'nonce',
  'treasury.wasPaid': 'Se pagó',
  'treasury.neverSent': 'Nunca se envió',
  'treasury.recipients': 'A quién se puede pagar',
  'treasury.recipientsBody.lead': 'Una dirección nueva empieza',
  'treasury.recipientsBody.pending': 'pendiente',
  'treasury.recipientsBody.tail':
    'y no puede recibir una recompensa del juego. Envía una prueba, confirma que ha llegado a su cuenta de Coinbase y actívala.',
  'treasury.perModule': '{amount} € por módulo',
  'treasury.defaultAmount': 'importe predeterminado',
  'treasury.claimedBy': 'reclamado por {email}',
  'treasury.unbound': 'sin cuenta vinculada: nadie puede ganar en este monedero',
  'treasury.sending': 'Enviando…',
  'treasury.testSend': 'Enviar prueba de 1 €',
  'treasury.activate': 'Activar',
  'treasury.confirmActivate': '¿Permitir pagar a {name} en {where}?',
  'treasury.ownAddress': 'la dirección que elija',
  'treasury.disable': 'Desactivar',
  'treasury.nobody': 'Nadie todavía.',
  'treasury.payouts': 'Pagos recientes',
  'treasury.baseScan': 'BaseScan ↗',
  'treasury.noPayouts': 'Aún no hay pagos.',
  'treasury.adminLog': 'Registro de administración',
  'treasury.noLog': 'Aún no hay nada registrado.',
  'treasury.addRecipient': 'Añadir destinatario',
  'treasury.field.key': 'Clave (la usa el juego)',
  'treasury.field.keyPlaceholder': 'hija',
  'treasury.field.name': 'Nombre',
  'treasury.field.namePlaceholder': 'Sofia',
  'treasury.field.address': 'Dirección de depósito de Coinbase en Base',
  'treasury.field.keyHint': 'Minúsculas, dígitos, - o _, de 2 a 31 caracteres. Sin puntos ni espacios.',
  'treasury.field.addressOptional': 'Dirección de depósito en Base (opcional: la puede fijar quien aprende)',
  'treasury.field.amount': 'Recompensa por módulo en euros (opcional)',
  'treasury.field.claimant': 'Cuenta que reclama en ella',
  'treasury.field.claimantPlaceholder': 'ella@email.com',
  'treasury.field.note': 'Nota (opcional)',
  'treasury.addedPending':
    'Añadido como pendiente. No puede recibir una recompensa hasta que envíes una prueba y lo actives.',
  'treasury.field.earnings': 'Pagar por XP y tiempo activo en lugar de por módulo (quien aprende fija su propia dirección)',
  'treasury.scheme.earnings': 'XP y tiempo · {xp} €/XP · {hour} €/hora',
  'treasury.noAddress': 'aún sin dirección: la fija quien aprende',
  'treasury.add': 'Añadir',
  'treasury.address.edit': 'Cambiar dirección',
  'treasury.address.save': 'Guardar dirección',
  'treasury.address.noteModule': 'Al guardar, este destinatario vuelve a pendiente: envía una prueba de 1 € a la nueva dirección, comprueba que ha llegado y actívalo de nuevo.',
  'treasury.address.noteEarnings': 'Se aplica de inmediato, como cuando la cambia quien aprende. Comprueba que es su dirección de EURC en Base.',
  'treasury.rates.edit': 'Editar tarifas',
  'treasury.rates.xp': 'Euros por XP (vacío = 0,002)',
  'treasury.rates.hour': 'Euros por hora activa (vacío = 0,20)',
  'treasury.rates.note': 'Se aplica a los XP que se ganen a partir de ahora. Los XP ya emitidos conservan la tarifa con la que se emitieron. El tiempo activo solo se cuenta en la web, no en la app de iPhone.',
  'treasury.rates.save': 'Guardar tarifas',
  'treasury.cancel': 'Cancelar',

  // ---- dashboard ----------------------------------------------------------
  'dash.noBackend.lead':
    'Esta versión no tiene configurado un servidor de cuentas, así que no hay progreso que mostrar. Todas las lecciones siguen funcionando: consulta',
  'dash.noBackend.link': 'el curso',
  'dash.nothingYet': 'Aún no has terminado nada: elige lo que quieras de abajo.',
  'dash.finished': '{done, number} de {total, number} lecciones terminadas',
  'dash.signOut': 'Cerrar sesión',
  'dash.loadFailed':
    'No se ha podido cargar tu progreso ahora mismo. Tus lecciones siguen funcionando: prueba a recargar la página.',
  'dash.progressAria': 'Tu progreso',
  'dash.totalXp': 'XP totales',
  'dash.dayStreak': 'Racha de días',
  'dash.courseComplete': 'Curso completado',
  'dash.lessonsOf': '{done, number} de {total, number} lecciones',
  'dash.continueAria': 'Continuar',
  'dash.startHere': 'Empieza aquí',
  'dash.pickUp': 'Sigue donde lo dejaste',
  'dash.allDone': 'Todas las lecciones terminadas.',
  'dash.allDoneBody':
    'Repite cualquiera para subir tu mejor puntuación, o escribe una, ya que el contenido es de código abierto.',
  'dash.onDevice': 'Esto se guarda en este dispositivo',
  'dash.onDeviceBody':
    'Todo lo de arriba está guardado en este navegador. Si inicias sesión, lo conservas aunque borres los datos del navegador y lo llevas a tu móvil: lo que ya has hecho se suma, no se sustituye.',
  'dash.allModulesAria': 'Todos los módulos',
  'dash.moduleProgressAria': 'Progreso de {title}',
  'dash.best': 'Mejor: {best, number} / {max, number} XP',
  'dash.runs': '· {count, number} intentos',
  'dash.xpAvailable': '{max, number} XP disponibles',
  'dash.fullMarks': 'Puntuación máxima',
  'dash.replay': 'Repetir',
  'today.hello': 'Hola, {name}',
  'today.helloAnon': 'Tu progreso',
  'today.streak.none': 'Termina una lección para empezar una racha de días',
  'today.streak.kept': 'Racha de {count, plural, one {# día} other {# días}}, mantenida hoy',
  'today.streak.atRisk': 'Racha de {count, plural, one {# día} other {# días}}. Termina una lección hoy para mantenerla',
  'today.minutes': '{count, number} min',
  'today.xp': '{xp, number} XP ganados',
  'today.start': 'Empezar',
  'today.continue': 'Continuar',
  'today.sharpen.title': 'Afina',
  'today.sharpen.body': 'Lecciones terminadas en las que aún puedes ganar XP.',
  'today.sharpen.redo': 'Repetir',
  'today.course.title': 'Tu curso',
  'today.signedInAs': 'Sesión iniciada como {name}',

  // ---- module rewards -----------------------------------------------------
  'moduleRewards.title': 'Recompensas',
  'moduleRewards.rate': '{amount} por módulo · {earned} € ganados',
  'moduleRewards.body':
    'Termina todas las lecciones de un módulo y la recompensa es tuya, pagada en EURC directamente en tu cuenta de Coinbase.',
  'moduleRewards.ready': 'Para reclamar: {count, number}',
  'moduleRewards.lessons': '{done, number} de {total, number} lecciones',
  'moduleRewards.paidLink': 'Pagado ↗',
  'moduleRewards.paid': 'Pagado',
  'moduleRewards.sending': 'Enviando…',
  'moduleRewards.claim': 'Reclamar {amount} €',

  // ---- earnings (XP and active time) -------------------------------------
  'earnings.title': 'Tus ganancias',
  'earnings.rates': '{xpCents} céntimos por XP · {hour} por hora activa',
  'earnings.alreadyWithdrawn': '{amount} ya retirados',
  'earnings.fromXp': 'Por XP',
  'earnings.xpCount': '{xp, number} de {max, number} XP',
  'earnings.fromTime': 'Por tiempo',
  'earnings.today': '{minutes, number} min hoy',
  'earnings.timeRule':
    'El tiempo cuenta mientras este sitio está abierto delante de ti y se reproduce un vídeo de lección, o si has usado el sitio en los dos últimos minutos.',
  'earnings.address': 'Tu dirección de EURC',
  'earnings.networkWarning':
    'Usa tu dirección de depósito de EURC en la red Base. Los EURC enviados por otra red se pierden.',
  'earnings.saveAddress': 'Guardar dirección',
  'earnings.changeAddress': 'Cambiar',
  'earnings.cancel': 'Cancelar',
  'earnings.addressSaved': 'Dirección guardada.',
  'earnings.withdraw': 'Retirar {amount}',
  'earnings.sending': 'Enviando…',
  'earnings.withdrawn': 'Enviados {amount} EURC.',
  'earnings.needAddress': 'Añade tu dirección para retirar.',
  'earnings.minimum': 'Puedes retirar a partir de {amount}.',
  'earnings.paidLink': 'Pagado ↗',
  'earnings.failed': 'No ha funcionado.',
  'earnings.offline': 'No se pudo conectar con el servidor.',
  'earnings.chip': 'EURC · Base',
  'earnings.ready': 'Listo para retirar',
  'earnings.setup': 'Configurar pagos',
  'earnings.setupTitle': '¿Adónde te enviamos los euros?',
  'earnings.step1': 'Abre Coinbase o cualquier monedero que admita EURC.',
  'earnings.step2': 'Toca Recibir, elige EURC y luego la red Base.',
  'earnings.step3': 'Copia la dirección que aparece y pégala abajo.',
  'earnings.addressHint': 'Empieza por 0x y tiene 42 caracteres.',
  'earnings.addressValid': 'Parece una dirección válida.',
  'earnings.addressInvalid': 'Aún no es una dirección completa: 0x seguido de 40 letras y dígitos.',
  'earnings.confirmBase': 'La he copiado con la red Base seleccionada.',
  'earnings.paysTo': 'Se paga a {address}',

  // ---- challenge widgets --------------------------------------------------
  'sim.try': 'Prueba {value}',
  'level.count': '{count, plural, one {# módulo} other {# módulos}}',
  'level.beginner': 'Principiante',
  'level.beginner.blurb': 'No da nada por sabido',
  'level.intermediate': 'Intermedio',
  'level.intermediate.blurb': 'Da por sabido qué es un depósito',
  'level.advanced': 'Avanzado',
  'level.advanced.blurb': 'Da por sabidas la interfaz y las palancas',
  'tflow.entries': 'Asientos por registrar',
  'tflow.placed': '{done, number} de {total, number} asientos colocados',
  'tflow.decoys': 'Trampas: no forman parte de esta operación',
  'tflow.chooseSide': 'Ahora elige en qué balance cae y en qué lado.',
  'tflow.pickEntry':
    'Elige un asiento y luego en qué balance cae y en qué lado. Todos los balances deben cuadrar.',
  'tflow.startOver': 'Empezar de nuevo',
  'tflow.balanced': 'Cuadra',
  'tflow.offBalance': 'No cuadra',
  'tflow.assets': 'Activo',
  'tflow.liabilities': 'Pasivo',
  'tflow.assetsHint': 'Lo que posee',
  'tflow.liabilitiesHint': 'Lo que debe',
  // The right column when the sheet has equity in it. Equity is not a debt,
  // so a column headed only "Liabilities" mislabels it.
  'tflow.liabilitiesEquity': 'Pasivo + patrimonio neto',
  'tflow.liabilitiesEquityHint': 'Lo que debe + lo que es realmente suyo',
  'tflow.equity': 'Patrimonio neto',
  'tflow.removeA11y': 'Quitar {account} de {side} de {entity}',
  'tflow.placeA11y': 'Colocar el asiento seleccionado en {side} de {entity}',
  'tflow.placeHere': 'Colocar aquí',
  'tflow.opening': 'Saldo inicial: {amount}',
  'match.nowDefinition': 'Ahora elige su definición',
  'match.pickTerm': 'Elige un término y luego su definición',
  'match.change': 'Cambiar',
  'order.earliestTop': 'La causa más temprana arriba',
  'order.moveEarlier': 'Mover «{label}» antes',
  'order.moveLater': 'Mover «{label}» después',
  'sim.done': '— hecho',
  'sim.notYet': '— todavía no',
  'player.min': '{count, number} min',
  'player.xpAvailable': '{count, number} XP disponibles',
  'player.challenges': '{count, plural, one {# reto} other {# retos}}',
  'player.xp': '{count, number} XP',
  'map.play': 'Jugar',
  'map.replay': 'Repetir',
  'video.overview': '{title}: resumen',
  'snippet.copy': 'Copiar',
  'snippet.copied': 'Copiado',
  'permalink.copy': 'Copiar un enlace a {label}',
  'permalink.copied': 'Enlace copiado',
  'permalink.copiedLive': 'Enlace copiado al portapapeles',
  'google.opening': 'Abriendo Google',
  'apple.opening': 'Abriendo Apple',
  'apple.continue': 'Continuar con Apple',
  'layout.skip': 'Saltar al contenido',
  'glossary.title.lead': 'La',
  'glossary.title.emphasis': 'máquina monetaria',
  'glossary.title.tail': ', término a término.',
  'glossary.tier': 'Nivel {n, number} · {name}',
  'glossary.terms': '{count, plural, one {# término} other {# términos}}',
  'glossary.alsoCalled': 'También llamado:',
  'learn.badge.free': 'Gratis para siempre',
  'learn.badge.noAccount': 'Sin necesidad de cuenta',
  'learn.badge.mit': 'Licencia MIT',
  'login.noAccount.lead': '¿No tienes cuenta? Al iniciar sesión con Google se crea una. También puedes simplemente',
  'login.noAccount.link': 'empezar a aprender',
  'login.noAccount.tail': ': todas las lecciones son gratis, con sesión iniciada o sin ella.',
  'roadmap.track': 'Itinerario {n, number}',
  'roadmap.lessons': '{count, plural, one {# lección} other {# lecciones}}',
  'roadmap.operatesOn': 'Opera sobre',
  'tflow.effect.expand': '{aggregate} se ha expandido',
  'tflow.effect.contract': '{aggregate} se ha contraído',
  'tflow.effect.unchanged': '{aggregate} no cambia',
  'tflow.aggregate.M0': 'M0',
  'tflow.aggregate.M1': 'M1',
  'tflow.aggregate.M2': 'M2',
  'tflow.aggregate.collateral': 'Garantía',
  'player.xpEarned': '+{count, number} XP',
  // ---- get the app --------------------------------------------------------
  'app.overline': 'La app',
  'app.title.lead': 'Cinco minutos al día,',
  'app.title.emphasis': 'en tu bolsillo.',
  'app.lede':
    'El mismo curso y los mismos retos que este sitio, hechos para el móvil: para el autobús, la cola y los diez minutos antes de dormir.',
  'app.perk.offline.title': 'Todas las lecciones funcionan sin conexión',
  'app.perk.offline.body':
    'De la primera lección a la última, sin cobertura. El curso vive en tu móvil.',
  'app.perk.sync.title': 'Tu racha te acompaña',
  'app.perk.sync.body':
    'Inicia sesión una vez y tus XP y tu racha de días te seguirán entre este sitio y la app.',
  'app.perk.free.title': 'Gratis. Sin anuncios. Sin rastreo.',
  'app.perk.free.body':
    'No necesitas cuenta y no hay nada que comprar. De código abierto, como todo lo demás aquí.',
  'app.store.apple.eyebrow': 'Descárgala en',
  'app.store.google.eyebrow': 'Consíguela en',
  'app.store.google.soon': 'Próximamente en',
  'app.qr.alt': 'Código QR que abre la app de OpenMacro en la tienda de aplicaciones de tu móvil',
  'app.qr.title': '¿Estás en un ordenador?',
  'app.qr.body': 'Apunta aquí con la cámara del móvil para abrir la app en tu tienda.',
  'app.shot.today': 'La pantalla Hoy de la app de OpenMacro: una racha de 12 días, 420 XP y la siguiente lección',
  'app.shot.lesson': 'Una lección en la app de OpenMacro, con la explicación tras una respuesta correcta',
  'app.chip.streak': 'Racha de 12 días',
  'app.chip.offline': 'Funciona sin conexión',
} as const;
