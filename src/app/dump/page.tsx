"use client";

import { AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FilterBar } from "@/components/filters/filter-bar";
import { SortMenu } from "@/components/filters/sort-menu";
import { SearchBar } from "@/components/search/search-bar";
import { EmptyState } from "@/components/tasks/empty-state";
import { QuickScheduleSheet } from "@/components/tasks/quick-schedule-sheet";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskListSkeleton } from "@/components/tasks/task-list-skeleton";
import { TopBar } from "@/components/layout/top-bar";
import { useTasks } from "@/hooks/use-tasks";
import { filterTasks, sortTasks } from "@/lib/utils";
import { archiveTask, deleteTask, markComplete } from "@/services/tasksService";
import type { SortOption, Task, TaskStatus } from "@/types/task";

export default function DumpPage() {
  const router = useRouter();
  const { tasks, loading, refresh } = useTasks();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("dump");
  const [sort, setSort] = useState<SortOption>("newest");
  const [scheduleTarget, setScheduleTarget] = useState<Task | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filtered = useMemo(
    () => sortTasks(filterTasks(tasks, { status: statusFilter, query }), sort),
    [tasks, statusFilter, query, sort]
  );

  function openSchedule(task: Task) {
    setScheduleTarget(task);
    setScheduleOpen(true);
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

  async function handleComplete(task: Task) {
    try {
      await markComplete(task.id);
      toast.success("Marked complete");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-1 flex-col">
      <TopBar title="Task Dump" backHref="/" />

      <div className="flex-1 space-y-3 px-4 pb-8">
        <SearchBar value={query} onChange={setQuery} />

        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <FilterBar value={statusFilter} onChange={setStatusFilter} />
          </div>
          <SortMenu value={sort} onChange={setSort} />
        </div>

        {loading ? (
          <TaskListSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nothing here yet"
            description="Thoughts you dump from the mic button will show up here."
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSchedule={task.status === "dump" ? openSchedule : undefined}
                  onReschedule={
                    task.status !== "dump" && task.status !== "completed" ? openSchedule : undefined
                  }
                  onComplete={task.status !== "completed" ? handleComplete : undefined}
                  onEdit={(t) => router.push(`/task/${t.id}`)}
                  onArchive={task.status !== "archived" ? handleArchive : undefined}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <QuickScheduleSheet
        task={scheduleTarget}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onScheduled={() => refresh()}
      />
    </main>
  );
}
