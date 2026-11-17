import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  accent: boolean;
}

/**
 * A lightweight canvas constellation. It responds to the pointer, pauses when
 * the tab is hidden, caps DPR and renders a single static frame for visitors
 * who prefer reduced motion. No WebGL payload required.
 */
export function HeroField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let accent = "#c6ff4d";
    let ink = "#f5f5f5";
    let mouse = { x: -9999, y: -9999 };
    let dpr = 1;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      accent = styles.getPropertyValue("--c-accent").trim() || "#c6ff4d";
      ink = styles.getPropertyValue("--c-ink").trim() || "#f5f5f5";
    };

    const makeParticles = (count: number) => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.3 + 0.55,
        accent: Math.random() > 0.76,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      const count = Math.max(26, Math.min(72, Math.round((width * height) / 22000)));
      makeParticles(count);
      if (reduced) draw(0);
    };

    const draw = (delta: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reduced) {
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 128) {
            ctx.beginPath();
            ctx.strokeStyle = ink;
            ctx.globalAlpha = (1 - distance / 128) * 0.13;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const mouseDistance = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (mouseDistance < 190) {
          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - mouseDistance / 190) * 0.28;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const particle of particles) {
        ctx.beginPath();
        ctx.fillStyle = particle.accent ? accent : ink;
        ctx.globalAlpha = particle.accent ? 0.55 : 0.38;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    let last = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const delta = Math.min(2.5, (now - last) / 16.666);
      last = now;
      draw(delta);
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onPointerLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduced) {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        maskImage:
          "radial-gradient(ellipse 78% 75% at 62% 46%, #000 35%, transparent 82%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 78% 75% at 62% 46%, #000 35%, transparent 82%)",
      }}
    />
  );
}
