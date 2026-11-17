import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "outline" | "quiet";
type ButtonSize = "md" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-mono uppercase tracking-[0.16em] transition-all duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "btn-sheen rounded-full bg-lime text-[#080808] shadow-[0_12px_40px_-18px_rgba(198,255,77,0.75)] hover:bg-[#d9ff80] hover:-translate-y-0.5 active:-translate-y-0",
  outline:
    "rounded-full border border-line text-ink hover:border-accent/60 hover:text-accent hover:bg-lime-soft",
  quiet:
    "text-muted hover:text-ink px-0",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-12",
  sm: "h-10",
};

function Content({
  variant,
  size,
  icon,
  iconSide,
  children,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  icon?: React.ReactNode;
  iconSide: "left" | "right";
  children: React.ReactNode;
}) {
  if (variant === "primary") {
    return (
      <>
        <span>{children}</span>
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full bg-[#080808] text-lime transition-transform duration-500 ease-out group-hover:rotate-45",
            size === "sm" ? "size-7" : "size-9",
          )}
        >
          {icon ?? <ArrowUpRight size={size === "sm" ? 13 : 15} strokeWidth={1.7} />}
        </span>
      </>
    );
  }

  return (
    <>
      {iconSide === "left" && icon ? (
        <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {iconSide === "right" && icon ? (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );
}

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
}

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    size === "sm" ? "text-[10px]" : "text-[10.5px]",
    variant === "primary" ? (size === "sm" ? "pl-4 pr-1.5" : "pl-6 pr-1.5") : "",
    variant === "outline" ? (size === "sm" ? "px-4" : "px-6") : "",
    variant === "quiet" ? (size === "sm" ? "text-[10px]" : "text-[10.5px]") : "",
    className,
  );
}

interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    StyleProps {
  children: React.ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  iconSide = "right",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props}>
      <Content
        variant={variant}
        size={size}
        icon={icon}
        iconSide={iconSide}
      >
        {children}
      </Content>
    </a>
  );
}

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    StyleProps {
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconSide = "right",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      <Content
        variant={variant}
        size={size}
        icon={icon}
        iconSide={iconSide}
      >
        {children}
      </Content>
    </button>
  );
}
