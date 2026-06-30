"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface KineticWordProps {
  text: string;
  className?: string;
  /** Horizontal drift across the scroll range (CSS lengths or %). */
  from?: string;
  to?: string;
  /** Direction of travel. */
  direction?: "ltr" | "rtl";
}

/**
 * A huge editorial word that drifts horizontally as its section scrolls — the
 * "CONFIDENCE / PRECISION" agency signature, rendered as a faint background
 * layer in the warm palette. Decorative (aria-hidden), transform-only.
 */
export function KineticWord({
  text,
  className,
  from = "-8%",
  to = "8%",
  direction = "rtl",
}: KineticWordProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const [a, b] = direction === "rtl" ? [from, to] : [to, from];
  const x = useTransform(scrollYProgress, [0, 1], [a, b]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 select-none overflow-hidden",
        className
      )}
    >
      <motion.span
        style={{ x }}
        className="block whitespace-nowrap text-center font-display font-black uppercase leading-none tracking-tight"
      >
        {text}
      </motion.span>
    </div>
  );
}
