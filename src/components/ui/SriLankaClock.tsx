import { useSriLankaTime } from "../../hooks/useSriLankaTime";
import { cn } from "../../lib/utils";

interface SriLankaClockProps {
  className?: string;
  showDate?: boolean;
}

export function SriLankaClock({ className, showDate = false }: SriLankaClockProps) {
  const { time, date } = useSriLankaTime();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted",
        className,
      )}
      title="Sri Lanka Standard Time — Asia/Colombo"
    >
      <span className="relative flex size-1.5">
        <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
      </span>
      <span className="tabular-nums text-ink">{time}</span>
      <span className="text-muted/80">{showDate ? date : "COLOMBO"}</span>
    </div>
  );
}
