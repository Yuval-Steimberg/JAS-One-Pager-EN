import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /** Pixels of vertical travel across the scroll range. Negative = up. */
  amount?: number;
  className?: string;
  axis?: "y" | "x";
}

/**
 * Wraps content and moves it at a different speed than the page scroll to create
 * depth. Transform-only. Use small amounts (20–80px) for a premium, subtle feel.
 */
export function ParallaxSection({
  children,
  amount = 60,
  className,
  axis = "y",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const move = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={axis === "y" ? { y: move } : { x: move }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * A free-floating decorative shape (recycled-material motif) that drifts on
 * scroll. Purely decorative — aria-hidden.
 */
export function FloatingShape({
  className,
  amount = 80,
}: {
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.span
      ref={ref}
      aria-hidden
      style={{ y }}
      className={cn("pointer-events-none absolute block rounded-full", className)}
    />
  );
}
