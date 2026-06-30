"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

/** Counts up from 0 to `to` when it scrolls into view (once). */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  className,
  duration = 1.6,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  const mv = useMotionValue(0);
  const spring = useSpring(mv, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      if (ref.current) ref.current.textContent = `${prefix}${formatNum(to)}${suffix}`;
      return;
    }
    mv.set(to);
  }, [inView, to, mv, reduce, prefix, suffix]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${formatNum(Math.round(v))}${suffix}`;
      }
    });
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}0{suffix}
    </span>
  );
}

function formatNum(n: number) {
  return n.toLocaleString("he-IL");
}