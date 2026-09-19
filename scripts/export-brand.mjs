/** Export the approved OM identity to every app and website asset location. */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const brand = path.join(root, 'assets/brand/v3');
const web = path.join(root, 'web/public/brand');
await mkdir(web, { recursive: true });
const wordmark = await readFile(path.join(root, 'assets/brand/v2/openmacro-wordmark.svg'), 'utf8');

// Preserve the outlined wordmark and Apple's actual icon render in each lockup.
for (const [appearance, icon, ink] of [
  ['light', 'native-icon-default.png', '#183d35'],
  ['dark', 'native-icon-Dark.png', '#e3ede5'],
]) {
  const symbol = await sharp(path.join(brand, icon)).resize(208, 208).toBuffer();
  const type = await sharp(Buffer.from(wordmark.replace(/#183d35/gi, ink)))
    .resize(990, 150).png().toBuffer();
  const name = `openmacro-lockup-${appearance}.png`;
  await sharp({ create: { width: 1284, height: 208, channels: 4, background: '#00000000' } })
    .composite([{ input: symbol, left: 0, top: 0 }, { input: type, left: 268, top: 42 }])
    .png().toFile(path.join(brand, name));
  await copyFile(path.join(brand, name), path.join(web, name));
}

// Full-bleed, opaque install assets. Platforms supply the launcher mask.
for (const size of [192, 512]) {
  await sharp(path.join(brand, 'openmacro-icon-light.png')).resize(size, size)
    .png().toFile(path.join(web, `icon-${size}.png`));
}
await sharp(path.join(brand, 'openmacro-icon-light.png')).resize(180, 180)
  .png().toFile(path.join(root, 'web/src/app/apple-icon.png'));
await copyFile(path.join(brand, 'openmacro-favicon.png'), path.join(web, 'favicon-64.png'));

// A precise vector favicon keeps the interlock readable at browser-tab sizes.
const layers = await Promise.all(['lower', 'upper'].map(async (name) => {
  const svg = await readFile(path.join(brand, `native-layers/om-${name}.svg`), 'utf8');
  return svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replaceAll('jade', `jade-${name}`);
}));
await writeFile(path.join(root, 'web/src/app/icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><rect width="1254" height="1254" rx="276" fill="#e3ede5"/>${layers.join('')}</svg>\n`);

// Keep legacy Expo filenames current for tooling that uses their default paths.
for (const [source, target] of [
  ['openmacro-icon-light.png', 'icon.png'],
  ['openmacro-favicon.png', 'favicon.png'],
  ['openmacro-splash.png', 'splash-icon.png'],
  ['openmacro-android-foreground.png', 'android-icon-foreground.png'],
  ['openmacro-android-monochrome.png', 'android-icon-monochrome.png'],
]) await copyFile(path.join(brand, source), path.join(root, 'assets', target));
await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#e3ede5' } })
  .png().toFile(path.join(root, 'assets/android-icon-background.png'));

console.log('Updated OM lockups, web install icons, vector favicon, and Expo fallback assets.');
