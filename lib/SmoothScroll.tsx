"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Single shared instance so anchor navigation (smoothScroll.ts) can drive it.
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/**
 * Site-wide buttery momentum scrolling (the "premium agency" feel). Drives the
 * real window scroll position, so Framer's useScroll, IntersectionObserver and
 * the hero's getBoundingClientRect scrub all keep working. Disabled entirely for
 * reduced-motion users.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      // gentle exponential ease-out
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
