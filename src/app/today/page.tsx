"use client";

import { AnimatePresence } from "framer-motion";
import { CalendarDays, ListChecks } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/tasks/empty-state";
import { QuickScheduleSheet } from "@/components/tasks/quick-schedule-sheet";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskListSkeleton } from "@/components/tasks/task-list-skeleton";
import { useTasks } from "@/hooks/use-tasks";
import { formatDate, sortTasks, todayISODate } from "@/lib/utils";
import { archiveTask, deleteTask, markComplete, startTask } from "@/services/tasksService";
import type { Task } from "@/types/task";

export default function TodayPage() {
  const { tasks, loading, refresh } = useTasks();
  const [rescheduleTarget, setRescheduleTarget] = useState<Task | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const todayTasks = useMemo(() => {
    const today = todayISODate();
    const list = tasks.filter(
      (t) => t.scheduled_date === today && t.status !== "cancelled" && t.status !== "archived"
    );
    return sortTasks(list, "date");
  }, [tasks]);

  function openReschedule(task: Task) {
    setRescheduleTarget(task);
    setRescheduleOpen(true);
  }

  async function handleComplete(task: Task) {
    try {
      await markComplete(task.id);
      toast.success("Marked complete");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  async function handleStart(task: Task) {
    try {
      await startTask(task.id);
      toast.success("Task started");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  async function handleDelete(task: Task) {
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  async function handleArchive(task: Task) {
    try {
      await archiveTask(task.id);
      toast.success("Task archived");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to archive task");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-1 flex-col">
      <TopBar
        title="Today's Tasks"
        backHref="/"
        right={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open date view"
            nativeButton={false}
            render={
              <Link href="/calendar">
                <CalendarDays />
              </Link>
            }
          />
        }
      />

      <div className="flex-1 space-y-3 px-4 pb-8">
        <p className="text-sm text-muted-foreground">{formatDate(todayISODate(), "EEEE, MMMM d, yyyy")}</p>

        {loading ? (
          <TaskListSkeleton />
        ) : todayTasks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nothing scheduled for today"
            description="Schedule a dumped task to see it show up here."
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={task.status === "scheduled" ? handleStart : undefined}
                  onComplete={task.status !== "completed" ? handleComplete : undefined}
                  onReschedule={task.status !== "completed" ? openReschedule : undefined}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <QuickScheduleSheet
        task={rescheduleTarget}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onScheduled={() => refresh()}
      />
    </main>
  );
}
