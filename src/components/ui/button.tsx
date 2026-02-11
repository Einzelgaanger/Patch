import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:shadow-elegant hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /* Premium CTAs */
        hero:
          "bg-[linear-gradient(135deg,hsl(var(--gold))_0%,hsl(var(--gold-light))_50%,hsl(var(--gold))_100%)] text-[hsl(var(--gold-foreground))] font-semibold shadow-glow-gold hover:shadow-glow-gold hover:-translate-y-0.5 active:translate-y-0 rounded-xl",
        heroOutline:
          "border-2 border-[hsl(var(--gold))] text-[hsl(var(--gold))] bg-transparent hover:bg-[hsl(var(--gold))/0.08] font-semibold rounded-xl",
        navy: "bg-navy text-cream font-semibold hover:bg-navy-light shadow-soft",
        gold: "bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] font-semibold hover:bg-[hsl(var(--gold-light))] shadow-glow-gold",
        goldOutline:
          "border-2 border-[hsl(var(--gold))] text-[hsl(var(--gold))] bg-transparent hover:bg-[hsl(var(--gold))/0.06] font-medium",
        glass:
          "bg-white/10 border border-white/30 text-white backdrop-blur-sm hover:bg-white/20 shadow-soft",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
