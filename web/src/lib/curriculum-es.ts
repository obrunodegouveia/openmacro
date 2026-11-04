/**
 * The syllabus and the four-tier model in Spanish (Spain), an overlay on the
 * English.
 *
 * Track titles are absent on purpose — they come from the course catalogue,
 * which already has them. What is here is the copy that exists only on the
 * site, written with `tú` and Banco de España / BCE terminology.
 *
 * Acronyms and instrument names stay untouched. Fedwire, TARGET2, SOFR, €STR,
 * IORB, ON RRP, H.4.1, IMT and VPT are what the things are called; the
 * sentences around them are Spanish.
 */

import type { CurriculumOverlay } from '@/lib/curriculum-locale';

export const CURRICULUM_ES: CurriculumOverlay = {
  tiers: {
    central_bank: {
      name: 'El banco central',
      subject: 'La Fed y el BCE',
      premise:
        'El único balance que liquida todos los demás. Su pasivo es la base del sistema.',
      assets: ['Bonos soberanos', 'Valores privados (APP/PEPP)', 'Oro y reservas de divisas', 'Préstamos de descuento'],
      liabilities: ['Billetes en circulación', 'Reservas de los bancos comerciales (M0)', 'Repos inversos', 'Efectivo del Gobierno (TGA)'],
      levers: ['IORB', 'ON RRP', 'Tipo de la facilidad de depósito del BCE', 'MRO', 'QE / QT'],
    },
    commercial_bank: {
      name: 'La capa comercial',
      subject: 'Bancos que aceptan depósitos',
      premise:
        'Donde se crea la mayor parte del dinero que gastas de verdad: prestando, no imprimiendo.',
      assets: ['Préstamos e hipotecas', 'Depósitos de reservas en el banco central', 'Cartera de valores'],
      liabilities: ['Depósitos de clientes (M1/M2)', 'Préstamos interbancarios', 'Capital'],
      levers: ['Los préstamos crean depósitos', 'Gestión de reservas', 'Compensación y liquidación', 'Pánicos bancarios'],
    },
    shadow_bank: {
      name: 'Banca en la sombra y mercados monetarios',
      subject: 'Fondos monetarios, dealers, mesas de repo',
      premise:
        'Financiación al estilo de un banco sin licencia bancaria y sin acceso a reservas.',
      assets: ['Derechos de repo y repo inverso', 'Garantías del Tesoro', 'Pagarés de empresa'],
      liabilities: ['Participaciones en fondos', 'Préstamos en repo', 'Depósitos en eurodólares'],
      levers: ['El sistema del eurodólar', 'Capacidad de balance de los dealers', 'Reutilización de garantías', 'SOFR y €STR'],
    },
    fiduciary_core: {
      name: 'El núcleo fiduciario',
      subject: 'El Estado y el marco legal',
      premise:
        'Por qué se acepta siquiera una ficha sin respaldo: obligaciones fiscales, curso legal y confianza institucional.',
      assets: ['Derechos fiscales futuros', 'Infraestructura pública'],
      liabilities: ['Deuda soberana', 'La propia moneda'],
      levers: ['Cartalismo y demanda impulsada por los impuestos', 'Ley de curso legal', 'Tipos de cambio fijos', 'Confianza y credibilidad'],
    },
  },

  tracks: {
    'start-here': {
      promise:
        'Entender el número de tu app del banco, y por qué una decisión en Fráncfort llega a tu hipoteca.',
      concepts: [
        'Los depósitos como promesas',
        'Qué es un banco',
        'Qué paga un tipo de interés',
        'Quién manda y quién no',
        'Qué hace la inflación y a quién',
      ],
    },
    'foundations-fiduciary-currency': {
      promise:
        'Explicar por qué se acepta siquiera un papel sin respaldo, sin recurrir a vaguedades sobre la confianza.',
      concepts: ['De las fichas de mercancía al cartalismo', 'Curso legal y obligaciones fiscales', 'Poder adquisitivo', 'Tipos de cambio fijos y respaldo en reservas'],
    },
    'commercial-central-interface': {
      promise:
        'Seguir un pago de un banco a otro y decir exactamente qué se liquida, y en qué.',
      concepts: ['Corresponsalía bancaria', 'Fedwire y TARGET2', 'Reservas fraccionarias', 'SOFR y €STR'],
    },
    'fed-ecb-levers': {
      promise:
        'Registrar tú mismo todas las grandes operaciones de política monetaria: la QE, el suelo, el corredor, la ventanilla.',
      concepts: ['IORB y el corredor de SOFR', 'El suelo de ON RRP', 'Ventanilla de descuento', 'DFR, MRO y TLTRO', 'Control de la curva de rendimientos'],
    },
    'crisis-architecture-global-dollar': {
      promise:
        'Seguir el sistema del dólar offshore, y leer un rescate mientras ocurre y no después.',
      concepts: ['Líneas de swap entre bancos centrales', 'Prestamista de última instancia', 'Bail-in frente a bail-out', 'Crisis de liquidez en eurodólares'],
    },
    'reading-the-fed-balance-sheet': {
      promise:
        'Abrir la publicación de esta semana de la Fed y leerla sin traductor.',
      concepts: [
        'La publicación H.4.1',
        'Cuenta General del Tesoro',
        'Las reservas como residuo',
        'El drenaje de ON RRP',
        'QT frente a crecimiento del balance',
      ],
    },
    'reading-the-ecb-balance-sheet': {
      promise:
        'Leer el estado financiero semanal del Eurosistema, y saber qué partes del de la Fed fueron decisiones.',
      concepts: [
        'El estado financiero semanal',
        'Oro y cuentas de revalorización',
        'Facilidad de depósito frente a cuentas corrientes',
        'El €STR bajo el suelo',
        'Dos bancos centrales que divergen',
      ],
    },
    'the-treasury-yield-curve': {
      promise:
        'Mirar once números y decir qué cree el mercado que se avecina.',
      concepts: [
        'Rendimientos a la par y prima por plazo',
        'Precio, rendimiento y duración',
        'La inversión y lo que indica',
        'Empinamientos alcistas y bajistas',
      ],
    },
    'debt-debasement-and-capital': {
      promise:
        'Averiguar quién paga una deuda que nunca se devuelve, y qué construirían en su lugar los mismos recursos.',
      concepts: [
        'El impuesto inflacionario',
        'La financiación de las guerras a lo largo de la historia',
        'r − g y la trayectoria de la deuda',
        'Formación y asignación de capital',
      ],
    },
    'breaking-a-peg-1992': {
      promise:
        'Calcular tú mismo la operación contra la libra, y saber por qué la defensa no podía ganar.',
      concepts: [
        'El MTC y el trilema',
        'Vender en corto una moneda con tipo de cambio fijo',
        'Coste de mantenimiento frente a ganancia por devaluación',
        'Intervención y esterilización',
        'Reflexividad a gran escala',
      ],
    },
    'the-bis-and-the-ecb': {
      promise:
        'Distinguir los canales reales de influencia entre Basilea y Fráncfort de los imaginados.',
      concepts: [
        'Un banco para bancos centrales',
        'Las normas de Basilea en la legislación de la UE',
        'Independencia de los bancos centrales',
        'Influencia sin autoridad',
      ],
    },
    'african-central-banks': {
      promise:
        'Leer un sistema monetario lo bastante bien para decir quién soporta cada coste y quién se lleva cada beneficio.',
      concepts: [
        'Dos francos CFA, dos bancos centrales',
        'La cuenta de operaciones y la reforma de 2020',
        'Política monetaria importada',
        'Apreciación real con tipo de cambio fijo',
        'Quién gana con un tipo fijo',
      ],
    },
    'real-assets-and-property': {
      promise:
        'Averiguar quién paga un auge inmobiliario, y qué tendría que ser cierto para que se invirtiera.',
      concepts: [
        'Activos reales frente a derechos nominales',
        'El efecto Cantillon',
        'Las hipotecas como dinero creado',
        'Coste de reposición y oferta',
        'Qué predice de verdad un desplome',
      ],
    },
    euribor: {
      promise:
        'Leer el mercado monetario del euro a partir de cuatro números, y saber a qué está referenciada tu hipoteca.',
      concepts: [
        'La cascada híbrida',
        'El euríbor frente al €STR',
        'Los plazos como curva de expectativas',
        'La revisión y su retraso',
        'El diferencial euríbor–OIS',
      ],
    },
    'buying-property-portugal': {
      promise:
        'Saber al euro lo que cuesta una compra, y cuántos años de revalorización hacen falta para compensarlo.',
      concepts: [
        'La tabla del IMT de 2026',
        'El impuesto de timbre y la escritura',
        'IMI, VPT y mantenimiento',
        'Costes de transacción de ida y vuelta',
        'El coste de mantenimiento como listón',
      ],
    },
    'scrutinising-cbdcs': {
      promise:
        'Leer un experimento de CBDC lo bastante bien para decir qué construyó, y quién tendría que dar el visto bueno para que fuera dinero.',
      concepts: [
        'Mayorista frente a minorista',
        'La emisión de wCBDC como intercambio de pasivos',
        'Puentes, pools y curvas de vinculación',
        'Prefinanciación frente a liquidación neta',
        'Las funciones de control, de C.1 a C.5',
      ],
    },
  },
};
