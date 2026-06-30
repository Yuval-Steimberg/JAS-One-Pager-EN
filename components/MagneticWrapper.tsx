"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Magnetic pull — the wrapped element drifts toward the cursor when hovered.
 * Desktop-only; on touch devices the pointer never moves so no effect fires.
 */
export function MagneticWrapper({
  children,
  strength = 0.35,
  className,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = { stiffness: 180, damping: 16, mass: 0.12 };
  const x = useSpring(useMotionValue(0), cfg);
  const y = useSpring(useMotionValue(0), cfg);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
