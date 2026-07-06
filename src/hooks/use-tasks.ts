"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { listTasks, subscribeToTasks } from "@/services/tasksService";
import type { Task } from "@/types/task";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await listTasks();
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
      // Surface loudly — a failed fetch (e.g. a missing Firestore composite
      // index) must never look identical to "you have no tasks yet".
      console.error("Failed to load tasks:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Resyncing the loading flag when the signed-in user changes, ahead of
    // the async refresh() call and the realtime subscription below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    refresh();
    const unsubscribe = subscribeToTasks(user.uid, refresh);
    return unsubscribe;
  }, [user, refresh]);

  return { tasks, loading, error, refresh };
}
