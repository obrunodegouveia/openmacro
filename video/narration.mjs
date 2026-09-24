/**
 * Narration, generated with the system speech synthesiser.
 *
 * One clip per scene rather than one long take, so each line is pinned to the
 * cut it belongs to. A single file would drift against the visuals the moment
 * any scene length changed.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { SCENES, lengthOf, startOf } from './src/scenes.ts';

export const VOICES = { en: 'Samantha', 'pt-PT': 'Joana' };

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
    const aiff = `audio/${locale}/${i}.aiff`;
    const m4a = `audio/${locale}/${i}.m4a`;
    execFileSync('say', ['-v', VOICES[locale], '-r', String(RATE[locale]), '-o', aiff, line]);
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', aiff, m4a]);
    const secs = Number(
      execFileSync('sh', ['-c', `afinfo "${aiff}" | awk -F': ' '/estimated duration/{print $2}' | awk '{print $1}'`])
        .toString().trim(),
    );
    // Half a second of headroom: `say` is not perfectly repeatable, and a
    // line that exactly fills its scene one run will clip the next.
    out.push({ scene: scene.id, start, length, secs, over: secs > length - 0.5 });
  });
  return out;
}
