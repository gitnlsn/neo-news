import { cn } from "~/lib/utils"; // Certifique-se de importar a função cn

// Code for typography components

type Props = {
  children: React.ReactNode;
  className?: string; // Allow className to be passed
};

const TypographyH1 = ({ children, className }: Props) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
};

const TypographyH2 = ({ children, className }: Props) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
};

const TypographyH3 = ({ children, className }: Props) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
};

const TypographyH4 = ({ children, className }: Props) => {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
};

const TypographyP = ({ children, className }: Props) => {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
};

const TypographyBlockquote = ({ children, className }: Props) => {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
};

const TypographyInlineCode = ({ children, className }: Props) => {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
    >
      {children}
    </code>
  );
};

const TypographyLead = ({ children, className }: Props) => {
  return (
    <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
  );
};

const TypographyLarge = ({ children, className }: Props) => {
  return (
    <div className={cn("text-lg font-semibold", className)}>{children}</div>
  );
};

const TypographySmall = ({ children, className }: Props) => {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </small>
  );
};

const TypographyMuted = ({ children, className }: Props) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

const TypographyList = ({ children, className }: Props) => {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
    </ul>
  );
};

export const Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  P: TypographyP,
  Blockquote: TypographyBlockquote,
  InlineCode: TypographyInlineCode,
  Lead: TypographyLead,
  Large: TypographyLarge,
  Small: TypographySmall,
  Muted: TypographyMuted,
  List: TypographyList,
};
