import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 64" className={className} aria-hidden="true" fill="none">
      <g className="text-primary">
        <rect x="8" y="8" width="18" height="34" rx="9" fill="currentColor" />
        <path
          d="M2 28a15 15 0 0 0 30 0"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="17"
          y1="43"
          x2="17"
          y2="56"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <g className="text-brand-orange" fill="currentColor">
        <rect x="42" y="20" width="7" height="24" rx="3.5" />
        <rect x="56" y="8" width="7" height="48" rx="3.5" />
        <rect x="70" y="24" width="7" height="16" rx="3.5" />
      </g>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-auto", markClassName)} />
      {showWordmark && (
        <span className={cn("text-2xl font-bold tracking-tight", wordmarkClassName)}>
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
