import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const variants = cva("h-4 w-4 animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-20 w-20",
      full: "h-full w-full",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface LoadingProps extends VariantProps<typeof variants> {
  className?: string;
}

export function Loading({ className, size = "sm" }: LoadingProps) {
  return <Loader2 className={cn(variants({ size }), className)} />;
}
