import type { ReactNode } from "react";
import { createBootScript, paletteCss } from "@openmacro/seasons/web/boot";
import { Seasons } from "./seasons-client";
import { CALENDAR, PACKS } from "./seasons";

/**
 * Before first paint, the inline script decides the season in the visitor's
 * own browser (their date, their choice, `?season=` for previews) and sets
 * `data-season` on <html>; the inline palette is keyed on it, so a static
 * page never flashes the wrong colours. Both are built once, on the server.
 */
const BOOT = createBootScript({ calendar: CALENDAR });

/** Every season's palette: the roles as `--sv-*`, and this app's two tokens. */
const PALETTE = paletteCss(PACKS, { map: (colors) => ({ "--page": colors.canvas, "--text": colors.ink }) });

/**
 * The root layout.
 *
 * @param props.children The page.
 * @return The document.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The boot script changes <html> before React hydrates it, on purpose.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <style dangerouslySetInnerHTML={{ __html: `:root{--page:#f7f9fb;--text:#1f2933}body{margin:0;background:var(--page);color:var(--text);font-family:system-ui}${PALETTE}` }} />
      </head>
      <body>
        <Seasons>{children}</Seasons>
      </body>
    </html>
  );
}
