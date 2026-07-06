"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createReminderEngine } from "@/services/reminders/engine";

export function useReminderEngine() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const engine = createReminderEngine();
    engine.start();
    return () => engine.stop();
  }, [user]);
}
