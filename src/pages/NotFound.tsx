import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { EASE_OUT } from "../lib/motion";
import { Logo } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ButtonLink } from "../components/ui/Button";
import { Magnetic } from "../components/ui/Magnetic";

export function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "404 — Signal lost · Aagash Harikaran";

    const robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;
    robots?.setAttribute("content", "noindex, follow");

    return () => {
      document.title = previousTitle;
      if (robots && previousRobots !== null) {
        robots.setAttribute("content", previousRobots);
      }
    };
  }, []);

  const goHome = () => {
    window.location.assign("/");
  };

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 blueprint-grid opacity-45 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.055] blur-[110px]" />
        <div className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/50 sm:size-[36rem]" />
        <div className="orbit-spin absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line/25 sm:size-[46rem]" />
      </div>

      <header className="container-x relative flex items-center justify-between pb-4 pt-7">
        <Logo onClick={goHome} />
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-muted/60 sm:block">
            Error / 404
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="container-x relative flex flex-1 flex-col justify-center py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="eyebrow">
            <span className="text-accent">Signal lost</span>
            <span aria-hidden className="h-px w-10 bg-line" />
            <span>Route not found</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE_OUT }}
          className="relative mt-4"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-1 top-1 select-none font-display text-[clamp(7rem,23vw,18rem)] font-bold leading-[0.75] tracking-[-0.07em] text-lime/[0.07] sm:left-2 sm:top-2"
          >
            404
          </span>
          <h1 className="relative font-display text-[clamp(7rem,23vw,18rem)] font-bold leading-[0.75] tracking-[-0.07em] text-ink">
            404<span className="text-lime">.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
          className="mt-8 max-w-xl"
        >
          <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.8rem)] font-bold leading-[1.02] tracking-[-0.04em] text-ink">
            This page drifted beyond the interface.
          </h2>
          <p className="body-copy mt-4 max-w-md">
            The route may have moved, or the idea hasn&apos;t been built yet. Either
            way, you&apos;re one click from somewhere more interesting.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.18}>
              <ButtonLink href="/" icon={<ArrowLeft size={14} strokeWidth={1.6} />}>
                Back to the interface
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.14}>
              <ButtonLink
                href={`mailto:${profile.email}`}
                variant="outline"
                icon={<Mail size={13} strokeWidth={1.5} />}
                iconSide="left"
              >
                Get in touch
              </ButtonLink>
            </Magnetic>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted/50">
              Try instead
            </span>
            {[
              { label: "Projects", href: "/#projects" },
              { label: "About", href: "/#about" },
              { label: "Contact", href: "/#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
              >
                {link.label}
                <ArrowUpRight
                  size={11}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="container-x relative flex items-center justify-between gap-4 border-t border-line py-5 font-mono text-[7.5px] uppercase tracking-[0.16em] text-muted/50">
        <span>Aagash Harikaran / Beyond the Interface</span>
        <span className="hidden sm:block">07.8731° N / 080.7718° E</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
