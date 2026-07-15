"use client";

import { motion } from "framer-motion";
import { CalendarDays, Inbox, ListChecks, Settings } from "lucide-react";
import { MenuShortcut } from "./menu-shortcut";

const ICONS = [
  { href: "/settings", icon: Settings, label: "Settings", angle: 150 },
  { href: "/dump", icon: Inbox, label: "Task Dump", angle: 210 },
  { href: "/calendar", icon: CalendarDays, label: "Date View", angle: 330 },
  { href: "/today", icon: ListChecks, label: "Today", angle: 30 },
];

const ARC_RADIUS = 90;
const CENTER_X = 0;
const CENTER_Y = 0;

export function IconsArcLayout() {
  const calculatePosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: ARC_RADIUS * Math.cos(rad),
      y: ARC_RADIUS * Math.sin(rad),
    };
  };

  return (
    <div className="relative h-72 w-full flex items-center justify-center">
      {/* Central MIC button placeholder - actual MicButton sits above this */}
      <div className="absolute pointer-events-none" />

      {/* Arc icons container */}
      {ICONS.map((item, idx) => {
        const pos = calculatePosition(item.angle);

        return (
          <motion.div
            key={item.label}
            className="absolute"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: idx * 0.1,
              duration: 0.4,
              ease: "easeOut",
            }}
            style={{
              x: pos.x,
              y: pos.y,
            }}
            whileHover={{
              scale: 1.15,
              y: pos.y - 8,
              transition: { duration: 0.2 },
            }}
          >
            <MenuShortcut href={item.href} icon={item.icon} label={item.label} />
          </motion.div>
        );
      })}
    </div>
  );
}
