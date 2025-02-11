import type { ButtonHTMLAttributes } from "react";
import React from "react";
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
      className="rounded-none p-1 text-[10px] h-fit"
      size="sm"
      type="button"
      variant={isActive ? "default" : "outline"}
    />
  );
});
