import { useCallback } from "react";
import { scrollToSection } from "../../lib/utils";

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export function Logo({ onClick, className }: LogoProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (onClick) onClick();
      else scrollToSection("home");
    },
    [onClick],
  );

  return (
    <a
      href="#home"
      onClick={handleClick}
      aria-label="Aagash Harikaran — back to top"
      className={`group inline-flex items-center gap-3 ${className ?? ""}`}
    >
      <span className="relative grid size-9 place-items-center overflow-hidden border border-line bg-elevated transition-colors duration-300 group-hover:border-accent/50">
        <span className="font-display text-[12px] font-bold tracking-[-0.08em] text-ink">
          AH
        </span>
        <span className="absolute bottom-0 right-0 size-2 bg-lime" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-muted">
          Beyond the interface
        </span>
        <span className="mt-1 font-display text-[12px] font-semibold uppercase tracking-[0.04em] text-ink">
          Aagash Harikaran
        </span>
      </span>
    </a>
  );
}
