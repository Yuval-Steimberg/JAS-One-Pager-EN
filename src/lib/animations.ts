/**
 * ────────────────────────────────────────────────────────────────────────────
 *  Reusable Framer Motion animation system
 * ────────────────────────────────────────────────────────────────────────────
 *  A small, consistent vocabulary of variants + spring presets used across the
 *  whole site so motion feels intentional and uniform — never noisy.
 *
 *  All transforms use opacity / translate / scale only (GPU-friendly).
 *  Reduced-motion is handled centrally via <MotionConfig reducedMotion="user">
 *  in App.tsx, which neutralises transform/opacity tweens automatically.
 */
import type { Variants, Transition } from "framer-motion";

/** Editorial easing — matches the CSS cubic-bezier used in the legacy site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 20,
};

/** Default viewport options for whileInView — animate once, when ~25% visible. */
export const viewportOnce = { once: true, amount: 0.25 } as const;

/** Fade + rise. The workhorse reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

/** Parent that staggers its direct children's reveals. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/** Image reveal — scales down from slightly enlarged while fading in. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

/** Per-word / per-line text reveal (used by AnimatedText). */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Card hover lift — pair with whileHover="hover". */
export const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 2px 8px rgba(51,61,54,0.06)" },
  hover: {
    y: -8,
    boxShadow: "0 18px 50px rgba(51,61,54,0.16)",
    transition: spring,
  },
};

export const scaleInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};
