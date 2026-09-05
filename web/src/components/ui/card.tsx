import * as React from "react";
import { cn } from "@/lib/utils";

/** Translucent glassmorphism panel — the base surface for every content block. */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("glass rounded-card shadow-2xl shadow-black/40", className)}
      {...props}
    />
  );
}
