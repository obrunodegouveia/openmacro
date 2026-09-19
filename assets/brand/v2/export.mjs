// Format conversion and platform exports from the two vector masters.
// Run from the repository root: node assets/brand/v2/export.mjs
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const directory = new URL('./', import.meta.url);
const file = (name) => new URL(name, directory);
const output = (name) => file(name).pathname;
const pine = '#183D35';
const celadon = '#E3EDE5';
const white = '#FFFFFF';
const night = '#14261F';
const master = await readFile(file('openmacro-mark.svg'), 'utf8');
const wordmark = await readFile(file('openmacro-wordmark.svg'), 'utf8');
const colored = (color) => Buffer.from(master.replace(/#183d35/gi, color));

for (const [name, ink, background] of [
  ['light', pine, celadon],
  ['dark', celadon, night],
  ['tinted', white, '#000000'],
]) {
  await sharp(colored(ink)).resize(1024, 1024).flatten({ background })
    .toColourspace('srgb').png().toFile(output(`openmacro-icon-${name}.png`));
}
await sharp(colored(pine)).resize(1024, 1024).png().toFile(output('openmacro-splash.png'));
await sharp(colored(pine)).resize(1024, 1024).trim().png().toFile(output('openmacro-mark.png'));
await sharp(colored(celadon)).resize(1024, 1024).png().toFile(output('openmacro-splash-dark.png'));
await sharp(output('openmacro-icon-light.png')).resize(64, 64).png().toFile(output('openmacro-favicon.png'));

for (const [name, ink] of [['foreground', pine], ['monochrome', white]]) {
  await sharp(colored(ink)).resize(820, 820)
    .extend({ top: 102, bottom: 102, left: 102, right: 102, background: '#00000000' })
    .png().toFile(output(`openmacro-android-${name}.png`));
}

// Paths are outlined: the exported wordmark needs no installed typeface.
// The tighter symbol viewport removes app-icon padding in horizontal lockups.
const symbolContent = master.match(/<g[\s\S]*<\/g>/)[0];
const wordContent = wordmark.match(/<path[\s\S]*\/>/)[0];
const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 642 104" role="img" aria-label="OpenMacro">
<svg x="0" y="1" width="98" height="102" viewBox="212 200 831 852">${symbolContent}</svg>
<svg x="134" y="21" width="495" height="75" viewBox="0 0 494.599 74.756">${wordContent}</svg>
</svg>`;
await writeFile(file('openmacro-lockup.svg'), lockup);
await sharp(Buffer.from(lockup)).resize(1284, 208).png().toFile(output('openmacro-lockup.png'));
console.log('Exported light, dark, tinted, splash, adaptive, favicon, and outlined wordmark assets.');
