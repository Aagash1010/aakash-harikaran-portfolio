import { ArrowUp, Mail } from "lucide-react";
import { identity, navItems, profile } from "../../data/profile";
import { scrollToSection } from "../../lib/utils";
import { Magnetic } from "../ui/Magnetic";
import { SocialLinks } from "../ui/SocialLinks";
import { SriLankaClock } from "../ui/SriLankaClock";

export function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-panel/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-gradient-to-b from-transparent to-panel/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 left-1/2 h-96 w-[70rem] -translate-x-1/2 rounded-full bg-lime/[0.05] blur-[120px]"
      />

      {/* Signature band */}
      <div className="relative overflow-hidden border-b border-line py-3">
        <div className="marquee-track marquee-track--slow items-center gap-6">
          {Array.from({ length: 2 }).map((_, copy) => (
            <span
              key={copy}
              aria-hidden
              className="flex shrink-0 items-center gap-6 whitespace-nowrap font-display text-[clamp(1.4rem,4.4vw,3.4rem)] font-bold uppercase leading-none tracking-[-0.05em] text-ink/[0.14]"
            >
              Beyond the interface
              <span className="text-lime/60">✦</span>
              Aagash Harikaran
              <span className="text-lime/60">✦</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base to-transparent"
        />
      </div>

      <div className="container-x relative pb-8 pt-14 sm:pt-16">
        <div className="grid items-start gap-10 md:grid-cols-12">
          <div className="min-w-0 md:col-span-7">
            <p className="eyebrow">
              <span className="text-accent">End of transmission</span>
              <span aria-hidden className="h-px w-8 bg-line" />
              <span className="hidden sm:inline">The interface continues</span>
            </p>

            <button
              type="button"
              onClick={backToTop}
              className="group mt-5 block text-left"
              aria-label="Back to top"
            >
              <span className="block font-display text-[clamp(2.6rem,8vw,6.4rem)] font-bold uppercase leading-[0.82] tracking-[-0.058em] text-ink transition-colors duration-300 group-hover:text-accent">
                <span className="block sm:inline">Aagash</span>{" "}
                <span className="block sm:inline">
                  Harikaran<span className="text-lime">.</span>
                </span>
              </span>
            </button>

            <p className="serif-accent mt-5 text-xl text-muted sm:text-2xl">
              Designed with curiosity. Built with code.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[7px] uppercase tracking-[0.16em] text-muted/60">
              <span className="flex items-center gap-2 text-accent">
                <span className="relative flex size-1.5">
                  <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
                </span>
                {identity.status}
              </span>
              <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
              <span>{identity.coordinates}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6 md:col-span-5 md:items-end">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent md:text-right"
            >
              <Mail size={11} strokeWidth={1.5} aria-hidden />
              {profile.email}
            </a>

            <SocialLinks className="md:justify-end" />

            <div className="flex items-center gap-3">
              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted/60">
                Back to top
              </span>
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={backToTop}
                  aria-label="Back to top"
                  className="group grid size-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:bg-lime hover:text-[#080808]"
                >
                  <ArrowUp
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
            <span>
              © {year} {profile.name}
            </span>
            <span aria-hidden className="text-line">/</span>
            <span>{profile.location}</span>
            <span aria-hidden className="hidden text-line sm:inline">/</span>
            <SriLankaClock className="hidden sm:flex" showDate />
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {navItems.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.id);
                }}
                className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.cv}
              download
              className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
            >
              CV
            </a>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-line/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted/45">
            Beyond the interface — Aagash / {year}
          </p>
          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted/40">
            React · TypeScript · Tailwind · Framer Motion · GSAP · Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
