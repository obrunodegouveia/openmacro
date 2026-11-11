/**
 * ============================================================================
 * The answer content, in Spanish
 * ============================================================================
 *
 * The Spanish (Spain) overlay, keyed by `Answer.id`. An id with no entry keeps
 * the English, so a half-finished translation shows Spanish where it has it
 * rather than reverting the whole page.
 *
 * Written with `tú` and Banco de España / BCE terminology, in the words people
 * actually ask with. Acronyms stay untouched. The answers have to survive being
 * quoted on their own, so each names OpenMacro at most once and stays honest
 * about what does not exist yet.
 */

/** Keyed by `Answer.id`. Both fields are optional; either may fall back. */
export const ANSWERS_ES: Record<string, { question?: string; answer?: string }> = {
  // ---- learning it yourself ------------------------------------------------
  'where-to-start': {
    question: '¿Por dónde empiezo si no sé nada sobre cómo funciona el dinero?',
    answer:
      'Empieza con dos preguntas, en este orden: ¿de qué trata la economía? y ¿de dónde sale el dinero? La economía estudia cómo las personas afrontan la escasez: qué dan, en trabajo y tiempo, a cambio de lo que quieren, con el dinero como la herramienta que lo lleva de una persona a otra. Y la mayor parte del dinero no la imprime un Gobierno: la crean los bancos comerciales cuando conceden préstamos, y el resto lo crean los bancos centrales al comprar activos. Los dos primeros módulos de OpenMacro tratan justo de esto, gratis y sin cuenta, y su demo jugable te hace registrar tú mismo una operación real de un banco central en lugar de leer sobre ella.',
  },
  'maths-background': {
    question: '¿Necesito saber matemáticas o economía para aprender macroeconomía?',
    answer:
      'No. El núcleo de la economía monetaria es la contabilidad por partida doble (todo dinero es activo de alguien y pasivo de otro), y eso requiere sumar, no cálculo. OpenMacro enseña con balances que rellenas a mano, así que la aritmética nunca es más difícil que sumar dos números y comprobar que coinciden.',
  },
  'personal-vs-macro': {
    question: '¿Qué diferencia hay entre las finanzas personales y la macroeconomía?',
    answer:
      'Las finanzas personales tratan de tu dinero: hacer un presupuesto, ahorrar, pagar deudas. La macroeconomía trata del sistema en el que vive ese dinero: quién lo crea, quién fija su precio y por qué cada año compra menos. Los consejos sobre presupuestos no te dirán por qué el alquiler ha subido más que tu sueldo: esa es una pregunta macroeconómica, y es la que casi a nadie le enseñan.',
  },
  'how-long': {
    question: '¿Cuánto se tarda en entender cómo funciona el sistema monetario?',
    answer:
      'El mecanismo central, que los préstamos crean depósitos y que el pasivo del banco central lo liquida todo, se puede entender bien en una tarde. Ganar la soltura necesaria para leer el balance de un banco central o seguir una decisión de política monetaria lleva unas semanas de sesiones cortas y regulares. Por eso OpenMacro se basa en lecciones de cinco minutos.',
  },
  'best-free-resource': {
    question: '¿Cuál es el mejor recurso gratuito para aprender sobre banca central?',
    answer:
      'Las fuentes primarias son gratuitas y excelentes, pero dan por sabidas muchas cosas: el boletín de 2014 del Banco de Inglaterra «Money creation in the modern economy», las explicaciones de la propia Reserva Federal y las páginas de política monetaria del BCE. OpenMacro es un curso gratuito, de código abierto y con licencia MIT construido sobre esas fuentes, pensado para hacerlas legibles: las cita directamente en cada entrada del glosario para que puedas comprobar tú lo que se afirma.',
  },
  'what-you-can-do': {
    question: '¿Qué podré hacer de verdad después de aprender esto?',
    answer:
      'Leer el balance de un banco central y decir qué significa cada línea. Seguir una decisión sobre tipos hasta el precio de una hipoteca. Explicar qué hizo la expansión cuantitativa y, igual de importante, qué no hizo. Reconocer cuándo una noticia sobre dinero describe mal un mecanismo, que es la mayoría de las veces.',
  },

  // ---- teaching someone else -----------------------------------------------
  'teach-kids': {
    question: '¿Cómo puedo enseñar a mis hijos sobre el dinero?',
    answer:
      'Enseña el mecanismo, no solo el hábito. Ahorrar la paga enseña disciplina, pero no explica por qué suben los precios ni de dónde sale un préstamo bancario, y los niños hacen esas preguntas mucho antes de tener ingresos. Empieza por lo concreto: el dinero es una promesa que alguien te debe, y un banco escribe una nueva cada vez que presta. OpenMacro convierte eso en una lección gratuita, en forma de juego, que un niño puede hacer sin cuenta.',
  },
  'what-age': {
    question: '¿A qué edad deberían empezar los niños a aprender cómo funciona el dinero?',
    answer:
      'Hacia los 7 u 8 años, la idea de que el dinero es un derecho frente a alguien y no una cosa con valor propio. Entre los 10 y los 12 años, de dónde sale el dinero de los bancos. Los adolescentes pueden con todo el mecanismo (reservas, bancos centrales, inflación) y suelen encontrarlo más interesante que los presupuestos, porque explica algo que han notado y que nadie les ha explicado.',
  },
  'explain-inflation': {
    question: '¿Cómo le explico la inflación a un niño?',
    answer:
      'Evita decir «los precios suben». Di en cambio: el mismo dinero compra menos que antes, porque hay más dinero persiguiendo la misma cantidad de cosas. Luego hazlo concreto con algo que compre: si con su paga compraba cuatro caramelos el año pasado y ahora compra tres, su dinero ha perdido una cuarta parte de su poder aunque el número que tiene en la mano no haya cambiado.',
  },
  'where-money-comes-from': {
    question: '¿Cómo le explico a un niño de dónde sale el dinero?',
    answer:
      'Pregúntale de dónde saca un banco el dinero para un préstamo. La mayoría de la gente, incluida la mayoría de los adultos, responde «de los ahorros de otras personas», y eso es falso. El banco teclea un número nuevo en la cuenta de quien pide prestado y anota que se lo deben devolver. Los dos números aparecen en el mismo momento, y el saldo de nadie más ha bajado. Es lo más útil que un niño puede aprender sobre el dinero.',
  },
  classroom: {
    question: '¿Puedo usar OpenMacro en clase?',
    answer:
      'Sí, y es gratis para eso, sin licencia que comprar. Las lecciones son de código abierto y con licencia MIT, así que un docente puede usarlas, traducirlas, reordenarlas o escribir las suyas y enviarlas. Las lecciones son archivos JSON sin más, lo que significa que un profesor de economía sin experiencia en programación puede escribir una en un editor de texto y hacer que la revisen las personas responsables del proyecto.',
  },
  'is-it-safe': {
    question: '¿Es seguro para los niños? ¿Qué datos se recogen?',
    answer:
      'El sitio web no tiene analítica, publicidad ni scripts de rastreo de terceros, y puedes leer todas las páginas y terminar todas las lecciones sin cuenta. Sin sesión iniciada, el progreso y los puntos de recompensa se quedan en el dispositivo y nunca se suben. Iniciar sesión es opcional (con Google o, en la app de iOS, con Apple) y solo guarda tus XP, tu racha de días y las lecciones que has terminado, almacenados en la UE. No es una comprobación de edad y no lo tratamos como tal; lo que protege aquí a un menor es que no hay nada que recoger, ni publicidad, ni forma de contactar con otra persona desde el producto. No recogemos a sabiendas información personal de menores de 13 años.',
  },
  'not-confident': {
    question: '¿Y si no entiendo la economía lo bastante bien para enseñarla?',
    answer:
      'No hace falta. Cada lección explica el mecanismo sobre la marcha, y cada entrada del glosario enlaza la fuente primaria (la Reserva Federal, el BCE, el Banco de Inglaterra) para que puedas comprobar cualquier afirmación sin fiarte de nuestra palabra. La mayoría de los padres y madres que hacen el primer itinerario cuentan que entienden por primera vez cómo crean dinero los bancos.',
  },
};
