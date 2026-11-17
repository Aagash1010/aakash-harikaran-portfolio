import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { identity, navItems, profile } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import { cn, scrollToSection } from "../../lib/utils";
import { EASE_OUT } from "../../lib/motion";
import { Logo } from "../ui/Logo";
import { ButtonLink } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { SocialLinks } from "../ui/SocialLinks";
import { SriLankaClock } from "../ui/SriLankaClock";
import { ThemeToggle } from "../ui/ThemeToggle";

const sectionIds = navItems.map((item) => item.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [menuOpen]);

  const goTo = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  const handleMobileNav = useCallback((id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToSection(id), 100);
  }, []);

  const highlighted = hovered ?? active;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[140] transition-[padding] duration-500",
          scrolled ? "py-2.5" : "py-3.5 md:py-5",
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              "flex items-center justify-between gap-3 rounded-full px-2.5 py-2 transition-all duration-500 sm:px-3",
              scrolled
                ? "glass shadow-[0_20px_70px_-40px_rgba(0,0,0,0.9)]"
                : "border border-transparent bg-transparent",
            )}
          >
            <Logo />

            <nav
              aria-label="Primary"
              onMouseLeave={() => setHovered(null)}
              className="hidden items-center rounded-full border border-line/70 bg-panel/25 p-1 lg:flex"
            >
              {navItems.map((item) => {
                const isActive = active === item.id;
                const isHighlighted = highlighted === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(item.id);
                    }}
                    onMouseEnter={() => setHovered(item.id)}
                    onFocus={() => setHovered(item.id)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative rounded-full px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-300",
                      isActive
                        ? "text-accent"
                        : isHighlighted
                          ? "text-ink"
                          : "text-muted hover:text-ink",
                    )}
                  >
                    {isHighlighted ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className={cn(
                          "absolute inset-0 rounded-full border",
                          isActive
                            ? "border-accent/25 bg-lime-soft"
                            : "border-line bg-panel/70",
                        )}
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    ) : null}
                    <span className="relative z-10 flex items-baseline gap-1.5">
                      <span
                        className={cn(
                          "text-[6.5px] tabular-nums transition-colors",
                          isActive ? "text-accent/70" : "text-muted/45",
                        )}
                      >
                        {item.index}
                      </span>
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <span className="mr-1 hidden items-center gap-2 rounded-full border border-line/70 px-3 py-1.5 xl:flex">
                <span className="relative flex size-1.5">
                  <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
                  {profile.availability.short}
                </span>
              </span>
              <SriLankaClock className="mr-1 hidden 2xl:flex" />
              <a
                href={profile.cv}
                download
                aria-label="Download curriculum vitae"
                title="Download CV"
                className="hidden size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent sm:grid"
              >
                <Download size={14} strokeWidth={1.6} aria-hidden />
              </a>
              <ThemeToggle />
              <div className="hidden sm:block">
                <Magnetic strength={0.18}>
                  <ButtonLink
                    href="#contact"
                    size="sm"
                    onClick={(event) => {
                      event.preventDefault();
                      goTo("contact");
                    }}
                  >
                    Let&apos;s talk
                  </ButtonLink>
                </Magnetic>
              </div>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent/40 hover:text-accent lg:hidden"
              >
                <Menu size={16} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            ref={dialogRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[150] flex flex-col overflow-y-auto bg-base lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 blueprint-grid opacity-50" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 top-1/3 size-80 rounded-full bg-lime/[0.06] blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 bottom-10 font-display text-[34vw] font-bold uppercase leading-none tracking-[-0.08em] text-ink/[0.03]"
            >
              AK
            </div>

            <div className="container-x relative flex items-center justify-between pb-6 pt-6">
              <Logo
                onClick={() => {
                  setMenuOpen(false);
                  window.setTimeout(() => scrollToSection("home"), 100);
                }}
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="container-x relative flex flex-1 flex-col justify-between pb-8 pt-2">
              <nav aria-label="Mobile primary" className="flex flex-col">
                {navItems.map((item, index) => {
                  const isActive = active === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        handleMobileNav(item.id);
                      }}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.06 + index * 0.045,
                        ease: EASE_OUT,
                      }}
                      className="group flex items-center justify-between gap-4 border-b border-line py-3.5"
                    >
                      <span className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                        <span className="font-mono text-[9px] text-muted/70">
                          {item.index}
                        </span>
                        <span
                          className={cn(
                            "font-display text-[clamp(1.9rem,9vw,3.2rem)] font-bold uppercase leading-none tracking-[-0.045em] transition-colors",
                            isActive
                              ? "text-accent"
                              : "text-ink group-hover:text-accent",
                          )}
                        >
                          {item.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.4}
                        className={cn(
                          "shrink-0 transition-all duration-300",
                          isActive
                            ? "text-accent"
                            : "-translate-y-1 text-muted opacity-40 group-hover:translate-y-0 group-hover:opacity-100",
                        )}
                      />
                    </motion.a>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.36, ease: EASE_OUT }}
                className="mt-9 flex flex-col gap-6"
              >
                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-accent">
                  <span className="relative flex size-1.5">
                    <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
                  </span>
                  {identity.status}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <SocialLinks />
                  <SriLankaClock />
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="link-line w-fit font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-accent"
                >
                  {profile.email}
                </a>
                <div className="flex items-center gap-3">
                  <ButtonLink
                    href={profile.cv}
                    download
                    size="sm"
                    className="flex-1"
                    iconSide="right"
                  >
                    Download CV
                  </ButtonLink>
                  <ButtonLink
                    href="#contact"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(event) => {
                      event.preventDefault();
                      handleMobileNav("contact");
                    }}
                  >
                    Connect
                  </ButtonLink>
                </div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/60">
                  {profile.location} · {new Date().getFullYear()} · {identity.name}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
