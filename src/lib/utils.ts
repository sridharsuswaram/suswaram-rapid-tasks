import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday as isTodayFns, isValid, parseISO } from "date-fns"
import { MOTIVATIONAL_QUOTES } from "@/lib/constants"
import type { SortOption, Task, TaskFilters } from "@/types/task"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined, pattern = "MMM d, yyyy") {
  if (!dateStr) return "";
  const date = dateStr.length <= 10 ? parseISO(`${dateStr}T00:00:00`) : parseISO(dateStr);
  return isValid(date) ? format(date, pattern) : "";
}

export function formatTime(timeStr: string | null | undefined) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m ?? 0), 0, 0);
  return isValid(date) ? format(date, "h:mm a") : "";
}

export function formatDateTime(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "MMM d, yyyy 'at' h:mm a") : "";
}

export function isDateToday(dateStr: string | null | undefined) {
  if (!dateStr) return false;
  const date = parseISO(`${dateStr}T00:00:00`);
  return isValid(date) && isTodayFns(date);
}

export function todayISODate() {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getQuoteOfTheDay(date: Date = new Date()) {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

const PRIORITY_WEIGHT: Record<Task["priority"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function sortTasks(tasks: Task[], sort: SortOption): Task[] {
  const list = [...tasks];
  switch (sort) {
    case "oldest":
      return list.sort((a, b) => a.created_at.localeCompare(b.created_at));
    case "priority":
      return list.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
    case "date":
      return list.sort((a, b) =>
        (a.scheduled_date ?? "9999-99-99").localeCompare(b.scheduled_date ?? "9999-99-99")
      );
    case "alphabetical":
      return list.sort((a, b) => (a.title || a.voice_transcript).localeCompare(b.title || b.voice_transcript));
    case "newest":
    default:
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    if (filters.status && filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.priority && filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.date && task.scheduled_date !== filters.date) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${task.title} ${task.voice_transcript} ${task.notes ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
