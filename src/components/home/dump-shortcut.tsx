"use client";

import { Inbox } from "lucide-react";
import Link from "next/link";

export function DumpShortcut() {
  return (
    <Link
      href="/dump"
      aria-label="Open Task Dump"
      className="neu-pressable flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 rounded-2xl"
    >
      <span className="neu-raised-sm flex size-14 items-center justify-center rounded-full bg-background text-primary">
        <Inbox className="size-6" />
      </span>
      <span className="text-xs font-medium text-muted-foreground">Task Dump</span>
    </Link>
  );
}
