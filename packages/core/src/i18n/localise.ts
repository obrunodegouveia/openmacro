import type { Challenge, Lesson, Module } from '../content/schema';

/**
 * ============================================================================
 * Translating content without duplicating it
 * ============================================================================
 *
 * A module is written once, in English, and a translation is an overlay: a flat
 * map of key to string that replaces individual fields. Anything the overlay
 * does not mention stays in English.
 *
 * The alternative — a copy of every lesson file per language — was rejected
 * before it was tried. With 17 modules and 4,400 translatable strings it would
 * mean a second, third and fourth copy of the whole content tree, each free to
 * drift structurally from the original. A lesson would gain a challenge in
 * English and quietly not have it in Portuguese, and nothing would notice.
 *
 * An overlay cannot drift structurally, because it has no structure. It can
 * only be incomplete, and `npm run i18n:status` measures exactly how
 * incomplete.
 *
 * ---------------------------------------------------------------------------
 * KEYS
 * ---------------------------------------------------------------------------
 *
 *   module.title
 *   module.description
 *   <lessonId>.title
 *   <lessonId>.subtitle
 *   <lessonId>.takeaway.0
 *   <lessonId>.<challengeId>.prompt
 *   <lessonId>.<challengeId>.instructions
 *   <lessonId>.<challengeId>.explanation
 *   <lessonId>.<challengeId>.option.<optionId>.label
 *   <lessonId>.<challengeId>.option.<optionId>.feedback
 *   <lessonId>.<challengeId>.pair.<pairId>.term
 *   <lessonId>.<challengeId>.pair.<pairId>.definition
 *   <lessonId>.<challengeId>.event.<eventId>.label
 *   <lessonId>.<challengeId>.event.<eventId>.detail
 *
 * Ids, not indices. A translation keyed on position silently attaches itself
 * to the wrong option the moment somebody reorders them, and the result is a
 * plausible sentence under the wrong answer — the worst possible failure for
 * teaching material, because nothing looks broken.
 */

export type ContentDictionary = Readonly<Record<string, string>>;

/** Every translatable string in a module, as key → English source. */
export function collectKeys(module: Module): Record<string, string> {
  const out: Record<string, string> = {};
  const put = (key: string, value: string | undefined) => {
    if (typeof value === 'string' && value.trim()) out[key] = value;
  };

  put('module.title', module.title);
  put('module.description', module.description);

  for (const lesson of module.lessons) {
    put(`${lesson.id}.title`, lesson.title);
    put(`${lesson.id}.subtitle`, lesson.subtitle);
    lesson.keyTakeaways?.forEach((takeaway, index) =>
      put(`${lesson.id}.takeaway.${index}`, takeaway),
    );

    for (const challenge of lesson.challenges) {
      const base = `${lesson.id}.${challenge.id}`;
      put(`${base}.prompt`, challenge.prompt);
      put(`${base}.instructions`, challenge.instructions);
      put(`${base}.explanation`, challenge.explanation);

      if (challenge.type === 'multiple_choice') {
        for (const option of challenge.options) {
          put(`${base}.option.${option.id}.label`, option.label);
          put(`${base}.option.${option.id}.feedback`, option.feedback);
        }
      }
      if (challenge.type === 'concept_match') {
        for (const pair of challenge.pairs) {
          put(`${base}.pair.${pair.id}.term`, pair.term);
          put(`${base}.pair.${pair.id}.definition`, pair.definition);
        }
      }
      if (challenge.type === 'order_flow') {
        for (const event of challenge.events) {
          put(`${base}.event.${event.id}.label`, event.label);
          put(`${base}.event.${event.id}.detail`, event.detail);
        }
      }
    }
  }

  return out;
}

/**
 * Apply a translation overlay to a module.
 *
 * Returns a new object; the English module is never mutated, because both
 * apps hold the registry in memory for the life of the process and a mutation
 * would translate the source for everyone.
 *
 * Deliberately does not translate: lesson ids, challenge ids, option ids,
 * formula ids, icons, tags, or anything numeric. Those are structure, and a
 * translated id would break grading, progress and the content validator at
 * once.
 */
export function localiseModule(module: Module, dictionary: ContentDictionary): Module {
  if (Object.keys(dictionary).length === 0) return module;
  const pick = (key: string, fallback: string) => dictionary[key] ?? fallback;
  const maybe = (key: string, fallback: string | undefined) =>
    dictionary[key] ?? fallback;

  return {
    ...module,
    title: pick('module.title', module.title),
    description: pick('module.description', module.description),
    lessons: module.lessons.map((lesson) => localiseLesson(lesson, dictionary, pick, maybe)),
  };
}

function localiseLesson(
  lesson: Lesson,
  dictionary: ContentDictionary,
  pick: (key: string, fallback: string) => string,
  maybe: (key: string, fallback: string | undefined) => string | undefined,
): Lesson {
  return {
    ...lesson,
    title: pick(`${lesson.id}.title`, lesson.title),
    subtitle: pick(`${lesson.id}.subtitle`, lesson.subtitle),
    keyTakeaways: lesson.keyTakeaways?.map((takeaway, index) =>
      pick(`${lesson.id}.takeaway.${index}`, takeaway),
    ),
    challenges: lesson.challenges.map((challenge) =>
      localiseChallenge(lesson.id, challenge, pick, maybe),
    ),
  };
}

function localiseChallenge(
  lessonId: string,
  challenge: Challenge,
  pick: (key: string, fallback: string) => string,
  maybe: (key: string, fallback: string | undefined) => string | undefined,
): Challenge {
  const base = `${lessonId}.${challenge.id}`;
  const common = {
    prompt: pick(`${base}.prompt`, challenge.prompt),
    instructions: maybe(`${base}.instructions`, challenge.instructions),
    explanation: pick(`${base}.explanation`, challenge.explanation),
  };

  switch (challenge.type) {
    case 'multiple_choice':
      return {
        ...challenge,
        ...common,
        options: challenge.options.map((option) => ({
          ...option,
          label: pick(`${base}.option.${option.id}.label`, option.label),
          feedback: maybe(`${base}.option.${option.id}.feedback`, option.feedback),
        })),
      };
    case 'concept_match':
      return {
        ...challenge,
        ...common,
        pairs: challenge.pairs.map((pair) => ({
          ...pair,
          term: pick(`${base}.pair.${pair.id}.term`, pair.term),
          definition: pick(`${base}.pair.${pair.id}.definition`, pair.definition),
        })),
      };
    case 'order_flow':
      return {
        ...challenge,
        ...common,
        events: challenge.events.map((event) => ({
          ...event,
          label: pick(`${base}.event.${event.id}.label`, event.label),
          detail: maybe(`${base}.event.${event.id}.detail`, event.detail),
        })),
      };
    default:
      // interactive_sim and t_account_flow carry their own nested shapes; the
      // common fields above are translated and the rest stays English until
      // there is a reason to key into them.
      return { ...challenge, ...common };
  }
}

/** How much of a module a dictionary covers, 0 to 1. */
export function coverage(module: Module, dictionary: ContentDictionary): number {
  const keys = Object.keys(collectKeys(module));
  if (keys.length === 0) return 1;
  const done = keys.filter((key) => typeof dictionary[key] === 'string' && dictionary[key].trim());
  return done.length / keys.length;
}
