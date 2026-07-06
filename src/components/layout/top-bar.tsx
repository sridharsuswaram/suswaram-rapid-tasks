"use client";

import { ArrowLeft } from "lucide-react";
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
      <div className="flex items-center gap-1">
        {backHref ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            nativeButton={false}
            render={
              <Link href={backHref}>
                <ArrowLeft />
              </Link>
            }
          />
        ) : (
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        )}
        {title && <h1 className="text-base font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-1">{right}</div>
    </header>
  );
}
