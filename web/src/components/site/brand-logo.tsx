import { cn } from "@/lib/utils";

/**
 * The mark and the outlined wordmark, with no tile behind them.
 *
 * A launcher draws a square around an app icon, so the icon is authored to
 * fill one. A web page draws nothing, and the same asset on a dark page reads
 * as a screenshot of an app icon rather than as the brand — so the site uses
 * the bare mark, in vector, sized by height rather than width.
 *
 * Two lockups, chosen by the system appearance: the pale wordmark for the dark
 * theme and the deep green one for the light theme. A <picture> lets the
 * browser pick before first paint; next/image has no equivalent, and an SVG
 * gains nothing from its optimiser anyway.
 *
 * Sized by height, and a step smaller on a phone: without the tile the lockup
 * is wider for the same height, and the header bar is 56px there against 64
 * elsewhere.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <picture>
      <source
        srcSet="/brand/openmacro-lockup-bare-light.svg"
        media="(prefers-color-scheme: light)"
      />
      <img
        src="/brand/openmacro-lockup-bare-dark.svg"
        alt="OpenMacro"
        width={5396}
        height={1000}
        fetchPriority="high"
        className={cn("h-8 w-auto shrink-0 sm:h-10", className)}
      />
    </picture>
  );
}
