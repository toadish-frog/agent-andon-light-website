"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/app/utils/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type StripState = "idle" | "working" | "waiting" | "compacting";

interface Frame {
  state: StripState;
  /** Only meaningful when state === "compacting": how many of pixels 2-10 are lit so far. */
  compactCount: number;
  durationMs: number;
}

// Real pixel layout (device/docs/USER-GUIDE.md "Pixel Layout"): pixel 1 is an
// always-on status LED; pixels 2-10 are indices 1-9 below.
const STATUS_INDEX = 0;
const GREEN_INDICES = [1, 2, 3]; // pixels 2-4
const YELLOW_INDICES = [4, 5, 6]; // pixels 5-7
const RED_INDICES = [7, 8, 9]; // pixels 8-10
const COMPACT_STEPS = 9; // pixels 2-10

const COMPACT_STEP_MS = 140;

// One full lap: idle -> working -> waiting -> compacting (chase-fill) -> repeat.
// Mirrors the real wire protocol's state set (G/Y/R/C) and the firmware's
// pixel layout — this is a stylized approximation of the chase-fill timing,
// not literal firmware frame data.
const FRAMES: Frame[] = [
  { state: "idle", compactCount: 0, durationMs: 2400 },
  { state: "working", compactCount: 0, durationMs: 2400 },
  { state: "waiting", compactCount: 0, durationMs: 2400 },
  ...Array.from({ length: COMPACT_STEPS }, (_, i) => ({
    state: "compacting" as const,
    compactCount: i + 1,
    durationMs: COMPACT_STEP_MS,
  })),
  { state: "compacting", compactCount: COMPACT_STEPS, durationMs: 500 },
];

const STATIC_FRAME_INDEX = 1; // "working" — shown when motion is reduced.

function pixelClassName(index: number, frame: Frame): string {
  if (index === STATUS_INDEX) {
    return "bg-neutral-400 dark:bg-neutral-500";
  }

  const isLit =
    (frame.state === "working" && GREEN_INDICES.includes(index)) ||
    (frame.state === "waiting" && YELLOW_INDICES.includes(index)) ||
    (frame.state === "idle" && RED_INDICES.includes(index)) ||
    (frame.state === "compacting" && index <= frame.compactCount);

  if (!isLit) {
    return "bg-neutral-200 dark:bg-neutral-800";
  }

  // Text color is set alongside background so the glow (which uses
  // `currentColor`) matches the pixel's lit color.
  if (frame.state === "waiting") return "bg-status-waiting text-status-waiting";
  if (frame.state === "idle") return "bg-status-idle text-status-idle";
  // "working" and "compacting" (chase-fill) both read as green — matches the
  // real firmware, where compacting is a flashing-green pattern.
  return "bg-status-working text-status-working";
}

export function LiveStatusStrip({
  labels,
  ariaLabel,
  className,
}: {
  labels: { working: string; waiting: string; idle: string; compacting: string };
  ariaLabel: string;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      setFrameIndex((i) => (i + 1) % FRAMES.length);
    }, FRAMES[frameIndex]?.durationMs ?? 2400);

    return () => clearTimeout(timer);
  }, [frameIndex, prefersReducedMotion]);

  const frame = FRAMES[prefersReducedMotion ? STATIC_FRAME_INDEX : frameIndex] ?? FRAMES[0]!;
  const label = labels[frame.state];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        role="img"
        aria-label={ariaLabel}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/40"
      >
        {Array.from({ length: 10 }, (_, index) => {
          const isLit = index !== STATUS_INDEX && pixelClassName(index, frame).startsWith("bg-status");
          return (
            <motion.span
              key={index}
              aria-hidden="true"
              animate={{ scale: isLit ? 1 : 0.85 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors duration-200",
                pixelClassName(index, frame),
              )}
              style={
                isLit
                  ? { boxShadow: "0 0 6px 1px currentColor" }
                  : undefined
              }
            />
          );
        })}
      </div>
      <span className="font-mono text-xs tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
    </div>
  );
}
