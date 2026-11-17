import {
  siBootstrap,
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siIntellijidea,
  siJavascript,
  siMysql,
  siNodedotjs,
  siOpenjdk,
  siPython,
  siReact,
  siSpringboot,
} from "simple-icons";
import {
  Binary,
  Brain,
  BrainCircuit,
  ChartSpline,
  PenTool,
  Waypoints,
} from "lucide-react";
import type { TechIconKey } from "../../data/profile";
import { cn } from "../../lib/utils";

type BrandIcon = { path: string; title: string };

const vscode: BrandIcon = {
  title: "Visual Studio Code",
  path: "M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352ZM18.002 17.448 10.826 12l7.176-5.448v10.896Z",
};

const brandIcons: Partial<Record<TechIconKey, BrandIcon>> = {
  html: siHtml5,
  css: siCss,
  javascript: siJavascript,
  react: siReact,
  bootstrap: siBootstrap,
  java: siOpenjdk,
  spring: siSpringboot,
  node: siNodedotjs,
  python: siPython,
  mysql: siMysql,
  git: siGit,
  github: siGithub,
  intellij: siIntellijidea,
  vscode,
};

const lucideIcons = {
  rest: Waypoints,
  ai: BrainCircuit,
  ml: ChartSpline,
  cp: Binary,
  uiux: PenTool,
} satisfies Partial<Record<TechIconKey, typeof Brain>>;

interface TechIconProps {
  icon: TechIconKey;
  className?: string;
  size?: number;
}

export function TechIcon({ icon, className, size = 22 }: TechIconProps) {
  const brand = brandIcons[icon];

  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
        className={cn("shrink-0", className)}
      >
        <title>{brand.title}</title>
        <path d={brand.path} />
      </svg>
    );
  }

  const Icon = lucideIcons[icon as keyof typeof lucideIcons] ?? Brain;
  return (
    <Icon
      size={size}
      strokeWidth={1.4}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    />
  );
}
