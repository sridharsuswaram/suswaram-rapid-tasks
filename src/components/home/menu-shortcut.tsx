"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuShortcutProps {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function MenuShortcut({ href, icon: Icon, label, className }: MenuShortcutProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "neu-pressable flex flex-col items-center gap-1.5 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        className
      )}
    >
      <span className="neu-raised-sm flex size-13 items-center justify-center rounded-full bg-background text-primary">
        <Icon className="size-5" />
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </Link>
  );
}
