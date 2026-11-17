import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeProvider";
import { ToastProvider } from "./context/ToastProvider";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import { CustomCursor } from "./components/layout/CustomCursor";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Interests } from "./components/sections/Interests";
import { Contact } from "./components/sections/Contact";
import { NotFound } from "./pages/NotFound";
import { ProjectPage } from "./pages/ProjectPage";
import { getProject } from "./data/profile";
import { scrollToSection } from "./lib/utils";

function isHomePath(path: string) {
  return path === "/" || path === "" || path === "/index.html";
}

function isWorkIndex(path: string) {
  return path === "/work" || path === "/work/";
}

function projectIdFromPath(path: string) {
  const match = path.match(/^\/work\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function shouldShowIntro(path: string) {
  if (!isHomePath(path)) return false;
  try {
    return sessionStorage.getItem("ak-intro-seen") !== "1";
  } catch {
    return true;
  }
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [showIntro, setShowIntro] = useState(() => shouldShowIntro(path));
  const [revealed, setRevealed] = useState(() => !shouldShowIntro(path));

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const finishIntro = useCallback(() => {
    setShowIntro(false);
    setRevealed(true);
    try {
      sessionStorage.setItem("ak-intro-seen", "1");
    } catch {
      /* ignore unavailable storage */
    }

    if (window.location.hash) {
      window.setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        target?.scrollIntoView({ behavior: "auto", block: "start" });
      }, 80);
    }
  }, []);

  const home = isHomePath(path) || isWorkIndex(path);
  const project = getProject(projectIdFromPath(path) ?? "");

  // Deep links to /#section (and the /work shortcut) need a scroll once the
  // home sections exist. The intro overlay delays the hero, so wait for it.
  useEffect(() => {
    if (!home) return;
    const target = isWorkIndex(path)
      ? "projects"
      : window.location.hash.replace("#", "");
    if (!target) return;

    if (isWorkIndex(path)) {
      window.history.replaceState(null, "", "/#projects");
    }

    const timer = window.setTimeout(
      () => scrollToSection(target),
      showIntro ? 1350 : 180,
    );
    return () => window.clearTimeout(timer);
  }, [home, path, showIntro]);

  return (
    <ThemeProvider>
      <ToastProvider>
        <CustomCursor />

        {home ? (
          <>
            <ScrollProgress />

            <AnimatePresence>
              {showIntro ? <LoadingScreen onComplete={finishIntro} /> : null}
            </AnimatePresence>

            <Navbar />

            <main id="main" className="relative z-10">
              <Hero revealed={revealed} />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Interests />
              <Contact />
            </main>

            <Footer />
          </>
        ) : project ? (
          <>
            <ScrollProgress />
            <Navbar />
            <ProjectPage project={project} />
            <Footer />
          </>
        ) : (
          <NotFound />
        )}

        <div className="grain" aria-hidden="true" />
        <div className="page-grid" aria-hidden="true">
          <div className="page-grid__inner">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
