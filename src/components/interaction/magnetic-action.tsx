"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function MagneticAction({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring.responsive);
  const y = useSpring(rawY, spring.responsive);

  function move(event: MouseEvent<HTMLSpanElement>) {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - bounds.left - bounds.width / 2) * 0.14);
    rawY.set((event.clientY - bounds.top - bounds.height / 2) * 0.14);
  }

  return <motion.span onMouseMove={move} onMouseLeave={() => { rawX.set(0); rawY.set(0); }} style={{ x, y }} className={cn("inline-flex", className)}>{children}</motion.span>;
}
