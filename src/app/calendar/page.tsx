"use client";

import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/layout/top-bar";
import { Calendar } from "@/components/ui/calendar";
import { EmptyState } from "@/components/tasks/empty-state";
import { QuickScheduleSheet } from "@/components/tasks/quick-schedule-sheet";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskListSkeleton } from "@/components/tasks/task-list-skeleton";
import { useTasks } from "@/hooks/use-tasks";
import { sortTasks } from "@/lib/utils";
import { archiveTask, deleteTask, markComplete, startTask } from "@/services/tasksService";
import type { Task } from "@/types/task";

export default function CalendarPage() {
  const { tasks, loading, refresh } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [rescheduleTarget, setRescheduleTarget] = useState<Task | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const selectedISODate = format(selectedDate, "yyyy-MM-dd");

  const datedTasks = useMemo(() => {
    const list = tasks.filter((t) => t.scheduled_date === selectedISODate);
    return sortTasks(list, "date");
  }, [tasks, selectedISODate]);

  const scheduledDays = useMemo(
    () =>
      tasks
        .filter((t) => t.scheduled_date)
        .map((t) => new Date(`${t.scheduled_date}T00:00:00`)),
    [tasks]
  );

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
      <TopBar title="Date View" backHref="/today" />

      <div className="flex-1 space-y-4 px-4 pb-8">
        <div className="flex justify-center rounded-2xl bg-card p-2 shadow-soft">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            modifiers={{ hasTasks: scheduledDays }}
            modifiersClassNames={{ hasTasks: "font-semibold text-primary" }}
          />
        </div>

        <p className="text-sm font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>

        {loading ? (
          <TaskListSkeleton />
        ) : datedTasks.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No tasks on this date" />
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {datedTasks.map((task) => (
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
