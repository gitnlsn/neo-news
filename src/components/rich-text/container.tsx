import { cn } from "~/lib/utils";

export const RichTextContainer = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={cn("flex flex-row gap-0 items-center w-fit", className)}
      style={style}
    >
      {children}
    </div>
  );
};
