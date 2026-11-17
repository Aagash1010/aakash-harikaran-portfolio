import { ArrowUpRight, Mail } from "lucide-react";
import { GithubMark, LinkedinMark } from "./BrandIcons";
import { profile } from "../../data/profile";
import { useToast } from "../../context/ToastProvider";
import { cn } from "../../lib/utils";

const iconMap = {
  github: GithubMark,
  linkedin: LinkedinMark,
  mail: Mail,
};

interface SocialLinksProps {
  variant?: "icons" | "list";
  className?: string;
  itemClassName?: string;
}

export function SocialLinks({
  variant = "icons",
  className,
  itemClassName,
}: SocialLinksProps) {
  const { notify } = useToast();

  return (
    <ul
      className={cn(
        variant === "icons" ? "flex items-center gap-2.5" : "flex flex-col",
        className,
      )}
    >
      {profile.socials.map((social) => {
        const Icon = iconMap[social.icon];
        const sharedClassName = cn(
          "group/social flex items-center transition-[color,border-color,background-color,transform] duration-300 ease-out active:scale-[0.97]",
          variant === "icons"
            ? "size-10 items-center justify-center rounded-full border border-line text-muted hover:-translate-y-0.5 hover:border-accent/50 hover:bg-lime-soft hover:text-accent"
            : "w-full justify-between border-b border-line py-4 text-ink hover:text-accent",
          itemClassName,
        );

        const inner =
          variant === "icons" ? (
            <Icon size={15} strokeWidth={1.6} aria-hidden />
          ) : (
            <>
              <span className="flex items-center gap-3">
                <Icon size={15} strokeWidth={1.6} aria-hidden />
                <span className="font-mono text-[11px] uppercase tracking-[0.15em]">
                  {social.name}
                </span>
                <span className="hidden text-[11px] text-muted sm:inline">
                  {social.handle}
                </span>
              </span>
              <ArrowUpRight
                size={14}
                aria-hidden
                className="text-muted transition-transform duration-300 group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5 group-hover/social:text-accent"
              />
            </>
          );

        return (
          <li key={social.name} className={variant === "list" ? "w-full" : undefined}>
            {social.href ? (
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                aria-label={`${social.name} — ${social.handle}`}
                className={sharedClassName}
              >
                {inner}
              </a>
            ) : (
              <button
                type="button"
                onClick={() =>
                  notify(`${social.name} profile link coming soon — it will be added when available.`)
                }
                aria-label={`${social.name} profile link coming soon`}
                className={sharedClassName}
              >
                {inner}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
