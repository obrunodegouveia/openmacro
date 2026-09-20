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

/**
 * Preserve the outlined wordmark beside the production icon in each lockup.
 *
 * The symbol is the shipping icon with the launcher's own corner radius
 * applied, not one of the `native-icon-*.png` previews. Those previews come
 * out of Icon Composer, which has no command line, so a lockup built from
 * them could only be refreshed by hand — and it silently kept the old, looser
 * framing when the mark was retightened. The production PNGs are reproducible
 * from the material masters, so the lockup now moves whenever they do.
 */
const CORNER = 276 / 1254; // the radius Apple's mask uses, as a fraction
for (const [appearance, icon, ink] of [
  ['light', 'openmacro-icon-light.png', '#183d35'],
  ['dark', 'openmacro-icon-dark.png', '#e3ede5'],
]) {
  const radius = Math.round(208 * CORNER);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="208" height="208">` +
      `<rect width="208" height="208" rx="${radius}" fill="#fff"/></svg>`,
  );
  const symbol = await sharp(path.join(brand, icon))
    .resize(208, 208)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
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

/**
 * The website's lockup: the mark itself, with no tile behind it.
 *
 * The app needs a square because a launcher draws one; a web page does not,
 * and on a dark page the tile reads as a screenshot of an app icon rather
 * than as the brand. So the site gets the bare mark, in vector, at whatever
 * size the layout asks for.
 *
 * Dark pages take the sage layers rather than a recolour of the pine ones —
 * the jade gradients are authored per appearance, and lightening them in CSS
 * would flatten exactly the depth that makes the interlock readable.
 */
const MARK = { x: 139, y: 124, w: 978, h: 1004 }; // the art's own bounds in the 1254 grid
const WORD = { w: 494.599, h: 74.756 };
const TYPE = 0.62; // wordmark height, as a fraction of the mark's
const GAP = 0.32;  // space between them, likewise

async function bareLockup(appearance, ink) {
  const art = (await Promise.all(['lower', 'upper'].map(async (name) => {
    const file = appearance === 'dark' ? `om-${name}-dark.svg` : `om-${name}.svg`;
    const svg = await readFile(path.join(brand, `native-layers/${file}`), 'utf8');
    return svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replaceAll('jade', `jade-${name}`);
  }))).join('');
  const H = 1000;
  const scale = H / MARK.h;
  const markW = MARK.w * scale;
  const typeH = H * TYPE;
  const typeW = (WORD.w / WORD.h) * typeH;
  const width = markW + H * GAP + typeW;
  const type = wordmark
    .replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/#183D35/gi, ink);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width.toFixed(1)} ${H}" width="${Math.round(width)}" height="${H}" role="img" aria-label="OpenMacro">`
    + `<g transform="translate(${(-MARK.x * scale).toFixed(2)},${(-MARK.y * scale).toFixed(2)}) scale(${scale.toFixed(5)})">${art}</g>`
    + `<g transform="translate(${(markW + H * GAP).toFixed(1)},${((H - typeH) / 2).toFixed(1)}) scale(${(typeH / WORD.h).toFixed(5)})">${type}</g>`
    + `</svg>\n`;
}

for (const [appearance, ink] of [['light', '#183d35'], ['dark', '#e3ede5']]) {
  const svg = await bareLockup(appearance, ink);
  await writeFile(path.join(web, `openmacro-lockup-bare-${appearance}.svg`), svg);
  // Satori cannot lay out an SVG, so the social card gets a raster of the same file.
  await sharp(Buffer.from(svg)).resize({ height: 240 }).png()
    .toFile(path.join(web, `openmacro-lockup-bare-${appearance}.png`));
}

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

console.log('Updated OM lockups (framed and bare), web install icons, vector favicon, and Expo fallback assets.');
