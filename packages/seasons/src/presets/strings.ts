/**
 * The preset seasons' words, in English and European Portuguese, and a tiny
 * translator so an app without an i18n library can use them as they are.
 *
 * An app with its own i18n has two choices, and both are one line:
 *
 * - Copy these keys into its own catalogues and pass its own `t` as the
 *   provider's `translate`. The type checker then holds every pack to the
 *   catalogue (`SeasonPack<YourKey>`).
 * - Keep these, override a line or two: `createTranslator('en', { 'season.summer.toy.2': '…' })`.
 *
 * `{name}`-style placeholders are filled from the second argument.
 */

import type { PresetSeasonKey } from './packs.ts';

/** The keys the renderers' own chrome uses, besides each season's. */
export type ChromeKey =
  | 'season.welcomeDismiss'
  | 'season.settings.label'
  | 'season.settings.hint'
  | 'season.mode.auto'
  | 'season.mode.calm'
  | 'season.mode.off'
  | 'season.mode.calmHint';

/** Every key with bundled text. */
export type PresetStringKey = PresetSeasonKey | ChromeKey;

/** The bundled languages. */
export type PresetLocale = 'en' | 'pt-PT';

/** One language's strings: every key, nothing else. */
export type PresetDictionary = Readonly<Record<PresetStringKey, string>>;

/** English. */
const en: PresetDictionary = {
  'season.halloween.name': 'Halloween',
  'season.halloween.greeting': '🎃 Happy Halloween!',
  'season.halloween.welcome': 'Happy Halloween, {name}!',
  'season.halloween.toy.1': 'Hey! 😠',
  'season.halloween.toy.2': 'I was napping.',
  'season.halloween.toy.3': 'Once more and I’m telling the bats.',
  'season.christmas.name': 'Christmas',
  'season.christmas.greeting': '🎄 Merry Christmas!',
  'season.christmas.welcome': 'Ho ho ho, {name}!',
  'season.christmas.toy.1': 'Jingle!',
  'season.christmas.toy.2': 'Jingle jingle!',
  'season.christmas.toy.3': 'I’m a bell, not a doorbell.',
  'season.spring.name': 'Spring',
  'season.spring.greeting': '🌷 Happy spring!',
  'season.spring.welcome': 'Happy spring, {name}!',
  'season.spring.toy.1': 'Bzz! I’m busy.',
  'season.spring.toy.2': 'Do I look like a flower to you?',
  'season.spring.toy.3': 'Buzz off. Politely.',
  'season.summer.name': 'Summer',
  'season.summer.greeting': '☀️ Happy summer!',
  'season.summer.welcome': 'Sunny day, {name}!',
  'season.summer.toy.1': 'Boing!',
  'season.summer.toy.2': 'I’m a beach ball, not a volleyball.',
  'season.summer.toy.3': 'Don’t forget the sunscreen.',
  'season.autumn.name': 'Autumn',
  'season.autumn.greeting': '🍁 Happy autumn!',
  'season.autumn.welcome': 'Cosy autumn, {name}!',
  'season.autumn.toy.1': 'I’m not a nut. Well, I am.',
  'season.autumn.toy.2': 'Squirrels! I’m up here!',
  'season.autumn.toy.3': 'One day I’ll be an oak.',
  'season.winter.name': 'Winter',
  'season.winter.greeting': '❄️ Happy winter!',
  'season.winter.welcome': 'Stay warm, {name}!',
  'season.winter.toy.1': 'Brr!',
  'season.winter.toy.2': 'Has anyone seen my other half?',
  'season.winter.toy.3': 'Cold hands, warm heart.',
  'season.welcomeDismiss': 'Closes the welcome',
  'season.settings.label': 'Seasonal look',
  'season.settings.hint': '{season} colours, decorations and a few surprises',
  'season.mode.auto': 'On',
  'season.mode.calm': 'Calm',
  'season.mode.off': 'Off',
  'season.mode.calmHint': 'Calm keeps the colours, without motion or creepy-crawlies.',
};

