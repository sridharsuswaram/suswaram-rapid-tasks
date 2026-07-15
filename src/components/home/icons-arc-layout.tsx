"use client";

import { motion } from "framer-motion";
import { CalendarDays, Inbox, ListChecks, Settings } from "lucide-react";
import { MenuShortcut } from "./menu-shortcut";

export function IconsArcLayout() {
  const icons = [
    { href: "/settings", icon: Settings, label: "Settings", color: "#2563eb" },
    { href: "/dump", icon: Inbox, label: "Task Dump", color: "#9333ea" },
    { href: "/today", icon: ListChecks, label: "Today", color: "#16a34a" },
    { href: "/calendar", icon: CalendarDays, label: "Date View", color: "#d97706" },
  ];

  return (
    <motion.div
      className="flex gap-4 mt-6 flex-nowrap justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {icons.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
        >
          <MenuShortcut href={item.href} icon={item.icon} label={item.label} color={item.color} />
        </motion.div>
      ))}
    </motion.div>
  );
}
