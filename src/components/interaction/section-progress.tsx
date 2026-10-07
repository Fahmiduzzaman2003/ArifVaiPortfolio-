"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";

export function SectionProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, spring.gentle);
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-[var(--lab-cyan)]" style={{ scaleX }} />;
}
