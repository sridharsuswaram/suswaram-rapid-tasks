"use client";

import { motion } from "framer-motion";
import { CalendarDays, Inbox, ListChecks, Settings } from "lucide-react";
import { MenuShortcut } from "./menu-shortcut";

export function IconsArcLayout() {
  const icons = [
    { href: "/settings", icon: Settings, label: "Settings", top: "120px", left: "calc(50% - 110px)" },
    { href: "/dump", icon: Inbox, label: "Task Dump", top: "180px", left: "calc(50% - 70px)" },
    { href: "/calendar", icon: CalendarDays, label: "Date View", top: "180px", left: "calc(50% + 70px)" },
    { href: "/today", icon: ListChecks, label: "Today", top: "120px", left: "calc(50% + 110px)" },
  ];

  return (
    <div className="relative w-full h-80">
      {icons.map((item, idx) => (
        <motion.div
          key={item.label}
          className="absolute"
          style={{ top: item.top, left: item.left, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <MenuShortcut href={item.href} icon={item.icon} label={item.label} />
        </motion.div>
      ))}
    </div>
  );
}
