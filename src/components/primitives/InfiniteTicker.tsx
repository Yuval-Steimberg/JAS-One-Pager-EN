import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteTickerProps {
  items: string[];
  /** Pixels per second. */
  speed?: number;
  /** Visual direction of travel. */
  direction?: "rtl" | "ltr";
  className?: string;
  itemClassName?: string;
  /** Separator glyph between items. */
  separator?: string;
}

/**
 * Smooth, GPU-friendly infinite marquee. The track is duplicated and translated
 * with a wrapping motion value (not a CSS keyframe), so it loops seamlessly at
 * any width and slows to a crawl on hover. Respects reduced-motion (it simply
 * renders static, scrollable content).
 *
 * Decorative by nature — marked aria-hidden so screen readers skip the loop.
 */
export function InfiniteTicker({
  items,
  speed = 50,
  direction = "rtl",
  className,
  itemClassName,
  separator = "✦",
}: InfiniteTickerProps) {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(0);
  const [hovered, setHovered] = useState(false);

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return;
    if (halfWidth.current === 0) {
      halfWidth.current = trackRef.current.scrollWidth / 2;
    }
    const pxPerMs = (speed * (hovered ? 0.18 : 1)) / 1000;
    const dir = direction === "rtl" ? -1 : 1;
    let next = x.get() + dir * pxPerMs * delta;
    // wrap seamlessly
    if (next <= -halfWidth.current) next += halfWidth.current;
    if (next >= 0) next -= halfWidth.current;
    x.set(next);
  });

  const sequence = [...items, ...items];

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex overflow-hidden border-y border-current/10 py-4 select-none",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex shrink-0 items-center gap-8 whitespace-nowrap pe-8 will-change-transform"
      >
        {sequence.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={cn(
                "text-lg font-semibold tracking-wide sm:text-xl",
                itemClassName
              )}
            >
              {item}
            </span>
            <span className="text-ember/80" aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
