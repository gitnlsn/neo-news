import React from "react";
import { cn } from "~/lib/utils";
import { Button, type ButtonProps } from "../ui/button";

interface RichTextButtonProps extends ButtonProps {
  isActive?: boolean;
}

export const RichTextButton = React.forwardRef<
  HTMLButtonElement,
  RichTextButtonProps
>(({ isActive, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      {...props}
      className={cn("rounded-none p-1 text-[10px] h-fit", props.className)}
      size="sm"
      type="button"
      variant={isActive ? "default" : "outline"}
    />
  );
});
