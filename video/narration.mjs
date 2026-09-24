/**
 * Narration, generated locally with Piper.
 *
 * Piper rather than the macOS `say` this started with. `say` has exactly one
 * European Portuguese voice and it is the 2010-era formant synthesiser; every
 * other Portuguese voice the system offers is Brazilian, which is the wrong
 * accent for this course whatever its quality. Piper is a neural model, runs
 * offline, needs no account, and is MIT-licensed like the rest of this
 * repository.
 *
 * One clip per scene rather than one long take, so each line is pinned to the
 * cut it belongs to. A single file would drift against the visuals the moment
 * any scene length changed.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { SCENES, lengthOf, startOf } from './src/scenes.ts';

/** Models fetched by `fetch-voices.mjs`. */
export const VOICES = {
  en: 'en_GB-cori-high.onnx',
  'pt-PT': 'pt_PT-tugão-medium.onnx',
};

/**
 * Speaking pace. Above 1 is slower.
 *
 * Piper runs faster than `say` did — the same Portuguese line took 5.8s
 * against 8.1s — and an explainer wants a measured delivery rather than a
 * brisk one.
 *
 * Portuguese is slowed considerably more, and not for any reason to do with
 * the language. `tugão` simply reads quicker than `cori`, so at a common pace
 * the Portuguese cut finished each scene ten seconds early and sat in silence
 * while the bars were still filling. These numbers were set by measuring both
 * against the same scenes until they filled them to about the same degree.
 */
export const LENGTH_SCALE = { en: 1.08, 'pt-PT': 1.36 };

const PIPER = '/tmp/piper-venv/bin/piper';

/** One line per scene, in `SCENES` order. Timing comes from `src/scenes.ts`. */
export const LINES = {
  en: [
    ['America owes about thirty trillion dollars. Why is that not a crisis?'],
    ['Because a debt ratio is a race between two numbers. What the debt costs, against how fast the economy grows.'],
    ['Productivity is the one lever that helps twice. It raises growth, and it lowers the cost of making things.'],
    ['But a productivity gain has to land somewhere. Either firms produce more, or they charge less.'],
    ['Take it as output, with inflation held at target. Nominal growth reaches six point six percent, and the debt ratio falls by two and a half points a year. Now take the very same gain as lower prices. Inflation drops to zero, growth falls back to four and a half, and the ratio improves by only half a point. Almost all of the benefit is gone.'],
    ['You cannot spend it twice. The debt is paid out of nominal growth, and only one of these delivers it.'],
    ['Open Macro dot org. Free, open source, no account needed.'],
  ],
  'pt-PT': [
    ['A América deve cerca de trinta biliões de dólares. Porque é que isso não é uma crise?'],
    ['Porque um rácio de dívida é uma corrida entre dois números. Quanto custa a dívida, contra a rapidez a que a economia cresce.'],
    ['A produtividade é a única alavanca que ajuda duas vezes. Aumenta o crescimento e baixa o custo de produzir.'],
    ['Mas um ganho de produtividade tem de aterrar algures. Ou as empresas produzem mais, ou cobram menos.'],
    ['Leva-o como produção, com a inflação mantida no objetivo. O crescimento nominal chega a seis vírgula seis por cento, e o rácio da dívida cai dois pontos e meio por ano. Agora leva o mesmo ganho como preços mais baixos. A inflação cai para zero, o crescimento volta aos quatro e meio, e o rácio melhora apenas meio ponto. Quase todo o benefício desapareceu.'],
    ['Não o podes gastar duas vezes. A dívida é paga com crescimento nominal, e só um destes o entrega.'],
    ['Open Macro ponto org. Gratuito, código aberto, sem conta.'],
  ],
};

/** Words per minute. Tuned below against the measured durations. */
export const RATE = { en: 178, 'pt-PT': 178 };

export function generate(locale) {
  mkdirSync(`audio/${locale}`, { recursive: true });
  const out = [];
  LINES[locale].forEach(([line], i) => {
    const scene = SCENES[i];
    const start = startOf(scene.id);
    const length = lengthOf(scene.id);
    const wav = `audio/${locale}/${i}.wav`;
    const m4a = `audio/${locale}/${i}.m4a`;

    execFileSync(
      PIPER,
      ['-m', `voices/${VOICES[locale]}`, '-f', wav, '--length_scale', String(LENGTH_SCALE[locale])],
      { input: line },
    );
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', wav, m4a]);

    const secs = Number(
      execFileSync('sh', [
        '-c',
        `afinfo "${wav}" | awk -F': ' '/estimated duration/{print $2}' | awk '{print $1}'`,
      ])
        .toString()
        .trim(),
    );
    // Half a second of headroom, so a line that exactly fills its scene on
    // one run does not clip on the next.
    out.push({ scene: scene.id, start, length, secs, over: secs > length - 0.5 });
  });
  return out;
}
