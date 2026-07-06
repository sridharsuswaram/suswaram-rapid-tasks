import type { Task } from "@/types/task";

const CSV_COLUMNS = [
  "id",
  "title",
  "voice_transcript",
  "status",
  "created_at",
  "updated_at",
  "scheduled_date",
  "scheduled_time",
  "reminder_frequency",
  "priority",
  "notes",
  "completed_on",
  "last_reminded",
  "archive",
  "is_dump",
  "source",
] as const;

function escapeCSVValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function tasksToCSV(tasks: Task[]): string {
  const rows = tasks.map((task) =>
    CSV_COLUMNS.map((column) => escapeCSVValue(task[column])).join(",")
  );
  return [CSV_COLUMNS.join(","), ...rows].join("\n");
}

export function tasksToJSON(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportTasksAsCSV(tasks: Task[]) {
  downloadFile(`rapid-tasks-export-${Date.now()}.csv`, tasksToCSV(tasks), "text/csv");
}

export function exportTasksAsJSON(tasks: Task[]) {
  downloadFile(`rapid-tasks-export-${Date.now()}.json`, tasksToJSON(tasks), "application/json");
}
