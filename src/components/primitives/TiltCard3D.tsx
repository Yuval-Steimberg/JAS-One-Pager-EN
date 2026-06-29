import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep small (6–10) for an elegant, non-gimmicky feel. */
  max?: number;
  /** Lift toward the viewer on hover, in px. */
  lift?: number;
  /** Subtle glare highlight that follows the cursor. */
  glare?: boolean;
}

/**
 * Elegant pointer-driven 3D tilt. Uses rotateX/rotateY around the card centre
 * with spring smoothing, plus an optional soft glare. Disabled entirely for
 * touch (no hover) and reduced-motion users.
 */
export function TiltCard3D({
  children,
  className,
  max = 8,
  lift = 6,
  glare = true,
}: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 18,
  });

  const glareBg = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`
  );

  function handleMove(e: React.PointerEvent) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  if (reduce) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ perspective: 900 }}
      className={cn("group/tilt relative [transform-style:preserve-3d]", className)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ z: lift }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
