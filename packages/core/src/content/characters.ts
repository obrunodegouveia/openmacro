/**
 * ============================================================================
 * Characters
 * ============================================================================
 *
 * The recurring people a challenge can be voiced by. A challenge names one in
 * its `speaker` field and both clients draw that character beside the prompt,
 * then again in the feedback sheet reacting to the answer.
 *
 * A character is data: an id, a display name and a one-line brief. Adding one
 * is an entry here plus one image per expression in each client:
 *
 *   app  `assets/characters/<id>-<expression>@{1,2,3}x.png`, listed in
 *        `src/components/ui/CharacterAvatar.tsx`
 *   web  `web/public/characters/<id>-<expression>.svg`, listed in
 *        `web/src/components/challenges/character-avatar.tsx`
 *
 * Both lists are typed as `Record<CharacterId, Record<CharacterExpression, …>>`,
 * so a character added here and drawn in only one client fails the other's
 * typecheck rather than rendering nothing on half the audience.
 *
 * Which expression shows when is decided once, in `engine/speaker.ts`.
 */

/** The faces every character must be drawn with. */
export const CHARACTER_EXPRESSIONS = ['happy', 'excited', 'thinking', 'oops'] as const;

export type CharacterExpression = (typeof CHARACTER_EXPRESSIONS)[number];

export interface CharacterDefinition {
  /**
   * Shown to nobody today — the avatar is decorative — but the name the
   * content already uses for them, kept here so a future label or caption has
   * one source. The same in every language the course ships in.
   */
  name: string;
  /** Who they are, for contributors writing them into a challenge. */
  brief: string;
}

export const CHARACTERS = {
  olivia: {
    name: 'Olivia',
    brief:
      'A 12-year-old singer-songwriter saving for her first gig. Owns a guitar, sells merch at the talent show.',
  },
  breno: {
    name: 'Breno',
    brief: 'Runs the music shop where Olivia buys her amp. Big friendly beard, keeps his own books.',
  },
} as const satisfies Record<string, CharacterDefinition>;

/** A character a challenge can name as its `speaker`. */
export type CharacterId = keyof typeof CHARACTERS;

/** Every registered character id, in registry order. */
export const CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];

/** True when `id` names a registered character. Used by `lint:content`. */
export function isCharacterId(id: unknown): id is CharacterId {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(CHARACTERS, id);
}
