/**
 * ============================================================================
 * Exam assembly and grading
 * ============================================================================
 *
 * A lesson is a teaching instrument: it re-queues what you got wrong, gives
 * you hearts, and will not let you leave until you can do it. An exam is the
 * opposite instrument. One attempt per item, no hearts, no second go, and a
 * paper drawn from the whole course rather than from the module you have just
 * revised.
 *
 * Three properties make a result worth anything to someone who was not in the
 * room when it was earned:
 *
 *   1. **Deterministic.** A paper is a pure function of its seed and the
 *      content registry. The same seed rebuilds the same paper, so an
 *      examiner can reconstruct exactly what was asked.
 *   2. **Representative.** Items are drawn round-robin across modules within
 *      each level, so a paper cannot be dominated by whichever module happens
 *      to have the most challenges. Passing means passing the course, not a
 *      corner of it.
 *   3. **Level-gated.** An overall percentage can hide a candidate who aced
 *      the beginner material and failed everything advanced. Each level
 *      carries its own threshold and all of them must be met.
 *
 * Pure, synchronous and dependency-free, like the rest of `engine/`. Grading
 * delegates to `gradeChallenge`, so exam items behave exactly as they do in a
 * lesson — there is no second implementation of correctness to drift.
 */

import { MODULE_LEVELS, type Challenge, type Module, type ModuleLevel } from '../content/schema';
import type { ChallengeAnswer } from './answers';
import { gradeChallenge } from './grading';
import { englishTranslator, type Translator } from '../i18n';

// ---------------------------------------------------------------------------
// Deterministic randomness
// ---------------------------------------------------------------------------

/**
 * FNV-1a over a string, as an unsigned 32-bit integer.
 *
 * Used both to turn a human-typed seed into PRNG state and to fingerprint a
 * finished paper. Not a cryptographic hash and not pretending to be one: it
 * makes tampering obvious to a casual check, not to a determined forger.
 */
export function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, and good enough to shuffle a question paper. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates against a supplied PRNG. Returns a new array. */
function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a === undefined || b === undefined) continue;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Blueprint
// ---------------------------------------------------------------------------

/**
 * Challenge types that require the candidate to *do* something rather than
 * recognise the right sentence — drive a simulation, post a double entry,
 * order a causal chain. A paper made entirely of multiple choice tests
 * recall; the point of this course is judgement.
 */
const APPLIED_TYPES: ReadonlySet<Challenge['type']> = new Set([
  'interactive_sim',
  't_account_flow',
  'order_flow',
]);

export interface ExamBlueprint {
  /** How many items the paper holds. */
  itemCount: number;
  /** Share of the paper drawn from each level. Normalised if it does not sum to 1. */
  levelWeights: Readonly<Record<ModuleLevel, number>>;
  /** Share of the whole paper that must be applied rather than recall. */
  minAppliedShare: number;
  /** Overall share correct needed to pass. */
  passMark: number;
  /** Share correct needed *within each level* — stops a strong start carrying a weak finish. */
  levelPassMark: number;
}

/**
 * The default paper: forty items, weighted to the advanced material, with
 * two fifths of it applied work.
 *
 * The weighting is a judgement about what the qualification claims. Anyone
 * can be walked through what a bank is; the bar this course sets is running
 * one of these institutions, and that lives in the advanced modules.
 */
export const DEFAULT_BLUEPRINT: ExamBlueprint = {
  itemCount: 40,
  levelWeights: { beginner: 0.15, intermediate: 0.25, advanced: 0.6 },
  minAppliedShare: 0.4,
  passMark: 0.8,
  levelPassMark: 0.7,
};

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

export interface ExamItem {
  /**
   * Stable key for this item, `lessonId#challengeId`.
   *
   * Challenge ids are only unique *within a lesson* — `validateModules`
   * enforces that and nothing more, which is right for a lesson session that
   * never looks beyond the lesson it is running. An exam draws from the whole
   * course, where ids genuinely repeat: `mc-haircut` exists in both
   * `kab-repos` and `open-market-operations`, and there are nine more like it.
   * Keying a paper by bare challenge id would silently collapse two different
   * questions into one — grading one answer twice and never asking the other.
   */
  id: string;
  moduleId: string;
  lessonId: string;
  challengeId: string;
  level: ModuleLevel;
  type: Challenge['type'];
}

export interface Exam {
  seed: string;
  blueprint: ExamBlueprint;
  items: readonly ExamItem[];
  /** Short code identifying this exact paper. See `examFingerprint`. */
  fingerprint: string;
}

interface Candidate extends ExamItem {
  challenge: Challenge;
}

function collect(modules: readonly Module[]): Candidate[] {
  const out: Candidate[] = [];
  for (const module of modules) {
    for (const lesson of module.lessons) {
      for (const challenge of lesson.challenges) {
        out.push({
          id: `${lesson.id}#${challenge.id}`,
          moduleId: module.id,
          lessonId: lesson.id,
          challengeId: challenge.id,
          level: module.level,
          type: challenge.type,
          challenge,
        });
      }
    }
  }
  return out;
}

