"use client";

import { motion } from "framer-motion";
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
        <header className="flex h-14 items-center gap-4 px-6">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">
            🏠
          </Link>
          <h1 className="text-lg font-semibold">Analytics</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!metrics) {
    return (
      <main className="flex min-h-dvh flex-col bg-background">
        <header className="flex h-14 items-center gap-4 px-6">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">
            🏠
          </Link>
          <h1 className="text-lg font-semibold">Analytics</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No data</p>
        </div>
      </main>
    );
  }

  const statuses = [
    { label: "Dump", value: metrics.statusBreakdown.dump, emoji: "📦" },
    { label: "Scheduled", value: metrics.statusBreakdown.scheduled, emoji: "🗓️" },
    { label: "In Progress", value: metrics.statusBreakdown.in_progress, emoji: "⚡" },
    { label: "Completed", value: metrics.statusBreakdown.completed, emoji: "✅" },
    { label: "Cancelled", value: metrics.statusBreakdown.cancelled, emoji: "❌" },
    { label: "Archived", value: metrics.statusBreakdown.archived, emoji: "📚" },
  ];

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4">
        <Link href="/" className="text-2xl hover:scale-110 transition-transform">
          🏠
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
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🎯</span>
            <span className="text-4xl">Completion</span>
          </div>
          <p className="text-5xl font-bold mt-4">{metrics.completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-4">
            {metrics.totalCompleted} of {metrics.totalTasks} tasks done ✨
          </p>
        </motion.div>

        {/* Three Metric Cards with Emoji */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl bg-card p-4 neu-raised text-center">
            <span className="text-3xl block mb-2">☀️</span>
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="mt-2 text-2xl font-bold">{metrics.completedToday}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised text-center">
            <span className="text-3xl block mb-2">📈</span>
            <p className="text-xs text-muted-foreground">Week</p>
            <p className="mt-2 text-2xl font-bold">{metrics.completedThisWeek}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 neu-raised text-center">
            <span className="text-3xl block mb-2">🔥</span>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="mt-2 text-2xl font-bold">{metrics.currentStreak}</p>
          </div>
        </motion.div>

        {/* Status Breakdown with Emoji */}
        <motion.div
          className="rounded-2xl bg-card p-5 neu-raised"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-sm font-semibold">Tasks by Status</h2>
          </div>
          <div className="space-y-3">
            {statuses.map((status) => (
              <div key={status.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-background transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{status.emoji}</span>
                  <span className="text-sm font-medium">{status.label}</span>
                </div>
                <span className="font-bold text-lg">{status.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Summary Stats with Emoji */}
        <motion.div
          className="rounded-2xl bg-card p-5 neu-raised"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📋</span>
            <h2 className="text-sm font-semibold">Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-background transition-colors">
              <span className="text-muted-foreground">📌 Total Tasks</span>
              <span className="font-semibold">{metrics.totalTasks}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3 p-2 rounded-lg hover:bg-background transition-colors">
              <span className="text-muted-foreground">🌙 This Month</span>
              <span className="font-semibold">{metrics.completedThisMonth}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
