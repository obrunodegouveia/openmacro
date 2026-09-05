import * as React from "react";
import { cn } from "@/lib/utils";

/** Page section with the site's shared vertical rhythm and max width. */
export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("relative px-5 py-20 sm:px-8 md:py-28", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Overline + headline + optional lede, centred or left-aligned. */
export function SectionHeading({
  overline,
  title,
  lede,
  align = "center",
  className,
}: {
  overline?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {overline ? (
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mint-bright">
          {overline}
        </p>
      ) : null}
      <h2 className="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {lede ? (
        <p className="text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
          {lede}
        </p>
      ) : null}
    </div>
  );
}
