/**
 * The timeline, defined once.
 *
 * Both the composition and the narration generator read this. They used to
 * carry their own copies of the same seven numbers, which is the setup for
 * audio that slides out of sync with the picture the moment either is edited
 * — the exact failure this repository keeps finding in other forms.
 *
 * Lengths are seconds and were set against measured narration, with headroom:
 * `say` timing varies a little between runs, so a line that exactly fills its
 * scene one day clips the next. Portuguese is the binding constraint
 * throughout — it runs about twenty per cent longer than the English.
 */
export const SCENES = [
  { id: 'hook', seconds: 7 },
  { id: 'race', seconds: 9 },
  { id: 'lever', seconds: 8 },
  { id: 'twist', seconds: 8 },
  { id: 'outcomes', seconds: 28 },
  { id: 'punch', seconds: 12 },
  { id: 'outro', seconds: 8 },
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

/** Seconds from the start of the film to the start of a scene. */
export function startOf(id: SceneId): number {
  let at = 0;
  for (const scene of SCENES) {
    if (scene.id === id) return at;
    at += scene.seconds;
  }
  return at;
}

export function lengthOf(id: SceneId): number {
  return SCENES.find((scene) => scene.id === id)?.seconds ?? 0;
}

export const TOTAL_SECONDS = SCENES.reduce((sum, scene) => sum + scene.seconds, 0);
