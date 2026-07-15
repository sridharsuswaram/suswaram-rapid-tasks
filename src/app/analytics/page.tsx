"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Flame, TrendingUp, CheckCircle2 } from "lucide-react";
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
    { label: "Dump", value: metrics.statusBreakdown.dump, color: "#3b82f6" },
    { label: "Scheduled", value: metrics.statusBreakdown.scheduled, color: "#a855f7" },
    { label: "In Progress", value: metrics.statusBreakdown.in_progress, color: "#10b981" },
    { label: "Completed", value: metrics.statusBreakdown.completed, color: "#34d399" },
    { label: "Cancelled", value: metrics.statusBreakdown.cancelled, color: "#ef4444" },
    { label: "Archived", value: metrics.statusBreakdown.archived, color: "#9ca3af" },
  ];

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4">
        <Link href="/" className="rounded-lg p-2 hover:bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Analytics</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 pb-16 sm:max-w-2xl sm:mx-auto sm:w-full">
        {/* Hero Metric - Completion Rate */}
        <motion.div
          className="rounded-3xl bg-card p-8 neu-raised text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-5xl font-bold">{metrics.completionRate}%</p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {metrics.totalCompleted} of {metrics.totalTasks} tasks completed
          </p>
        </motion.div>

        {/* Three Equal Metric Cards */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl bg-card p-4 neu-raised text-center">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="mt-3 text-3xl font-bold text-blue-500">{metrics.completedToday}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised text-center">
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="mt-3 text-3xl font-bold text-purple-500">{metrics.completedThisWeek}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised text-center">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="mt-1 text-3xl font-bold text-orange-500">{metrics.currentStreak}</p>
          </div>
        </motion.div>

        {/* Status Breakdown - Single Column List */}
        <motion.div
          className="rounded-2xl bg-card p-5 neu-raised"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold mb-4">Tasks by Status</h2>
          <div className="space-y-3">
            {statuses.map((status) => (
              <div key={status.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm">{status.label}</span>
                </div>
                <span className="font-semibold text-sm">{status.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="rounded-2xl bg-card p-5 neu-raised"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Tasks</span>
              <span className="font-semibold">{metrics.totalTasks}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-semibold">{metrics.completedThisMonth}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