/**
 * Draw `count` items from `pool`, cycling through modules so no single module
 * can dominate.
 *
 * Modules are visited in a shuffled order and one item is taken from each in
 * turn; only when every module has given one does the second lap begin. With
 * a pool of 25 modules and a quota of 24, that guarantees 24 different
 * modules rather than 24 questions about reserves.
 */
function drawSpread(pool: readonly Candidate[], count: number, rand: () => number): Candidate[] {
  const byModule = new Map<string, Candidate[]>();
  for (const item of pool) {
    const list = byModule.get(item.moduleId);
    if (list) list.push(item);
    else byModule.set(item.moduleId, [item]);
  }
  const queues = shuffle([...byModule.keys()], rand).map((id) => shuffle(byModule.get(id)!, rand));

  const picked: Candidate[] = [];
  let lap = 0;
  while (picked.length < count) {
    let tookAny = false;
    for (const queue of queues) {
      if (picked.length >= count) break;
      const item = queue[lap];
      if (item) {
        picked.push(item);
        tookAny = true;
      }
    }
    if (!tookAny) break; // pool exhausted — caller reports the shortfall
    lap += 1;
  }
  return picked;
}

/**
 * Raise the applied share to the blueprint's minimum by swapping recall items
 * out for applied ones drawn from the same level.
 *
 * Swapping within a level preserves the level quotas, which the pass rule
 * depends on. If a level simply has no more applied challenges to give, the
 * paper keeps what it has — `assembleExam` reports the shortfall rather than
 * silently claiming a balance it did not achieve.
 */
function topUpApplied(
  picked: Candidate[],
  pool: readonly Candidate[],
  target: number,
  rand: () => number,
): Candidate[] {
  const chosen = new Set(picked.map((item) => item.id));
  const spare = shuffle(
    pool.filter((item) => APPLIED_TYPES.has(item.type) && !chosen.has(item.id)),
    rand,
  );
  const out = [...picked];
  let applied = out.filter((item) => APPLIED_TYPES.has(item.type)).length;

  for (let i = 0; i < out.length && applied < target && spare.length > 0; i++) {
    const current = out[i];
    if (!current || APPLIED_TYPES.has(current.type)) continue;
    const swapIndex = spare.findIndex((item) => item.level === current.level);
    if (swapIndex === -1) continue;
    const replacement = spare.splice(swapIndex, 1)[0];
    if (!replacement) continue;
    out[i] = replacement;
    applied += 1;
  }
  return out;
}

export interface AssembledExam {
  exam: Exam;
  /**
   * Why the paper is not exactly what the blueprint asked for — a level with
   * too few challenges to fill its quota, or not enough applied items to hit
   * the minimum. Empty on a healthy registry; never thrown, because a short
   * paper the caller knows about beats a crash.
   */
  shortfalls: readonly string[];
}

export function assembleExam(
  modules: readonly Module[],
  seed: string,
  blueprint: ExamBlueprint = DEFAULT_BLUEPRINT,
): AssembledExam {
  const rand = mulberry32(hash32(seed));
  const pool = collect(modules);
  const shortfalls: string[] = [];

  const weightTotal = MODULE_LEVELS.reduce((sum, level) => sum + (blueprint.levelWeights[level] ?? 0), 0);
  if (weightTotal <= 0) {
    return {
      exam: { seed, blueprint, items: [], fingerprint: examFingerprint(seed, []) },
      shortfalls: ['Blueprint level weights sum to zero — no paper can be drawn.'],
    };
  }

  // Largest-remainder apportionment, so the quotas add up to itemCount exactly
  // rather than drifting by a question or two through rounding.
  const exact = new Map<ModuleLevel, number>(
    MODULE_LEVELS.map((level) => [
      level,
      ((blueprint.levelWeights[level] ?? 0) / weightTotal) * blueprint.itemCount,
    ]),
  );
  const quotas = new Map<ModuleLevel, number>(
    MODULE_LEVELS.map((level) => [level, Math.floor(exact.get(level) ?? 0)]),
  );
  let remaining =
    blueprint.itemCount - [...quotas.values()].reduce((sum, value) => sum + value, 0);
  const byRemainder = MODULE_LEVELS.map((level) => {
    const value = exact.get(level) ?? 0;
    return { level, fraction: value - Math.floor(value) };
  }).sort((a, b) => b.fraction - a.fraction);
  for (const entry of byRemainder) {
    if (remaining <= 0) break;
    quotas.set(entry.level, (quotas.get(entry.level) ?? 0) + 1);
    remaining -= 1;
  }

  let picked: Candidate[] = [];
  MODULE_LEVELS.forEach((level) => {
    const quota = quotas.get(level) ?? 0;
    if (quota <= 0) return;
    const levelPool = pool.filter((item) => item.level === level);
    const drawn = drawSpread(levelPool, quota, rand);
    if (drawn.length < quota) {
      shortfalls.push(`${level}: asked for ${quota} items, the registry has ${levelPool.length}`);
    }
    picked = picked.concat(drawn);
  });

  const appliedTarget = Math.ceil(blueprint.minAppliedShare * picked.length);
  picked = topUpApplied(picked, pool, appliedTarget, rand);
  const applied = picked.filter((item) => APPLIED_TYPES.has(item.type)).length;
  if (applied < appliedTarget) {
    shortfalls.push(`applied items: wanted ${appliedTarget}, got ${applied}`);
  }

  // Shuffle once more so the paper does not walk the course in level order and
  // hand the candidate a difficulty ramp.
  const items: ExamItem[] = shuffle(picked, rand).map(({ challenge: _challenge, ...item }) => item);

  return {
    exam: { seed, blueprint, items, fingerprint: examFingerprint(seed, items) },
    shortfalls,
  };
}

