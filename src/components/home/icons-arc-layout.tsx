"use client";

import { motion } from "framer-motion";
import { CalendarDays, Inbox, ListChecks, Settings } from "lucide-react";
import { MenuShortcut } from "./menu-shortcut";

export function IconsArcLayout() {
  const icons = [
    { href: "/settings", icon: Settings, label: "Settings", delay: 0 },
    { href: "/dump", icon: Inbox, label: "Task Dump", delay: 0.1 },
    { href: "/calendar", icon: CalendarDays, label: "Date View", delay: 0.2 },
    { href: "/today", icon: ListChecks, label: "Today", delay: 0.3 },
  ];

  return (
    <div className="flex flex-col items-center gap-6 mt-4">
      {/* Top row - 2 icons */}
      <div className="flex gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: icons[0].delay, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <MenuShortcut {...icons[0]} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: icons[3].delay, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <MenuShortcut {...icons[3]} />
        </motion.div>
      </div>

      {/* Bottom row - 2 icons */}
      <div className="flex gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: icons[1].delay, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <MenuShortcut {...icons[1]} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: icons[2].delay, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <MenuShortcut {...icons[2]} />
        </motion.div>
      </div>
    </div>
  );
}
