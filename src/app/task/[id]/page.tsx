"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditTaskForm } from "@/components/tasks/edit-task-form";
import { TaskTimeline } from "@/components/tasks/task-timeline";
import { PRIORITY, STATUS } from "@/lib/constants";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { deleteTask, getTask, updateTask } from "@/services/tasksService";
import type { Task, TaskUpdate } from "@/types/task";
import { Pencil, Trash2 } from "lucide-react";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getTask(params.id).then(setTask).catch(() => setTask(null));
  }, [params.id]);

  async function handleSave(patch: TaskUpdate) {
    if (!task) return;
    setSaving(true);
    try {
      const updated = await updateTask(task.id, patch);
      setTask(updated);
      setEditing(false);
      toast.success("Task updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!task) return;
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
      router.push("/dump");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  if (task === undefined) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-1 flex-col">
        <TopBar title="Task Details" backHref="/dump" />
        <div className="px-4 text-sm text-muted-foreground">Loading…</div>
      </main>
    );
  }

  if (task === null) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-1 flex-col">
        <TopBar title="Task Details" backHref="/dump" />
        <div className="px-4 text-sm text-muted-foreground">Task not found.</div>
      </main>
    );
  }

  const status = STATUS[task.status];
  const priority = PRIORITY[task.priority];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-1 flex-col">
      <TopBar
        title="Task Details"
        backHref="/dump"
        right={
          !editing && (
            <>
              <Button variant="ghost" size="icon" aria-label="Edit task" onClick={() => setEditing(true)}>
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete task"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 />
              </Button>
            </>
          )
        }
      />

      <div className="flex-1 space-y-5 px-4 pb-8">
        {editing ? (
          <EditTaskForm task={task} onSave={handleSave} onCancel={() => setEditing(false)} saving={saving} />
        ) : (
          <>
            <div className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
              <p className="whitespace-pre-wrap text-base">{task.voice_transcript}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge className={cn("border-none", status.badgeClass)}>{status.label}</Badge>
                <Badge className={cn("border-none", priority.badgeClass)}>{priority.label}</Badge>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-card p-4 text-sm shadow-soft">
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{formatDate(task.created_at, "MMM d, yyyy 'at' h:mm a")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Scheduled date</dt>
                <dd>{task.scheduled_date ? formatDate(task.scheduled_date) : "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Scheduled time</dt>
                <dd>{task.scheduled_time ? formatTime(task.scheduled_time) : "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Reminder</dt>
                <dd className="capitalize">{task.reminder_frequency.replaceAll("_", " ")}</dd>
              </div>
            </dl>

            {task.notes && (
              <div className="space-y-1 rounded-2xl bg-card p-4 shadow-soft">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm whitespace-pre-wrap">{task.notes}</p>
              </div>
            )}

            <div className="rounded-2xl bg-card p-4 shadow-soft">
              <p className="mb-3 text-sm font-medium">Timeline</p>
              <TaskTimeline task={task} />
            </div>
          </>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. The task will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
