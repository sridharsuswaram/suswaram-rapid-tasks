"use client";

import { Button } from "@/components/ui/button";
import { STATUS_FILTER_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

interface FilterBarProps {
  value: TaskStatus | "all";
  onChange: (value: TaskStatus | "all") => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {STATUS_FILTER_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={value === opt.value ? "default" : "secondary"}
          className={cn("shrink-0 rounded-full", value === opt.value && "neu-sunken-sm")}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
