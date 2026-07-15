"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateAnalytics, type AnalyticsMetrics } from "@/lib/analytics";
import { listTasks } from "@/services/tasksService";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const tasks = await listTasks();
        const analytics = calculateAnalytics(tasks);
        setMetrics(analytics);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-dvh flex-col bg-background">
        <header className="flex h-14 items-center gap-3 px-4">
          <Link href="/" className="rounded-lg p-2 hover:bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">Analytics</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </main>
    );
  }

  if (!metrics) {
    return (
      <main className="flex min-h-dvh flex-col bg-background">
        <header className="flex h-14 items-center gap-3 px-4">
          <Link href="/" className="rounded-lg p-2 hover:bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">Analytics</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </main>
    );
  }

  const statuses = [
    { label: "Dump", value: metrics.statusBreakdown.dump, color: "text-blue-500" },
    { label: "Scheduled", value: metrics.statusBreakdown.scheduled, color: "text-purple-500" },
    { label: "In Progress", value: metrics.statusBreakdown.in_progress, color: "text-green-500" },
    { label: "Completed", value: metrics.statusBreakdown.completed, color: "text-emerald-500" },
    { label: "Cancelled", value: metrics.statusBreakdown.cancelled, color: "text-red-500" },
    { label: "Archived", value: metrics.statusBreakdown.archived, color: "text-gray-500" },
  ];

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4">
        <Link href="/" className="rounded-lg p-2 hover:bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Analytics</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 pb-16">
        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-card p-4 neu-raised">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="mt-2 text-2xl font-bold">{metrics.completedToday}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised">
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="mt-2 text-2xl font-bold">{metrics.completedThisWeek}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised">
            <p className="text-xs text-muted-foreground">Completion</p>
            <p className="mt-2 text-2xl font-bold">{metrics.completionRate}%</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{metrics.currentStreak}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div
          className="rounded-2xl bg-card p-4 neu-raised"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 text-sm font-semibold">Task Status Breakdown</h2>
          <div className="grid grid-cols-2 gap-3">
            {statuses.map((status) => (
              <div key={status.label} className="rounded-lg bg-background p-3">
                <p className="text-xs text-muted-foreground">{status.label}</p>
                <p className={`mt-2 text-xl font-bold ${status.color}`}>{status.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="space-y-3 rounded-2xl bg-card p-4 neu-raised"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Total Tasks</span>
              <span className="font-medium">{metrics.totalTasks}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">{metrics.totalCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-medium">{metrics.completedThisMonth}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
