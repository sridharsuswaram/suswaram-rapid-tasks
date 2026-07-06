"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Deferred to an effect so the server-rendered markup (no clock) matches
    // the first client render — the real time is only safe to show post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="h-[52px]" aria-hidden="true" />;
  }

  return (
    <div className="text-center">
      <p className="text-3xl font-semibold tabular-nums tracking-tight">{format(now, "h:mm a")}</p>
      <p className="text-sm text-muted-foreground">{format(now, "EEEE, MMMM d")}</p>
    </div>
  );
}
