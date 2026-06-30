"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface ZoomScrollImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Wrapper aspect ratio, e.g. "4/5", "16/9". Prevents layout shift. */
  ratio?: string;
  /** [start, end] scale mapped across the scroll range. */
  zoom?: [number, number];
  /** Scroll offset range for useScroll. */
  scrollRange?: [string, string];
  /** Direction of the zoom over scroll. */
  direction?: "in" | "out";
  loading?: "lazy" | "eager";
  priority?: boolean;
  children?: React.ReactNode;
  overlayClassName?: string;
}

/**
 * Cinematic scroll-linked zoom on an image. The image is over-sized inside an
 * overflow-hidden, fixed-ratio frame so scaling never causes layout shift and
 * only `transform` animates (GPU-friendly).
 *
 *  <ZoomScrollImage src=… alt=… ratio="4/5" zoom={[1.15, 1]} direction="out" />
 */
export function ZoomScrollImage({
  src,
  alt,
  className,
  ratio = "4/5",
  zoom = [1, 1.12],
  scrollRange = ["start end", "end start"],
  direction = "in",
  loading = "lazy",
  priority = false,
  children,
  overlayClassName,
}: ZoomScrollImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Framer types offset as a tuple of literal edge strings; the prop is a
    // free string tuple, so widen here intentionally.
    offset: scrollRange as never,
  });

  const [from, to] = direction === "in" ? zoom : [zoom[1], zoom[0]];
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : loading}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ scale: scale as MotionValue<number> }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      {children && (
        <div className={cn("absolute inset-0", overlayClassName)}>{children}</div>
      )}
    </div>
  );
}