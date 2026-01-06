import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold font-body ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg hover:shadow-[0_0_20px_hsl(var(--neon-magenta)/0.5)]",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_10px_hsl(var(--neon-cyan)/0.3)] hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.6)] transition-all duration-300",
        neonMagenta: "bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 shadow-[0_0_10px_hsl(var(--neon-magenta)/0.3)] hover:shadow-[0_0_20px_hsl(var(--neon-magenta)/0.6)] transition-all duration-300",
        cyber: "bg-gradient-to-r from-neon-cyan to-neon-magenta text-background font-bold hover:opacity-90 shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4),0_0_15px_hsl(var(--neon-magenta)/0.4)]",
        glass: "bg-card/50 backdrop-blur-md border border-border/50 text-foreground hover:bg-card/70 hover:border-neon-cyan/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
