import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function scrollToSection(id: string) {
  const element = document.getElementById(id);

  // Section links are shared by the home page and the dedicated case-study
  // pages. When the section is not on the current route, go home to it.
  if (!element) {
    window.location.assign(id === "home" ? "/" : `/#${id}`);
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = element.getBoundingClientRect().top + window.scrollY - (id === "home" ? 0 : 76);

  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });

  if (id === "home") {
    history.replaceState(null, "", window.location.pathname);
  } else {
    history.replaceState(null, "", `#${id}`);
  }
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
