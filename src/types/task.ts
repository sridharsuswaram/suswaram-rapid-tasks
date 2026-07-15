export type TaskStatus =
  | "dump"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "archived";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export type ReminderFrequency =
  | "none"
  | "one_time"
  | "15_min_before"
  | "30_min_before"
  | "1_hour_before"
  | "2_hours_before"
  | "1_day_before"
  | "every_hour"
  | "every_day"
  | "every_week"
  | "custom";

export type TaskSource = "voice" | "manual";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  voice_transcript: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  reminder_frequency: ReminderFrequency;
  priority: TaskPriority;
  notes: string | null;
  completed_on: string | null;
  last_reminded: string | null;
  archive: boolean;
  is_dump: boolean;
  source: TaskSource;
  tags: string[];
}

export type TaskInsert = Pick<Task, "title" | "voice_transcript"> &
  Partial<
    Omit<Task, "id" | "user_id" | "title" | "voice_transcript" | "created_at" | "updated_at">
  >;

export type TaskUpdate = Partial<
  Omit<Task, "id" | "user_id" | "created_at">
>;

export type SortOption = "newest" | "oldest" | "priority" | "date" | "alphabetical";

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  date?: string;
  query?: string;
}
