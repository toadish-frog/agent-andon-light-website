"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/app/utils/usePrefersReducedMotion";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/** Fades/slides a section in as it enters the viewport; a no-op when the visitor prefers reduced motion. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
