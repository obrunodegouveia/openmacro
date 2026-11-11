import type { Locale } from "@openmacro/core/i18n/locales";

/**
 * The bounty announced on 11 November 2026. The same numbers are in
 * supabase/migrations/0014_bounty_exam.sql, which is what actually decides
 * who gets an exam; change both together.
 */
export const BOUNTY = {
  /** Midnight in San Salvador. Accounts created before this do not count. */
  start: "2026-11-11T06:00:00Z",
  xp: 2100,
  sats: 21000,
  questions: 21,
  passCorrect: 15,
  secondsPerQuestion: 60,
  /** The first half of Banking and Money, lessons 1 to 13. */
  lessons: [
    "kab-what-a-bank-is-for",
    "kab-income-statement",
    "kab-fractional-reserve",
    "kab-is-it-real-wealth",
    "kab-bank-notes",
    "kab-notes-and-cheques",
    "kab-lending-without-gold",
    "kab-reserve-ratios",
    "kab-more-on-reserve-ratios",
    "kab-leverage",
    "kab-a-reserve-bank",
    "kab-treasuries",
    "kab-open-market-operations",
  ],
} as const;

const EN = {
  title: "The 21,000 sats challenge",
  lead: "Learn how banks create money. The first person to prove it wins 21,000 sats (about US$15), paid in bitcoin.",
  rulesTitle: "The rules",
  rules: [
    "Create a free OpenMacro account on or after 11 November 2026, in the app or on this site.",
    "Study the first half of Banking and Money (Khan Academy): lessons 1 to 13, from “Why We Have Banks” to “The Two Printing Presses”. Watch the videos.",
    "Finish all 13 lessons and reach 2,100 XP. That is 10 sats for every XP.",
    "Your exam appears on the home screen by itself: 21 questions from those lessons, 60 seconds each, one attempt.",
    "Pass with 70% or more (15 of 21). The first person to pass wins. After that, no new exams are handed out.",
    "Come back to this page and leave your Bitcoin address. The prize is sent by hand from the organiser's wallet, usually within a few days.",
  ],
  fairTitle: "Fair play",
  fair: "Before paying, the organiser checks the winner's record: how the lessons were spread over time and how long the exam took. If it looks automated, the organiser may ask a few questions on a video call, or move on to the next person who passed. The app itself never holds or sends bitcoin; it is a free app with no fees.",
  studyLink: "Start the lessons",
  statusTitle: "Where you stand",
  loading: "Loading…",
  signIn: "Sign in with the account you study with to see your progress.",
  notEligible: "This account was created before 11 November 2026, so it does not count for the challenge. Every lesson is still free.",
  xpLabel: "XP:",
  lessonsLabel: "Lessons 1–13 finished:",
  examLabel: "Exam:",
  examNotYet: "appears when you have both.",
  examReady: "ready on your home screen.",
  goToExam: "Go to your exam →",
  passed: "passed",
  failed: "not passed",
  addressLabel: "Your Bitcoin address",
  placeholder: "bc1…",
  addressHint: "Mainnet only: starts with bc1, 1 or 3. Copy it from your wallet; do not type it.",
  save: "Save address",
  saving: "Saving…",
  saved: "Saved. The organiser will send the prize to this address.",
  current: "Prize goes to:",
  badAddress: "That is not a valid Bitcoin mainnet address. Copy it again from your wallet.",
  paid: "Paid. Transaction:",
};

type BountyCopy = { [K in keyof typeof EN]: (typeof EN)[K] extends readonly string[] ? readonly string[] : string };

const ES: BountyCopy = {
  title: "El reto de los 21.000 sats",
  lead: "Aprende cómo los bancos crean dinero. La primera persona que lo demuestre gana 21.000 sats (unos 15 US$), pagados en bitcoin.",
  rulesTitle: "Las reglas",
  rules: [
    "Crea una cuenta gratuita de OpenMacro a partir del 11 de noviembre de 2026, en la app o en esta web.",
    "Estudia la primera mitad de Banca y dinero (Khan Academy): las lecciones 1 a 13, de «Por qué tenemos bancos» a «Las dos imprentas». Mira los vídeos.",
    "Termina las 13 lecciones y llega a 2.100 XP. Son 10 sats por cada XP.",
    "Tu examen aparece solo en la pantalla de inicio: 21 preguntas de esas lecciones, 60 segundos cada una, un solo intento.",
    "Aprueba con un 70 % o más (15 de 21). Gana la primera persona que apruebe. Después ya no se reparten más exámenes.",
    "Vuelve a esta página y deja tu dirección bitcoin. El premio se envía a mano desde la cartera del organizador, normalmente en pocos días.",
  ],
  fairTitle: "Juego limpio",
  fair: "Antes de pagar, el organizador revisa el historial del ganador: cómo se repartieron las lecciones en el tiempo y cuánto duró el examen. Si parece automatizado, puede hacer unas preguntas por videollamada o pasar a la siguiente persona que aprobó. La app nunca guarda ni envía bitcoin; es gratuita y no cobra comisiones.",
  studyLink: "Empezar las lecciones",
  statusTitle: "Cómo vas",
  loading: "Cargando…",
  signIn: "Inicia sesión con la cuenta con la que estudias para ver tu progreso.",
  notEligible: "Esta cuenta se creó antes del 11 de noviembre de 2026, así que no cuenta para el reto. Todas las lecciones siguen siendo gratis.",
  xpLabel: "XP:",
  lessonsLabel: "Lecciones 1–13 terminadas:",
  examLabel: "Examen:",
  examNotYet: "aparece cuando tengas las dos cosas.",
  examReady: "listo en tu pantalla de inicio.",
  goToExam: "Ir a tu examen →",
  passed: "aprobado",
  failed: "no aprobado",
  addressLabel: "Tu dirección bitcoin",
  placeholder: "bc1…",
  addressHint: "Solo mainnet: empieza por bc1, 1 o 3. Cópiala de tu cartera; no la escribas a mano.",
  save: "Guardar dirección",
  saving: "Guardando…",
  saved: "Guardada. El organizador enviará el premio a esta dirección.",
  current: "El premio va a:",
  badAddress: "Esa no es una dirección bitcoin mainnet válida. Vuelve a copiarla de tu cartera.",
  paid: "Pagado. Transacción:",
};

export function bountyCopy(locale: Locale): BountyCopy {
  return locale === "es-ES" ? ES : EN;
}
