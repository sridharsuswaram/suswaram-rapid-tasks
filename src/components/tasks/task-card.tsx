"use client";

import { motion } from "framer-motion";
import {
  Archive,
  Bell,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  MoreVertical,
  Pencil,
  Play,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { PRIORITY, STATUS } from "@/lib/constants";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onSchedule?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onArchive?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onStart?: (task: Task) => void;
  onCancel?: (task: Task) => void;
  onReschedule?: (task: Task) => void;
}

export function TaskCard({
  task,
  onSchedule,
  onEdit,
  onDelete,
  onArchive,
  onComplete,
  onStart,
  onCancel,
  onReschedule,
}: TaskCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = STATUS[task.status];
  const priority = PRIORITY[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-2.5 rounded-2xl bg-card p-4 shadow-soft"
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/task/${task.id}`} className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium">
            {task.title || task.voice_transcript}
          </p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Task actions">
                <MoreVertical className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            {onSchedule && (
              <DropdownMenuItem onClick={() => onSchedule(task)}>
                <CalendarIcon /> Quick Schedule
              </DropdownMenuItem>
            )}
            {onReschedule && (
              <DropdownMenuItem onClick={() => onReschedule(task)}>
                <RotateCcw /> Reschedule
              </DropdownMenuItem>
            )}
            {onStart && (
              <DropdownMenuItem onClick={() => onStart(task)}>
                <Play /> Start
              </DropdownMenuItem>
            )}
            {onComplete && (
              <DropdownMenuItem onClick={() => onComplete(task)}>
                <CheckCircle2 /> Mark Complete
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil /> Edit
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={() => onArchive(task)}>
                <Archive /> Archive
              </DropdownMenuItem>
            )}
            {onCancel && (
              <DropdownMenuItem onClick={() => onCancel(task)}>
                <XCircle /> Cancel
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className={cn("border-none", status.badgeClass)}>{status.label}</Badge>
        <Badge className={cn("border-none", priority.badgeClass)}>{priority.label}</Badge>
        {task.reminder_frequency !== "none" && (
          <Badge variant="outline" className="gap-1">
            <Bell className="size-3" /> Reminder
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3" /> {formatDate(task.created_at, "MMM d, yyyy 'at' h:mm a")}
        </span>
        {task.scheduled_date && (
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3" />
            {formatDate(task.scheduled_date)}
            {task.scheduled_time && ` · ${formatTime(task.scheduled_time)}`}
          </span>
        )}
      </div>

      {onDelete && (
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
              <AlertDialogAction
                onClick={() => {
                  onDelete(task);
                  setConfirmDelete(false);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
}
