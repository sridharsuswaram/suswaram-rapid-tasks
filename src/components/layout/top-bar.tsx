"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, backHref, right, className }: TopBarProps) {
  const router = useRouter();

  return (
    <header className={cn("flex h-14 shrink-0 items-center justify-between px-4", className)}>
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link href={backHref} className="text-2xl hover:scale-110 transition-transform" aria-label="Home">
            🏠
          </Link>
        ) : (
          <button onClick={() => router.back()} className="text-2xl hover:scale-110 transition-transform" aria-label="Home">
            🏠
          </button>
        )}
        {title && <h1 className="text-base font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-1">{right}</div>
    </header>
  );
}
