"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/**
 * Accessible slider built on Radix.
 *
 * Radix gives us the keyboard model for free (arrows step, Home/End jump to
 * the bounds), which matters here: the reserve-ratio slider is the single most
 * important control on the page and must not be mouse-only.
 */
export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full border border-hairline bg-abyss">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-mint-deep via-mint to-mint-bright" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block size-7 cursor-grab rounded-full border-4 border-mint-bright bg-surface-raised shadow-lg shadow-mint/30 transition-transform hover:scale-110 active:scale-95 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
        aria-label={props["aria-label"]}
      />
    </SliderPrimitive.Root>
  );
}
