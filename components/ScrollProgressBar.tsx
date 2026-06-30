"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin clay scroll-progress bar fixed at the very top of the viewport. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "left" }}
      className="pointer-events-none fixed top-0 z-[100] h-[2px] w-full origin-left bg-clay"
    />
  );
}
