import { APP_NAME } from "@/lib/constants";
import { listTasks, updateTask } from "@/services/tasksService";
import type { Task } from "@/types/task";
import { browserNotificationProvider } from "./browser-provider";
import type { NotificationProvider, ReminderEngine } from "./types";

const OFFSET_MS: Partial<Record<Task["reminder_frequency"], number>> = {
  "15_min_before": 15 * 60_000,
  "30_min_before": 30 * 60_000,
  "1_hour_before": 60 * 60_000,
  "2_hours_before": 2 * 60 * 60_000,
  "1_day_before": 24 * 60 * 60_000,
};

const REPEAT_MS: Partial<Record<Task["reminder_frequency"], number>> = {
  every_hour: 60 * 60_000,
  every_day: 24 * 60 * 60_000,
  every_week: 7 * 24 * 60 * 60_000,
};

const INACTIVE_STATUSES: Task["status"][] = ["dump", "completed", "cancelled", "archived"];
const POLL_INTERVAL_MS = 30_000;
const FIRE_TOLERANCE_MS = 60_000;

function getTargetDate(task: Task): Date | null {
  if (!task.scheduled_date) return null;
  const time = task.scheduled_time ?? "09:00:00";
  const date = new Date(`${task.scheduled_date}T${time}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function computeNextTrigger(task: Task): Date | null {
  const target = getTargetDate(task);
  if (!target) return null;
  const freq = task.reminder_frequency;

  if (freq === "one_time") return target;

  const offset = OFFSET_MS[freq];
  if (offset !== undefined) return new Date(target.getTime() - offset);

  const repeat = REPEAT_MS[freq];
  if (repeat !== undefined) {
    if (!task.last_reminded) return target;
    return new Date(new Date(task.last_reminded).getTime() + repeat);
  }

  return null;
}

async function tick(providers: NotificationProvider[]) {
  let tasks: Task[];
  try {
    tasks = await listTasks();
  } catch {
    return;
  }

  const now = Date.now();

  for (const task of tasks) {
    if (INACTIVE_STATUSES.includes(task.status)) continue;
    if (task.reminder_frequency === "none" || task.reminder_frequency === "custom") continue;

    const trigger = computeNextTrigger(task);
    if (!trigger) continue;

    const triggerTime = trigger.getTime();
    if (triggerTime > now || now - triggerTime > FIRE_TOLERANCE_MS) continue;

    const lastRemindedTime = task.last_reminded ? new Date(task.last_reminded).getTime() : null;
    if (lastRemindedTime && lastRemindedTime >= triggerTime) continue;

    const message = {
      taskId: task.id,
      title: APP_NAME,
      body: task.title || task.voice_transcript,
    };

    for (const provider of providers) {
      if (!provider.isAvailable()) continue;
      try {
        await provider.send(message);
      } catch {
        // Provider unavailable/unimplemented — safe to skip in MVP.
      }
    }

    try {
      await updateTask(task.id, { last_reminded: new Date().toISOString() });
    } catch {
      // Best-effort — will retry next tick if it lands within tolerance again.
    }
  }
}

export function createReminderEngine(
  providers: NotificationProvider[] = [browserNotificationProvider]
): ReminderEngine {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    start() {
      if (intervalId) return;
      tick(providers);
      intervalId = setInterval(() => tick(providers), POLL_INTERVAL_MS);
    },
    stop() {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    },
  };
}
