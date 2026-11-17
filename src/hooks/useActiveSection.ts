import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.34;
      let current = ids[0] ?? "";

      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= probe) current = id;
      }

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (nearBottom) current = ids[ids.length - 1] ?? current;

      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}
