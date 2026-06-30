"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Magnetic cursor glow — a fast ring + slow aura blob that follow the pointer.
 * Scales up on interactive targets. Desktop-only, aria-hidden, pointer-events-none.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const hovering = useMotionValue(0);

  // Fast ring chases cursor closely
  const rx = useSpring(mx, { stiffness: 420, damping: 28, mass: 0.5 });
  const ry = useSpring(my, { stiffness: 420, damping: 28, mass: 0.5 });

  // Slow aura blob lags behind
  const ax = useSpring(mx, { stiffness: 55, damping: 18, mass: 1.2 });
  const ay = useSpring(my, { stiffness: 55, damping: 18, mass: 1.2 });

  // Ring expands on interactive elements
  const ringScale = useSpring(useTransform(hovering, [0, 1], [1, 2.8]), {
    stiffness: 260,
    damping: 22,
  });

  useEffect(() => {
    if (reduce) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      hovering.set(el.closest("a,button,[role=button]") ? 1 : 0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduce, mx, my, hovering]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998] select-none hidden md:block"
    >
      {/* Large slow-following aura */}
      <motion.div
        style={{ x: ax, y: ay, translateX: "-50%", translateY: "-50%" }}
        className="absolute h-[420px] w-[420px] rounded-full bg-clay/[0.06] blur-3xl"
      />
      {/* Fast cursor ring */}
      <motion.div
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
        }}
        className="absolute h-5 w-5 rounded-full border border-clay/55 transition-[border-color] duration-200"
      />
    </div>
  );
}
