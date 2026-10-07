"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { motionDurations, motionEase } from "@/lib/motion";

function availabilityItems(value: string) {
  const withoutPrefix = value.replace(/^\s*open\s+to\s+/i, "");
  const items = withoutPrefix
    .split(/(?:\r?\n|\||;|,|\s+and\s+)/i)
    .map((item) => item.replace(/^\s*and\s+/i, "").trim())
    .filter(Boolean);
  return items.length ? items : [value];
}

export function AvailabilityTicker({ value }: { value: string }) {
  const reduced = useReducedMotion();
  const items = useMemo(() => availabilityItems(value), [value]);
  const [index, setIndex] = useState(0);
  const longest = [...items].sort((a, b) => b.length - a.length)[0];
  const activeIndex = index % items.length;

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 2600);
    return () => window.clearInterval(timer);
  }, [items, reduced]);

  if (reduced || items.length < 2) return <span className="profile-availability"><i aria-hidden="true" /><span>{value}</span></span>;

  return <span className="profile-availability" title={value}>
    <span className="sr-only">{value}</span>
    <i aria-hidden="true" />
    <span className="availability-ticker-prefix" aria-hidden="true">Open to</span>
    <span className="availability-ticker-window" aria-hidden="true">
      <span className="availability-ticker-sizer">{longest}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${items[activeIndex]}-${activeIndex}`}
          className="availability-ticker-item"
          initial={{ opacity: 0, x: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -14, filter: "blur(4px)" }}
          transition={{ duration: motionDurations.component, ease: motionEase }}
        >{items[activeIndex]}</motion.span>
      </AnimatePresence>
    </span>
    <span className="availability-ticker-count" aria-hidden="true">{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
  </span>;
}
