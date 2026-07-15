import type { Task } from "@/types/task";

export interface AnalyticsMetrics {
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  completionRate: number;
  totalTasks: number;
  totalCompleted: number;
  currentStreak: number;
  tasksByHour: { hour: string; count: number }[];
  statusBreakdown: {
    dump: number;
    scheduled: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    archived: number;
  };
}

export function calculateAnalytics(tasks: Task[]): AnalyticsMetrics {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);

  const completedToday = tasks.filter((t) => {
    if (t.status !== "completed" || !t.completed_on) return false;
    const completedDate = new Date(t.completed_on);
    return completedDate >= today;
  }).length;

  const completedThisWeek = tasks.filter((t) => {
    if (t.status !== "completed" || !t.completed_on) return false;
    const completedDate = new Date(t.completed_on);
    return completedDate >= weekAgo;
  }).length;

  const completedThisMonth = tasks.filter((t) => {
    if (t.status !== "completed" || !t.completed_on) return false;
    const completedDate = new Date(t.completed_on);
    return completedDate >= monthAgo;
  }).length;

  const totalCompleted = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Calculate streak (consecutive days with activity)
  const activeDays = new Set<string>();
  tasks.forEach((t) => {
    const dateStr = new Date(t.created_at).toISOString().split("T")[0];
    activeDays.add(dateStr);
  });

  let currentStreak = 0;
  let checkDate = new Date(today);
  const daysArray = Array.from(activeDays).sort().reverse();

  for (const dayStr of daysArray) {
    const dayDate = new Date(dayStr);
    if (checkDate.toISOString().split("T")[0] === dayStr) {
      currentStreak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else if (dayDate < checkDate) {
      break;
    }
  }

  // Tasks by hour
  const hourCounts: { [key: number]: number } = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  tasks.forEach((t) => {
    const hour = new Date(t.created_at).getHours();
    hourCounts[hour]++;
  });

  const tasksByHour = Object.entries(hourCounts).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }));

  // Status breakdown
  const statusBreakdown = {
    dump: tasks.filter((t) => t.status === "dump").length,
    scheduled: tasks.filter((t) => t.status === "scheduled").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
    archived: tasks.filter((t) => t.status === "archived").length,
  };

  return {
    completedToday,
    completedThisWeek,
    completedThisMonth,
    completionRate,
    totalTasks,
    totalCompleted,
    currentStreak,
    tasksByHour,
    statusBreakdown,
  };
}
