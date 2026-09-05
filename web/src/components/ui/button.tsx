import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The chunky, pressable button from the app, ported to the web.
 *
 * The Duolingo feel comes from the solid bottom edge (`border-b-4`): pressing
 * translates the button down by exactly that edge, so it visually sinks onto
 * its own shadow instead of just changing colour.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-extrabold tracking-tight transition-all duration-100 active:translate-y-[3px] active:border-b-0 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
  {
    variants: {
      variant: {
        primary:
          "border-b-4 border-mint-deep bg-mint text-abyss hover:bg-mint-bright",
        gold: "border-b-4 border-gold-deep bg-gold text-abyss hover:brightness-110",
        outline:
          "border border-hairline bg-white/5 text-ink backdrop-blur hover:border-mint/60 hover:bg-white/10 active:translate-y-0",
        ghost: "text-ink-muted hover:bg-white/5 hover:text-ink active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>` (e.g. an `<a>`). */
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
