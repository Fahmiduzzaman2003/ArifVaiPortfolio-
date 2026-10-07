import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--ink)] text-white hover:bg-[var(--teal-deep)]",
        secondary: "border border-[var(--line-strong)] bg-white/60 text-[var(--ink)] hover:border-[var(--teal)] hover:bg-white",
        ghost: "text-[var(--ink)] hover:bg-[var(--paper-deep)]",
        teal: "bg-[var(--teal)] text-white hover:bg-[var(--teal-deep)]",
      },
      size: { default: "h-11", sm: "h-9 px-4 text-xs", lg: "h-13 px-7" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
