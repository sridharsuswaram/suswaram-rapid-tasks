import { Check, Clock, PlayCircle, Send } from "lucide-react";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TimelineEvent {
  icon: typeof Clock;
  label: string;
  timestamp: string;
}

export function TaskTimeline({ task }: { task: Task }) {
  const events: TimelineEvent[] = [
    { icon: Send, label: "Dumped", timestamp: formatDateTime(task.created_at) },
  ];

  if (task.scheduled_date) {
    events.push({
      icon: Clock,
      label: "Scheduled for",
      timestamp: `${formatDate(task.scheduled_date)}${
        task.scheduled_time ? ` at ${formatTime(task.scheduled_time)}` : ""
      }`,
    });
  }

  if (task.status === "in_progress") {
    events.push({ icon: PlayCircle, label: "In progress", timestamp: formatDateTime(task.updated_at) });
  }

  if (task.completed_on) {
    events.push({ icon: Check, label: "Completed", timestamp: formatDateTime(task.completed_on) });
  }

  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <event.icon className="size-3.5" />
            </div>
            {i < events.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium">{event.label}</p>
            <p className="text-xs text-muted-foreground">{event.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
