"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function IconsArcLayout() {
  const icons = [
    { href: "/settings", emoji: "⚙️", label: "Settings" },
    { href: "/dump", emoji: "🧸", label: "Brain Dump" },
    { href: "/today", emoji: "🐇", label: "Today" },
    { href: "/calendar", emoji: "🕊️", label: "Ahead" },
  ];

  return (
    <motion.div
      className="flex flex-wrap gap-8 justify-center mt-8"
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
        >
          <Link
            href={item.href}
            className="flex flex-col items-center gap-2 group"
          >
            <motion.span
              className="text-5xl cursor-pointer"
              whileHover={{ scale: 1.25, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {item.emoji}
            </motion.span>
            <motion.span
              className="text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
