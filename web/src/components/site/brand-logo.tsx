import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The mark and the outlined wordmark, with no tile behind them.
 *
 * A launcher draws a square around an app icon, so the icon is authored to
 * fill one. A web page draws nothing, and the same asset on a dark page reads
 * as a screenshot of an app icon rather than as the brand — so the site uses
 * the bare mark, in vector, sized by height rather than width.
 *
 * Sized by height, and a step smaller on a phone: without the tile the lockup
 * is wider for the same height, and the header bar is 56px there against 64
 * elsewhere.
 *
 * `unoptimized` because the source is an SVG: Next's optimiser refuses to
 * rasterise one unless `dangerouslyAllowSVG` is set, and there is nothing to
 * gain from rasterising 7 KB of paths that scale for free.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/openmacro-lockup-bare-dark.svg"
      alt="OpenMacro"
      width={5396}
      height={1000}
      unoptimized
      priority
      className={cn("h-8 w-auto shrink-0 sm:h-10", className)}
    />
  );
}
