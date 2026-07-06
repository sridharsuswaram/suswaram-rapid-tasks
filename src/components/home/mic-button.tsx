"use client";

import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function MicButton({ isRecording, onClick, disabled }: MicButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isRecording}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      className={cn(
        "relative flex size-[140px] shrink-0 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-50",
        "shadow-soft-lg active:scale-[0.97]",
        isRecording
          ? "bg-brand-orange text-brand-orange-foreground animate-mic-glow"
          : "bg-primary text-primary-foreground"
      )}
    >
      {isRecording ? <Square className="size-11" fill="currentColor" /> : <Mic className="size-14" />}
    </button>
  );
}
