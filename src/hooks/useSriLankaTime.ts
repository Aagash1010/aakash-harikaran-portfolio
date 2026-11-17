import { useEffect, useMemo, useState } from "react";

const TIME_ZONE = "Asia/Colombo";

export function useSriLankaTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }),
    [],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
    [],
  );

  return {
    time: timeFormatter.format(now),
    date: dateFormatter.format(now),
  };
}