/** European Portuguese: `tu`, the 1990 spelling, European vocabulary. */
const ptPT: PresetDictionary = {
  'season.halloween.name': 'Halloween',
  'season.halloween.greeting': '🎃 Feliz Halloween!',
  'season.halloween.welcome': 'Feliz Halloween, {name}!',
  'season.halloween.toy.1': 'Ei! 😠',
  'season.halloween.toy.2': 'Eu estava a dormir.',
  'season.halloween.toy.3': 'Mais uma e vou contar aos morcegos.',
  'season.christmas.name': 'Natal',
  'season.christmas.greeting': '🎄 Feliz Natal!',
  'season.christmas.welcome': 'Ho ho ho, {name}!',
  'season.christmas.toy.1': 'Dlim!',
  'season.christmas.toy.2': 'Dlim dlim!',
  'season.christmas.toy.3': 'Sou um sino, não uma campainha.',
  'season.spring.name': 'Primavera',
  'season.spring.greeting': '🌷 Feliz primavera!',
  'season.spring.welcome': 'Feliz primavera, {name}!',
  'season.spring.toy.1': 'Bzz! Estou ocupada.',
  'season.spring.toy.2': 'Pareço-te uma flor?',
  'season.spring.toy.3': 'Vai zumbir para outro lado. Com educação.',
  'season.summer.name': 'Verão',
  'season.summer.greeting': '☀️ Bom verão!',
  'season.summer.welcome': 'Dia de sol, {name}!',
  'season.summer.toy.1': 'Boing!',
  'season.summer.toy.2': 'Sou uma bola de praia, não de vólei.',
  'season.summer.toy.3': 'Não te esqueças do protetor solar.',
  'season.autumn.name': 'Outono',
  'season.autumn.greeting': '🍁 Bom outono!',
  'season.autumn.welcome': 'Bom outono, {name}!',
  'season.autumn.toy.1': 'Não sou uma noz. Sou uma bolota.',
  'season.autumn.toy.2': 'Esquilos! Estou aqui em cima!',
  'season.autumn.toy.3': 'Um dia vou ser um carvalho.',
  'season.winter.name': 'Inverno',
  'season.winter.greeting': '❄️ Bom inverno!',
  'season.winter.welcome': 'Agasalha-te, {name}!',
  'season.winter.toy.1': 'Brr!',
  'season.winter.toy.2': 'Alguém viu a minha outra metade?',
  'season.winter.toy.3': 'Mãos frias, coração quente.',
  'season.welcomeDismiss': 'Fecha as boas-vindas',
  'season.settings.label': 'Decoração da época',
  'season.settings.hint': 'Cores, decorações e umas surpresas de {season}',
  'season.mode.auto': 'Ligada',
  'season.mode.calm': 'Calma',
  'season.mode.off': 'Desligada',
  'season.mode.calmHint': 'Calma mantém as cores, sem movimento nem bicharada.',
};

/** Every bundled language. */
export const PRESET_STRINGS: Readonly<Record<PresetLocale, PresetDictionary>> = { en, 'pt-PT': ptPT };

/** Values for a string's `{placeholders}`. */
export type TranslateValues = Readonly<Record<string, string | number>>;

/**
 * Turns a key into text. The renderers call it for every word they show; an
 * app passes its own (`t` from i18next, next-intl, its own catalogue) or one
 * made by `createTranslator`.
 */
export type Translate = (key: string, values?: TranslateValues) => string;

/**
 * Fills `{placeholders}` in a string. Unknown ones are left as they are, so
 * a missing value shows up in review rather than as an empty gap.
 *
 * @param text The string.
 * @param values The values.
 * @return The filled string.
 */
export function interpolate(text: string, values?: TranslateValues): string {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
}

/**
 * The bundled language closest to a locale tag: an exact match, then the
 * same language (`pt`, `pt-BR` → `pt-PT`), then English.
 *
 * @param locale A BCP 47 tag such as `pt-PT`, `en-GB` or `pt`.
 * @return The bundled language to use.
 */
export function presetLocale(locale: string): PresetLocale {
  if (locale in PRESET_STRINGS) return locale as PresetLocale;
  const language = locale.toLowerCase().split(/[-_]/)[0];
  return language === 'pt' ? 'pt-PT' : 'en';
}

/**
 * A translator over the bundled strings, with optional overrides or extra
 * keys (your own season's words). A key found nowhere comes back as itself,
 * which is visible in review and never crashes.
 *
 * @param locale A locale tag (see `presetLocale`), or a whole dictionary of your own.
 * @param overrides Keys to add or replace, in that language.
 * @return The translator.
 */
export function createTranslator(locale: string | Readonly<Record<string, string>>, overrides: Readonly<Record<string, string>> = {}): Translate {
  const base: Readonly<Record<string, string>> = typeof locale === 'string' ? PRESET_STRINGS[presetLocale(locale)] : locale;
  const dictionary: Readonly<Record<string, string>> = { ...base, ...overrides };
  return (key, values) => interpolate(dictionary[key] ?? (en as Record<string, string>)[key] ?? key, values);
}
