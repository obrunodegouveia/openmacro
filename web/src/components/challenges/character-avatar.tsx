"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  CHARACTER_EXPRESSIONS,
  type CharacterExpression,
  type CharacterId,
} from "@openmacro/core/content/characters";
import type { Lesson } from "@openmacro/core/content/schema";
import { cn } from "@/lib/utils";

/**
 * A challenge's speaker — Olivia, Breno — as a small flat portrait.
 *
 * The app draws the same faces from PNGs (src/components/ui/CharacterAvatar.tsx).
 * Which face shows when is decided in `@openmacro/core/engine/speaker`; this
 * only turns the (character, expression) pair into an image.
 *
 * Decorative: `alt=""`, because the prompt and the feedback sheet already say
 * everything the picture does.
 */

/**
 * Every face, by character and expression.
 *
 * Typed against the registry in core, so a character added there without art
 * here fails the typecheck instead of rendering a broken image.
 */
const FACES: Record<CharacterId, Record<CharacterExpression, string>> = {
  olivia: faces("olivia"),
  breno: faces("breno"),
};

function faces(id: CharacterId): Record<CharacterExpression, string> {
  return Object.fromEntries(
    CHARACTER_EXPRESSIONS.map((expression) => [expression, `/characters/${id}-${expression}.svg`]),
  ) as Record<CharacterExpression, string>;
}

/**
 * Fetch and decode every face a lesson can show before its first answer, so
 * the reaction in the feedback sheet appears with the sheet rather than a
 * moment after it. Eight small SVGs at most; a failure only means the image
 * loads on demand instead.
 */
export function usePreloadSpeakers(lesson: Pick<Lesson, "challenges">): void {
  React.useEffect(() => {
    const ids = new Set<CharacterId>();
    for (const challenge of lesson.challenges) if (challenge.speaker) ids.add(challenge.speaker);
    for (const id of ids) {
      for (const src of Object.values(FACES[id])) {
        const image = new Image();
        image.src = src;
        void image.decode?.().catch(() => {});
      }
    }
  }, [lesson]);
}

export function CharacterAvatar({
  character,
  expression,
  size = 64,
  pop = false,
  className,
}: {
  character: CharacterId;
  expression: CharacterExpression;
  /** Edge length in CSS pixels. The art is square, and the box is reserved. */
  size?: number;
  /**
   * Spring in on mount — the feedback sheet's reaction. `MotionPreferences`
   * turns the scale off for anyone who prefers reduced motion.
   */
  pop?: boolean;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none block shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      initial={pop ? { scale: 0.55 } : false}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 14, mass: 0.7 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          A static, already-tiny SVG: next/image would serve it unoptimised
          anyway, and its lazy loading would defeat the preload above. */}
      <img
        src={FACES[character][expression]}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className="block size-full"
      />
    </motion.span>
  );
}
