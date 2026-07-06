import type { ReminderFrequency, TaskPriority, TaskStatus } from "@/types/task";

export const APP_NAME = "Suswaram Rapid Tasks";
export const APP_VERSION = "0.1.0";
export const APP_TAGLINE = "Speak it. We'll remember. Organize later.";

export const STATUS: Record<
  TaskStatus,
  { label: string; badgeClass: string }
> = {
  dump: {
    label: "Dump",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  },
  scheduled: {
    label: "Scheduled",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-warning/15 text-warning dark:bg-warning/20 dark:text-warning",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-completed-foreground text-completed dark:bg-completed-foreground dark:text-completed",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-muted text-muted-foreground",
  },
};

export const PRIORITY: Record<
  TaskPriority,
  { label: string; badgeClass: string; dotClass: string }
> = {
  low: {
    label: "Low",
    badgeClass: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
    dotClass: "bg-slate-400",
  },
  medium: {
    label: "Medium",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  high: {
    label: "High",
    badgeClass: "bg-brand-orange/15 text-brand-orange",
    dotClass: "bg-brand-orange",
  },
  critical: {
    label: "Critical",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    dotClass: "bg-red-500",
  },
};

export const REMINDER_FREQUENCY_OPTIONS: { value: ReminderFrequency; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "one_time", label: "One time (at scheduled time)" },
  { value: "15_min_before", label: "15 minutes before" },
  { value: "30_min_before", label: "30 minutes before" },
  { value: "1_hour_before", label: "1 hour before" },
  { value: "2_hours_before", label: "2 hours before" },
  { value: "1_day_before", label: "1 day before" },
  { value: "every_hour", label: "Every hour" },
  { value: "every_day", label: "Every day" },
  { value: "every_week", label: "Every week" },
  { value: "custom", label: "Custom" },
];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const STATUS_FILTER_OPTIONS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "dump", label: "Dump" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
  { value: "cancelled", label: "Cancelled" },
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priority", label: "Priority" },
  { value: "date", label: "Date" },
  { value: "alphabetical", label: "Alphabetical" },
];

export const VOICE_LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-IN", label: "English (India)" },
  { value: "hi-IN", label: "Hindi" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
];

export const MOTIVATIONAL_QUOTES = [
  "Small thoughts, captured now, become tomorrow's momentum.",
  "Your mind is for having ideas, not holding them.",
  "Speak it out. Sort it out later.",
  "Every great plan starts as a stray thought.",
  "Don't let a good idea slip away — dump it.",
  "Capture first, organize later.",
  "The fastest way to remember is to say it out loud.",
];