/** Short, human-quotable code for a paper: `OM-P-<hash>`. */
export function examFingerprint(seed: string, items: readonly ExamItem[]): string {
  const body = `${seed}|${items.map((item) => item.id).join(',')}`;
  return `OM-P-${hash32(body).toString(36).toUpperCase().padStart(7, '0')}`;
}

// ---------------------------------------------------------------------------
// Grading
// ---------------------------------------------------------------------------

export interface ExamItemResult extends ExamItem {
  answered: boolean;
  correct: boolean;
}

export interface LevelBreakdown {
  level: ModuleLevel;
  asked: number;
  correct: number;
  share: number;
  passed: boolean;
}

export interface ExamResult {
  fingerprint: string;
  asked: number;
  correct: number;
  share: number;
  /** Overall mark met *and* every level's own threshold met. */
  passed: boolean;
  byLevel: readonly LevelBreakdown[];
  /** Modules the candidate got nothing right in — what to send them back to. */
  weakModules: readonly string[];
  items: readonly ExamItemResult[];
  /** Verifiable code for this attempt. See `certificateCode`. */
  certificate: string | null;
}

/**
 * Grade a completed paper.
 *
 * `answers` is keyed by `ExamItem.id` — the lesson-qualified key, not the
 * bare challenge id, for the reason set out on that field. An unanswered item
 * is simply wrong:
 * there is no partial credit and no skipping, which is the difference between
 * an exam and a practice run.
 *
 * `lookup` resolves an item back to its challenge. The caller supplies it so
 * grading works against whichever locale's content the candidate actually
 * sat — the registry is not reached into from here.
 */
export function gradeExam(
  exam: Exam,
  answers: Readonly<Record<string, ChallengeAnswer | undefined>>,
  lookup: (item: ExamItem) => Challenge | undefined,
  translator: Translator = englishTranslator,
): ExamResult {
  const items: ExamItemResult[] = exam.items.map((item) => {
    const answer = answers[item.id];
    const challenge = lookup(item);
    if (!answer || !challenge) return { ...item, answered: false, correct: false };
    return { ...item, answered: true, correct: gradeChallenge(challenge, answer, translator).correct };
  });

  const correct = items.filter((item) => item.correct).length;
  const share = items.length > 0 ? correct / items.length : 0;

  const byLevel: LevelBreakdown[] = MODULE_LEVELS.map((level) => {
    const asked = items.filter((item) => item.level === level);
    const got = asked.filter((item) => item.correct).length;
    const levelShare = asked.length > 0 ? got / asked.length : 1;
    return {
      level,
      asked: asked.length,
      correct: got,
      share: levelShare,
      // A level nobody was asked about cannot be failed.
      passed: asked.length === 0 || levelShare >= exam.blueprint.levelPassMark,
    };
  });

  const moduleIds = [...new Set(items.map((item) => item.moduleId))];
  const weakModules = moduleIds.filter(
    (id) => !items.some((item) => item.moduleId === id && item.correct),
  );

  const passed =
    items.length > 0 && share >= exam.blueprint.passMark && byLevel.every((level) => level.passed);

  return {
    fingerprint: exam.fingerprint,
    asked: items.length,
    correct,
    share,
    passed,
    byLevel,
    weakModules,
    items,
    certificate: passed ? certificateCode(exam.fingerprint, correct, items.length) : null,
  };
}

/**
 * A code that encodes the paper, the mark and a check digit over both.
 *
 * Someone holding the code can be told which paper it refers to and what
 * score it claims, and the check value catches a changed digit. It is a
 * receipt, not a credential: anything load-bearing needs a signature from
 * whoever is standing behind the qualification.
 */
export function certificateCode(fingerprint: string, correct: number, asked: number): string {
  const body = `${fingerprint}|${correct}/${asked}`;
  return `${fingerprint.replace('OM-P-', 'OM-C-')}-${correct}${asked}-${hash32(body)
    .toString(36)
    .toUpperCase()
    .slice(0, 4)}`;
}

/** Re-derive a code from its parts — true when the claim is internally consistent. */
export function verifyCertificate(code: string, fingerprint: string, correct: number, asked: number): boolean {
  return code === certificateCode(fingerprint, correct, asked);
}
