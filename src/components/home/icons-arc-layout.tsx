"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function IconsArcLayout() {
  const icons = [
    { href: "/settings", emoji: "⚙️", label: "Settings" },
    { href: "/dump", emoji: "🧸", label: "Brain Dump" },
    { href: "/today", emoji: "🐇", label: "Today" },
    { href: "/calendar", emoji: "🕊️", label: "Ahead" },
    { href: "/analytics", emoji: "💡", label: "Insights" },
  ];

  return (
    <motion.div
      className="flex flex-wrap gap-4 sm:gap-8 justify-center mt-6 px-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {icons.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.08, duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <Link
            href={item.href}
            className="flex flex-col items-center gap-2 w-16 sm:w-20"
          >
            <motion.span
              className="text-4xl sm:text-5xl cursor-pointer block"
              whileHover={{ scale: 1.25, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {item.emoji}
            </motion.span>
            <span className="text-xs font-medium text-muted-foreground text-center line-clamp-2">
              {item.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
