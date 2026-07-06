"use client";

const BAR_DELAYS = [0, 0.12, 0.24, 0.36, 0.48, 0.36, 0.24, 0.12, 0];

export function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex h-8 items-center justify-center gap-1" aria-hidden="true">
      {BAR_DELAYS.map((delay, i) => (
        <span
          key={i}
          className={
            active
              ? "w-1 h-full rounded-full bg-primary animate-waveform-bar"
              : "w-1 h-1.5 rounded-full bg-border"
          }
          style={active ? { animationDelay: `${delay}s` } : undefined}
        />
      ))}
    </div>
  );
}
