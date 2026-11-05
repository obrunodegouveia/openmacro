/**
 * The glossary in Spanish (Spain), an overlay on the English.
 *
 * Same conventions as the course: `tú`, and Banco de España / BCE terminology
 * where it exists — "reservas bancarias", "tipo de la facilidad de depósito",
 * "operaciones principales de financiación". Where the industry uses the
 * English term and Spanish has coined nothing, the English stays: repo, swap.
 *
 * Acronyms are never translated. IORB, ON RRP, SOFR and €STR are the names of
 * specific published rates, and a reader who opens the Fed's site will only
 * find them under those names.
 *
 * Keyed by slug, merged field by field over the English — see
 * `glossary-locale.ts`. An entry missing a field falls back rather than
 * blanking it.
 */

import type { TranslatableEntry } from '@/lib/glossary-locale';

export const GLOSSARY_ES: Record<string, TranslatableEntry> = {
  'bank-reserves': {
    term: 'Reservas bancarias',
    aliases: ['saldos de reservas', 'reservas en el banco central'],
    definition:
      'Depósitos que los bancos comerciales tienen en el banco central: el activo de liquidación con el que los bancos se pagan entre sí, y un pasivo del banco central, no un activo suyo.',
    explanation: [
      'Las reservas están en lo más alto de la jerarquía del dinero. Cuando un banco paga a otro, lo que se mueve entre ellos son reservas, y las reservas solo existen como anotaciones en el propio balance del banco central.',
      'Solo las pueden tener las instituciones admitidas, en general los bancos. Una familia, una empresa o un fondo del mercado monetario no puede abrir una cuenta de reservas, y por eso el banco central necesita facilidades separadas para llegar a quienes no son bancos.',
      'Las reservas no pueden salir del sistema bancario mediante préstamos. Un préstamo mueve depósitos entre clientes; solo dos cosas cambian la cantidad total de reservas: que el banco central las cree o las destruya, y que el público convierta depósitos en billetes.',
    ],
    mechanics: [
      {
        label: 'De quién son pasivo',
        detail: 'Del banco central. En el balance de un banco comercial, el mismo saldo aparece como activo.',
      },
      {
        label: 'Cómo se crean',
        detail: 'El banco central compra un activo o presta, y abona en una cuenta de reservas dinero que emite en el momento.',
      },
      {
        label: 'Cómo se drenan',
        detail: 'Ventas o vencimientos de activos, retiradas de efectivo, un aumento de la cuenta del Tesoro o el uso de la facilidad de repo inverso.',
      },
    ],
    misreading:
      'Que los bancos prestan sus reservas. No lo hacen: las reservas nunca salen del sistema bancario cuando se concede un préstamo. Prestar crea un depósito nuevo, y la posición de reservas del banco solo cambia cuando el pago de quien pidió prestado se liquida en otro sitio.',
  },
  'monetary-base': {
    term: 'Base monetaria',
    aliases: ['M0', 'dinero base', 'dinero de alta potencia'],
    definition:
      'El total de billetes en circulación y reservas de los bancos comerciales: todas las formas de dinero que son un pasivo directo del banco central.',
    explanation: [
      'La base es lo que emite el propio banco central. Todo lo demás que la gente llama dinero, como el saldo de una cuenta corriente o una participación en un fondo del mercado monetario, es la promesa de otro, que al final se liquida en base monetaria.',
      'Sus dos componentes sirven a usuarios distintos. Los billetes son la base monetaria que puede tener el público; las reservas, el que solo pueden tener los bancos. Una retirada de efectivo convierte uno en otro sin cambiar el total.',
      'Una base que crece no produce de forma mecánica inflación ni préstamos. Después de 2008 la base creció enormemente, mientras que el dinero en sentido amplio y el crédito bancario crecieron mucho más despacio, y esa es la prueba más clara de que el multiplicador de los manuales es un techo y no una descripción.',
    ],
    mechanics: [
      { label: 'Componentes', detail: 'Efectivo en circulación + saldos de reservas en el banco central.' },
      { label: 'Se expande cuando', detail: 'El banco central compra activos o presta; la expansión cuantitativa es el mayor ejemplo.' },
      { label: 'Se contrae cuando', detail: 'Sus activos vencen sin reinvertirse, o el efectivo vuelve y se retira.' },
    ],
    misreading:
      'Que la base y «la oferta monetaria» son lo mismo. La mayor parte del dinero que la gente gasta de verdad es dinero en sentido amplio, depósitos en bancos comerciales, que se crea prestando y no en el banco central.',
  },
  'broad-money': {
    term: 'Dinero en sentido amplio',
    aliases: ['M2', 'oferta monetaria'],
    definition:
      'El dinero que el público puede gastar de verdad, efectivo más depósitos bancarios y sustitutos cercanos, que en su mayor parte crean los bancos comerciales cuando prestan.',
    explanation: [
      'Cuando un banco concede un préstamo, abona la cuenta de quien lo pide. Los dos lados de su balance crecen a la vez: un activo nuevo (el préstamo) y un pasivo nuevo (el depósito). Ese depósito es dinero nuevo en sentido amplio, y el saldo de ningún ahorrador bajó para producirlo.',
      'El agregado M2 de EE. UU. incluye efectivo, depósitos corrientes y de ahorro, pequeños depósitos a plazo y participaciones minoristas en fondos del mercado monetario. El límite exacto es una decisión de definición, y por eso «¿ha subido M2?» a veces tiene una respuesta menos interesante que «¿el pasivo de quién se ha movido?».',
      'El dinero en sentido amplio se reduce cuando se devuelven los préstamos. La devolución destruye el depósito que creó el préstamo, y por eso el desapalancamiento drena dinero de una economía en lugar de solo redistribuirlo.',
    ],
    mechanics: [
      { label: 'Lo crean', detail: 'Los préstamos de los bancos comerciales y las compras del banco central a quienes no son bancos.' },
      { label: 'Lo destruyen', detail: 'La devolución de préstamos y la venta de activos de los bancos a sus propios depositantes.' },
      { label: 'No es lo mismo que', detail: 'Las reservas. El dinero en sentido amplio es pasivo de un banco; las reservas, del banco central.' },
    ],
    misreading:
      'Que los bancos son intermediarios que pasan el dinero de los ahorradores a quienes piden prestado. La causalidad va al revés: los préstamos crean depósitos, y los depósitos son un subproducto del préstamo, no su materia prima.',
  },
  iorb: {
    term: 'Intereses sobre los saldos de reservas',
    aliases: ['intereses sobre reservas', 'IOER'],
    definition:
      'El tipo que la Reserva Federal paga a los bancos por las reservas que tienen en ella: el tipo administrado que ancla el suelo del corredor de tipos de EE. UU. para los bancos.',
    explanation: [
      'En un sistema con reservas abundantes, la Fed no puede dirigir los tipos haciendo escasas las reservas. En su lugar fija la remuneración del activo más seguro que puede tener un banco y deja que la competencia haga el resto: un banco no prestará a un día a nadie por menos de lo que gana sin hacer nada.',
      'En 2021, IORB sustituyó a la antigua separación entre intereses sobre reservas obligatorias y sobre reservas excedentes, una vez que el coeficiente de reservas obligatorio se había fijado en cero y la distinción ya no tenía sentido.',
      'Es un tipo administrado, no un tipo de mercado. Lo fija directamente la Junta, y eso es lo que lo convierte en una palanca y no en una observación.',
    ],
    mechanics: [
      { label: 'Quién lo recibe', detail: 'Las entidades de depósito admitidas (los bancos), sobre sus saldos de reservas.' },
      { label: 'Qué ancla', detail: 'El suelo del tipo efectivo de los fondos federales para las instituciones que pueden tener reservas.' },
      { label: 'Por qué quienes no son bancos necesitan más', detail: 'Los fondos monetarios y las GSE no pueden tener reservas, así que la facilidad ON RRP llega a ellos.' },
    ],
    misreading:
      'Que pagar intereses sobre las reservas «subvenciona a los bancos para que no presten». Las reservas no limitan el préstamo de entrada: IORB fija el coste de oportunidad del dinero a un día, y así es como se transmite el tipo oficial cuando las reservas son abundantes.',
  },
  'on-rrp': {
    term: 'Facilidad de repo inverso a un día',
    aliases: ['facilidad de repo inverso', 'repo inverso a un día'],
    definition:
      'Una facilidad de la Reserva Federal en la que entidades no bancarias admitidas prestan efectivo a la Fed a un día, con garantía de deuda del Tesoro, lo que pone un suelo firme a los tipos de interés a corto plazo.',
    explanation: [
      'Los fondos del mercado monetario, las empresas patrocinadas por el Gobierno y los dealers tienen enormes saldos de efectivo, pero no pueden tener reservas. Sin alternativa, tendrían que prestar a los bancos al tipo que estos ofrezcan. ON RRP les da una opción sin riesgo a un tipo publicado, así que no prestarán a nadie por debajo de él.',
      'El uso de la facilidad es un termómetro, no un ajuste de política. Los saldos grandes indican que el efectivo no encuentra mejor remuneración en los mercados privados; una caída suele indicar que la oferta de letras o los tipos de repo se han vuelto más atractivos.',
      'La operación drena reservas sin reducir el balance de la Fed. El pasivo total no cambia: el dinero simplemente pasa de la línea de reservas a la de repo inverso, y solo una de ellas es base monetaria.',
    ],
    mechanics: [
      { label: 'Dirección del efectivo', detail: 'Del fondo a la Fed, a un día; la Fed entrega deuda del Tesoro como garantía.' },
      { label: 'Efecto en las reservas', detail: 'Bajan en la cantidad utilizada, porque el efectivo salió de un depósito bancario.' },
      { label: 'Efecto en el balance de la Fed', detail: 'Ningún cambio de tamaño. Cambia la composición del pasivo, nada más.' },
    ],
    misreading:
      'Que la Fed «imprime dinero» cuando aumenta el uso de la facilidad. Ocurre lo contrario: ON RRP absorbe efectivo y reduce la base monetaria, aunque el balance total de la Fed siga teniendo exactamente el mismo tamaño.',
  },
  'quantitative-easing': {
    term: 'Expansión cuantitativa',
    aliases: ['compras de activos', 'compras de activos a gran escala', 'APP', 'PEPP'],
    definition:
      'Compras de bonos a gran escala por parte de un banco central, pagadas con reservas de nueva creación, para relajar las condiciones financieras cuando el tipo oficial ya está cerca de su suelo.',
    explanation: [
      'Mecánicamente, la QE es un intercambio de activos. Quien vende entrega un bono y recibe un depósito; su banco recibe reservas. La riqueza neta de nadie cambia mucho: lo que cambia es la composición de lo que tiene el sector privado.',
      'Como retira duración y saca del mercado garantías de alta calidad, la QE funciona sobre todo a través del precio del riesgo y la forma de la curva de rendimientos, no entregando a nadie dinero para gastar.',
      'El BCE aplicó el mismo mecanismo con su Programa de Compra de Activos y, desde 2020, con el Programa de Compras de Emergencia frente a la Pandemia. Los nombres de los instrumentos cambian; los apuntes del balance, no.',
    ],
    mechanics: [
      { label: 'Banco central', detail: 'Activo: suben los bonos. Pasivo: suben las reservas en la misma cantidad.' },
      { label: 'Banco de quien vende', detail: 'Activo: suben las reservas. Pasivo: sube el depósito de quien vende.' },
      { label: 'Mercado de garantías', detail: 'Las garantías impecables salen de la circulación, lo que tensa los mercados de repo.' },
    ],
    misreading:
      'Que la QE obliga a los bancos a prestar, o que es inflacionaria por naturaleza debido al multiplicador. Crea reservas, y las reservas no son lo que limita el préstamo; por eso una década de QE coincidió con un crecimiento del crédito históricamente débil.',
  },
  'quantitative-tightening': {
    term: 'Endurecimiento cuantitativo',
    aliases: ['reducción pasiva del balance', 'normalización del balance'],
    definition:
      'Lo contrario de la QE: reducir el balance del banco central, normalmente dejando vencer bonos sin reinvertirlos, lo que destruye reservas.',
    explanation: [
      'La reducción es pasiva. Cuando vence un bono que tiene el banco central, el emisor lo paga y el banco central simplemente no compra otro. El activo desaparece de un lado del balance y las reservas desaparecen del otro.',
      'Eso hace que la QT sea más lenta y menos controlable que la QE. El ritmo lo marcan el perfil de vencimientos de lo que se tiene y cualquier límite mensual, no una decisión tomada de reunión en reunión.',
      'La pregunta decisiva es dónde empieza la escasez de reservas. Nadie conoce ese nivel de antemano, y pasarse se nota primero como tensión en los mercados de repo, como descubrió EE. UU. en septiembre de 2019.',
    ],
    mechanics: [
      { label: 'Banco central', detail: 'Activo: bajan los bonos al vencer. Pasivo: bajan las reservas en la misma cantidad.' },
      { label: 'Interactúa con', detail: 'La cuenta del Tesoro y los saldos de ON RRP, que mueven las reservas por su cuenta.' },
      { label: 'Señal de alerta', detail: 'Tipos de repo que se publican de forma persistente por encima del suelo administrado.' },
    ],
    misreading:
      'Que la QT es simplemente la QE al revés, a la misma velocidad y con el mismo efecto. Las compras se eligen; la reducción viene heredada de un calendario de vencimientos, y su impacto cae de forma desigual entre los mercados.',
  },
  'deposit-facility-rate': {
    term: 'Tipo de la facilidad de depósito',
    aliases: ['tipo de depósito del BCE', 'tipo oficial del BCE'],
    definition:
      'El tipo que el BCE paga a los bancos de la zona del euro por los depósitos a un día en el Eurosistema; desde 2022, el tipo con el que el BCE dirige los tipos del euro a corto plazo.',
    explanation: [
      'La zona del euro funciona con un corredor de tres tipos: la facilidad de depósito abajo, el tipo de las operaciones principales de financiación en medio y la facilidad marginal de crédito arriba. Con un exceso de liquidez abundante, los tipos de mercado se pegan al suelo, así que el DFR es el tipo que de verdad manda.',
      'Entre 2014 y 2022 el DFR fue negativo: los bancos pagaban por dejar dinero en el BCE. Fue un intento deliberado de sacar la liquidez de la facilidad de depósito y llevarla al préstamo, y convierte a la zona del euro en el mayor experimento con tipos oficiales negativos jamás realizado.',
      'En 2024, el BCE redujo el diferencial entre MRO y DFR como parte de la revisión de su marco operativo, con lo que estrechó el corredor en torno al suelo.',
    ],
    mechanics: [
      { label: 'Quién lo recibe', detail: 'Las entidades de crédito de la zona del euro, por sus depósitos a un día en su banco central nacional.' },
      { label: 'Qué ancla', detail: 'El €STR y todo el tramo corto de la curva del euro.' },
      { label: 'Equivalente en EE. UU.', detail: 'IORB: la misma función, para los bancos que pueden tener reservas.' },
    ],
    misreading:
      'Que un DFR negativo fue un impuesto a los ahorradores. Se aplicaba a los saldos de los bancos en el banco central, no a los depósitos de los hogares; trasladarlo o no era una decisión comercial aparte de cada banco, y con los depositantes minoristas en su mayoría no lo hicieron.',
  },
  'main-refinancing-operations': {
    term: 'Operaciones principales de financiación',
    aliases: ['tipo refi', 'tipo de las operaciones principales de financiación del BCE'],
    definition:
      'Los préstamos semanales regulares y con garantía del BCE a los bancos de la zona del euro, y el tipo que se cobra por ellos: históricamente, la principal fuente de liquidez del Eurosistema.',
    explanation: [
      'Una MRO es un repo: un banco entrega garantías admitidas y recibe dinero del banco central durante una semana. Es un préstamo con garantía, no un regalo, y en el marco de garantías está gran parte de la verdadera política de riesgos del BCE.',
      'Antes de 2008, las MRO eran el principal grifo por el que la liquidez llegaba al sistema, y por eso su tipo era el tipo oficial de referencia. Cuando el exceso de liquidez se hizo abundante, la facilidad de depósito asumió ese papel.',
      'El BCE ha señalado que las MRO recuperarán importancia a medida que disminuya el exceso de liquidez, con bancos que volverán a cubrir más de sus necesidades mediante operaciones impulsadas por la demanda.',
    ],
    mechanics: [
      { label: 'Dirección', detail: 'El BCE presta; el banco entrega garantías y recibe dinero del banco central.' },
      { label: 'Plazo', detail: 'Una semana, con adjudicación semanal, y adjudicación plena a tipo fijo desde 2008.' },
      { label: 'Balance', detail: 'Activo del Eurosistema: suben los préstamos. Pasivo: sube la cuenta del banco.' },
    ],
    misreading:
      'Que el tipo de las MRO sigue siendo «el» tipo del BCE. En un sistema de suelo, los mercados toman como referencia el tipo de la facilidad de depósito; las MRO importan sobre todo como techo del corredor estrechado.',
  },
  sofr: {
    term: 'Tipo de financiación garantizada a un día',
    definition:
      'Una medida amplia del coste de pedir prestado efectivo a un día con garantía de deuda del Tesoro de EE. UU., publicada cada mañana por la Fed de Nueva York y principal sustituto de LIBOR en EE. UU.',
    explanation: [
      'SOFR se calcula a partir de operaciones reales en el mercado de repo de deuda del Tesoro, cientos de miles de millones de dólares al día, y no a partir de un panel de bancos que declaran a qué tipo creen que podrían pedir prestado. Ese es precisamente el defecto de LIBOR que SOFR se diseñó para eliminar.',
      'Como tiene garantía, SOFR casi no incorpora riesgo de crédito bancario. Por eso se comporta de otro modo que LIBOR en una crisis: LIBOR se dispara cuando se desconfía de los bancos, mientras que SOFR puede dispararse cuando escasean las garantías o la capacidad de balance de los dealers.',
      'Los picos son un diagnóstico. Cuando SOFR se publica muy por encima del suelo administrado, suele indicar que las reservas se han vuelto escasas o que los dealers no pueden ampliar sus carteras, como en septiembre de 2019.',
    ],
    mechanics: [
      { label: 'Qué mide', detail: 'Préstamos de efectivo a un día con garantía de deuda del Tesoro, ponderados por operación.' },
      { label: 'Lo publica', detail: 'El Banco de la Reserva Federal de Nueva York, cada día hábil por la mañana.' },
      { label: 'Se compara con', detail: 'IORB y el tipo de ON RRP, el suelo administrado cerca del cual debería estar.' },
    ],
    misreading:
      'Que SOFR es simplemente el nuevo LIBOR. Es un tipo con garantía y sin estructura temporal propia, y por eso hubo que construir por separado un SOFR a plazo y por eso los diferenciales de los préstamos tuvieron que recalcularse, no solo cambiar de nombre.',
  },
  'euro-short-term-rate': {
    term: 'Tipo de interés a corto plazo del euro',
    aliases: ['ESTR', 'euro STR'],
    definition:
      'La referencia del BCE para el coste de los préstamos a un día sin garantía de los bancos de la zona del euro, calculada a partir de operaciones declaradas del mercado monetario y sustituta de EONIA.',
    explanation: [
      'El €STR se construye con el lado tomador de las estadísticas del mercado monetario del euro, y cubre los depósitos a un día sin garantía que los bancos reciben de contrapartes financieras. Como no tiene garantía, incorpora una pequeña dosis de riesgo de crédito bancario que SOFR no tiene.',
      'En condiciones normales cotiza algo por debajo del tipo de la facilidad de depósito, porque algunos prestamistas de la muestra no pueden acceder directamente a las facilidades del BCE y aceptan un poco menos.',
      'Vigilar el diferencial entre €STR y DFR es una de las pruebas más limpias de si un sistema de suelo funciona: una brecha creciente significa que el suelo tiene fugas.',
    ],
    mechanics: [
      { label: 'Qué mide', detail: 'Préstamos a un día sin garantía que reciben los bancos de la zona del euro de contrapartes financieras.' },
      { label: 'Lo publica', detail: 'El Banco Central Europeo, cada día hábil de TARGET.' },
      { label: 'Equivalente en EE. UU.', detail: 'El tipo efectivo de los fondos federales, sin garantía, más que SOFR.' },
    ],
    misreading:
      'Que €STR y SOFR son intercambiables entre monedas. Uno no tiene garantía y el otro sí; en un episodio de tensión se mueven por razones opuestas.',
  },
  'repurchase-agreement': {
    term: 'Acuerdo de recompra',
    aliases: ['repo', 'repo inverso', 'venta con pacto de recompra'],
    definition:
      'La venta de un título junto con el acuerdo de recomprarlo a un precio y en una fecha fijados: legalmente una venta, económicamente un préstamo con garantía.',
    explanation: [
      'El repo es la fontanería de las finanzas modernas. Los dealers financian en él su inventario, los fondos monetarios colocan en él su efectivo, y es la forma de convertir deuda del Tesoro en efectivo sin venderla definitivamente.',
      'La forma legal importa muchísimo en un impago. Como es una venta y no una prenda, quien presta el efectivo puede quedarse con la garantía y venderla de inmediato en lugar de hacer cola en una quiebra, y eso hace que los prestamistas estén dispuestos a financiar con diferenciales muy ajustados.',
      'La misma operación tiene dos nombres según dónde estés. Quien pide prestado el efectivo hace un repo; quien lo presta hace un repo inverso. La facilidad ON RRP de la Fed lleva el nombre desde el lado de la Fed.',
    ],
    mechanics: [
      { label: 'Quien pide el efectivo', detail: 'Entrega la garantía, recibe el efectivo y se compromete a recomprar, normalmente a un día.' },
      { label: 'Recorte', detail: 'La garantía vale algo más que el efectivo, lo que protege a quien presta de los movimientos de precios.' },
      { label: 'Reutilización', detail: 'La garantía se puede volver a entregar, así que un mismo bono puede sostener varias cadenas de crédito.' },
    ],
    misreading:
      'Que el repo es un tecnicismo de nicho. Es el mercado donde realmente se fija el precio del dinero a un día, y todas las grandes crisis de financiación posteriores a 1990 han pasado por él.',
  },
  eurodollar: {
    term: 'Eurodólar',
    aliases: ['dólares offshore', 'sistema del eurodólar'],
    definition:
      'Un depósito en dólares estadounidenses en un banco fuera de la jurisdicción de Estados Unidos: dólares creados en el exterior, más allá del alcance directo de la Reserva Federal.',
    explanation: [
      'El nombre es un accidente histórico: el mercado empezó con depósitos en dólares en bancos europeos y no tiene nada que ver con el euro. Un depósito en dólares en Tokio o Singapur también es un eurodólar.',
      'Un banco fuera de EE. UU. puede crear depósitos en dólares prestando dólares, igual que un banco estadounidense, pero no puede crear las reservas con las que al final se liquidan esos derechos. Cuando se seca la financiación en dólares offshore, no hay un prestamista de última instancia nacional detrás.',
      'Por eso existen las líneas de swap de la Fed. Son el mecanismo con el que la Fed presta dólares a otros bancos centrales para que alivien la tensión en un sistema del dólar que funciona fuera de sus fronteras.',
    ],
    mechanics: [
      { label: 'Dónde está el depósito', detail: 'En un banco fuera de la jurisdicción de EE. UU., denominado en USD.' },
      { label: 'Qué le falta', detail: 'Acceso directo a las reservas de la Fed, seguro de depósitos y ventanilla de descuento.' },
      { label: 'Señal de tensión', detail: 'Swaps de base entre divisas que se vuelven muy negativos frente al dólar.' },
    ],
    misreading:
      'Que el sistema del dólar está contenido dentro de Estados Unidos. La mayor parte del crédito en dólares se crea fuera, y por eso un banco central estadounidense acaba actuando como el del mundo.',
  },
  'primary-dealer': {
    term: 'Creador de mercado primario',
    definition:
      'Una contraparte de negociación de la Fed de Nueva York, obligada a pujar en todas las subastas del Tesoro y a crear mercado en deuda pública: el canal por el que las operaciones de mercado abierto llegan al sistema financiero.',
    explanation: [
      'La Fed no compra bonos al público. Opera con una lista reducida de creadores de mercado primarios, y esos dealers son el puente entre el balance del banco central y el de todos los demás.',
      'La obligación va en los dos sentidos: los dealers tienen acceso a las operaciones de la Fed y, a cambio, deben participar en las subastas y crear mercado incluso cuando no les sale rentable.',
      'La capacidad de balance de los dealers es una restricción real para todo el sistema. Cuando las normas de apalancamiento o los límites de riesgo les impiden crecer, los mercados de repo se atascan aunque a la garantía en sí no le pase nada.',
    ],
    mechanics: [
      { label: 'Contraparte de', detail: 'La mesa de operaciones de mercado abierto de la Fed de Nueva York.' },
      { label: 'Obligaciones', detail: 'Pujar en las subastas del Tesoro, crear mercado e informar de posiciones y flujos.' },
      { label: 'Por qué importa la capacidad', detail: 'Intermediar requiere balance, y el balance es finito y está regulado.' },
    ],
    misreading:
      'Que la QE mete dinero directamente en la economía real. Primero llega a un dealer, y que vaya más lejos depende de lo que haga después quien vende.',
  },
  'treasury-general-account': {
    term: 'Cuenta General del Tesoro',
    aliases: ['cuenta de efectivo del Tesoro'],
    definition:
      'La cuenta operativa del Tesoro de EE. UU. en la Reserva Federal: la cuenta corriente del Gobierno, y un pasivo del banco central que compite directamente con las reservas bancarias.',
    explanation: [
      'Cuando pagas impuestos, el dinero sale de tu depósito bancario, tu banco pierde reservas y la TGA sube. El balance de la Fed no cambia de tamaño; su pasivo simplemente pasa de los bancos al Gobierno.',
      'Lo contrario ocurre cuando el Tesoro gasta: la TGA baja y las reservas vuelven al sistema bancario. El gasto público es, mecánicamente, una inyección de reservas.',
      'Esto hace de la TGA una de las mayores fuentes de volatilidad semanal en los saldos de reservas, a menudo mayor que cualquier cosa que el banco central haga a propósito. Los episodios del techo de deuda, en los que el saldo se agota y luego se reconstruye, mueven cientos de miles de millones.',
    ],
    mechanics: [
      { label: 'Pago de impuestos', detail: 'Bajan los depósitos, bajan las reservas, sube la TGA. Baja la base monetaria.' },
      { label: 'Gasto público', detail: 'Baja la TGA, suben las reservas, suben los depósitos. Sube la base monetaria.' },
      { label: 'Emisión de bonos', detail: 'Drena reservas cuando pagan los compradores, hasta que lo recaudado se vuelve a gastar.' },
    ],
    misreading:
      'Que el endeudamiento y el gasto del Gobierno son neutrales para el sistema bancario. Cada movimiento de la TGA es un movimiento de reservas, y por eso quienes hacen previsiones de liquidez la vigilan tanto como la política monetaria.',
  },
  'discount-window': {
    term: 'Ventanilla de descuento',
    aliases: ['crédito primario', 'facilidad de prestamista de última instancia'],
    definition:
      'La facilidad permanente de la Reserva Federal para prestar directamente a los bancos con garantía: la red de seguridad que debería limitar cuánto pueden subir los tipos a corto plazo.',
    explanation: [
      'En teoría, ningún banco debería pagar más que el tipo de descuento por pedir prestado a un día, porque siempre puede pedírselo a la Fed. En la práctica, ese techo tiene fugas, porque pedir prestado ahí conlleva un estigma.',
      'El estigma es el problema central de diseño de la ventanilla. A un banco que la usa se le puede considerar incapaz de financiarse en privado, así que los bancos la evitan justo cuando más la necesitan, lo contrario de lo que debería hacer una red de seguridad.',
      'La regla de Bagehot (prestar libremente, con buena garantía, a un tipo de penalización) es la doctrina detrás de la facilidad, y sigue siendo el resumen más certero en una línea de para qué sirve un prestamista de última instancia.',
    ],
    mechanics: [
      { label: 'Dirección', detail: 'La Fed presta; el banco entrega garantías y recibe reservas de nueva creación.' },
      { label: 'Crédito primario', detail: 'Disponible para entidades sólidas, a corto plazo, a un tipo superior al rango objetivo.' },
      { label: 'Equivalente en la zona del euro', detail: 'La facilidad marginal de crédito, en lo alto del corredor del BCE.' },
    ],
    misreading:
      'Que pedir prestado en la ventanilla de descuento indica que un banco está quebrando. Indica que le falta liquidez, que no es lo mismo que le falte capital; confundir ambas cosas es lo que convierte un problema de financiación en uno de solvencia.',
  },
  'central-bank-swap-line': {
    term: 'Línea de swap de liquidez entre bancos centrales',
    aliases: ['líneas de swap en dólares', 'líneas de swap de la Fed'],
    definition:
      'Un acuerdo por el que la Reserva Federal presta dólares a otro banco central a cambio de su moneda, para que ese banco pueda aliviar la tensión de financiación en dólares entre sus propios bancos.',
    explanation: [
      'La Fed intercambia dólares por euros, yenes o libras al tipo de contado vigente, con el acuerdo de deshacer la operación más tarde al mismo tipo. El banco central extranjero asume el riesgo de crédito de prestar esos dólares a sus propios bancos; la contraparte de la Fed es el propio banco central.',
      'Esta es la respuesta institucional al problema del eurodólar. Instituciones sin acceso a la Fed crean pasivos en dólares en todo el mundo, y en una crisis de liquidez alguien tiene que aportar los dólares con los que se liquidan esos pasivos.',
      'Las líneas de swap se convirtieron en acuerdos permanentes entre seis grandes bancos centrales después de 2008 y se ampliaron de forma espectacular en marzo de 2020. Son la pieza menos comentada y más importante de la arquitectura mundial frente a las crisis.',
    ],
    mechanics: [
      { label: 'Primer tramo', detail: 'La Fed abona dólares al banco central extranjero y recibe a cambio su moneda.' },
      { label: 'Préstamo posterior', detail: 'El banco central extranjero subasta esos dólares entre sus propios bancos, con garantía.' },
      { label: 'Riesgo', detail: 'La Fed tiene enfrente a un banco central, no a un banco comercial, y mantiene moneda extranjera durante toda la operación.' },
    ],
    misreading:
      'Que las líneas de swap son un rescate de bancos extranjeros pagado por los contribuyentes estadounidenses. Tienen garantía, se deshacen al tipo de cambio original y han sido históricamente rentables; la alternativa es una escasez de dólares que de todos modos acaba cayendo sobre los mercados de EE. UU.',
  },
  'money-multiplier': {
    term: 'Multiplicador monetario',
    aliases: ['multiplicador de depósitos', 'multiplicador de reserva fraccionaria'],
    definition:
      'El cociente de los manuales, m = 1/R, que describe el máximo de dinero en depósitos que un sistema bancario podría sostener sobre una base de reservas dada: un techo, no una descripción de cómo funcionan de verdad los bancos.',
    explanation: [
      'El modelo sigue una cadena: llega un depósito, el banco guarda una fracción R y presta el resto, el préstamo vuelve a depositarse, y así sucesivamente. Sumado hasta el infinito, una unidad de base monetaria sostiene 1/R unidades de depósitos.',
      'Es un primer modelo mental útil y una mala descripción de la realidad. Los bancos centrales modernos fijan como objetivo un tipo de interés y no una cantidad de reservas, varios han fijado en cero el coeficiente de reservas obligatorio (la Fed lo hizo en marzo de 2020) y a los bancos los limitan el capital, la regulación y la demanda de crédito mucho antes que las reservas.',
      'Lo honesto es conservar el modelo conociendo sus límites. Te dice lo que podría hacer un sistema sin restricciones, y la distancia entre eso y el préstamo observado es en sí la cantidad interesante.',
    ],
    mechanics: [
      { label: 'Fórmula', detail: 'm = 1 / R, por lo que los depósitos totales son M = D × (1 / R).' },
      { label: 'Supone', detail: 'Ninguna fuga de efectivo, todos los bancos prestando al límite y un coeficiente de reservas obligatorio que restringe.' },
      { label: 'Contraste con la realidad', detail: 'Después de 2008, la base monetaria se multiplicó y el dinero en sentido amplio no.' },
    ],
    misreading:
      'Que el multiplicador describe la causalidad: que las reservas se prestan y se multiplican. Prestar crea primero depósitos; las reservas se gestionan después, y el banco central aporta la cantidad que requiera su objetivo de tipos.',
  },
  'legal-tender': {
    term: 'Curso legal',
    aliases: ['moneda fiat', 'cartalismo', 'moneda fiduciaria'],
    definition:
      'El dinero que por ley un acreedor debe aceptar para saldar una deuda: uno de los soportes, junto con las obligaciones fiscales, que hacen universalmente aceptable una ficha sin valor intrínseco.',
    explanation: [
      'La ley de curso legal es más limitada de lo que se suele creer. Regula la liquidación de deudas ya contraídas; no obliga a una tienda a aceptar efectivo por un bocadillo, y la mayoría de los países permiten a los vendedores fijar sus condiciones de antemano.',
      'El soporte más fuerte son los impuestos. Un Gobierno que exige el pago en una unidad concreta crea una demanda continua y obligatoria de esa unidad: es el argumento cartalista de que los impuestos impulsan el dinero, y la razón de que la aceptación de una moneda siga el alcance del Estado que la emite.',
      'El resto es confianza institucional: un banco central independiente, contratos exigibles y una expectativa razonable de que la unidad seguirá significando algo el año que viene. Nada de esto es un respaldo físico, y por eso precisamente se llama fiduciario a este sistema.',
    ],
    mechanics: [
      { label: 'Soporte legal', detail: 'La ley hace que la unidad sea válida para saldar deudas dentro de la jurisdicción.' },
      { label: 'Soporte fiscal', detail: 'Las obligaciones fiscales denominadas en la unidad crean una demanda permanente de ella.' },
      { label: 'Soporte institucional', detail: 'La credibilidad del emisor y la expectativa de que la defenderá.' },
    ],
    misreading:
      'Que el dinero fiat «no está respaldado por nada». Lo respalda una estructura de derechos exigibles (obligaciones fiscales, tribunales y un banco central), algo distinto de estar respaldado por una materia prima.',
  },
};
