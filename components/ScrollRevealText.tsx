"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

/**
 * Long-form paragraph whose words brighten from faint to full as the block
 * scrolls through the viewport — an editorial "read-along" effect. Opacity-only,
 * so it's cheap and reduced-motion friendly (the MotionConfig in App neutralises
 * the per-word tween, leaving readable text).
 */
export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className={cn(
        // Plain block (not flex) so the browser's bidi algorithm keeps mixed
        // Hebrew/Latin runs (e.g. "Just A Second") in the correct visual order.
        "text-balance text-2xl font-medium leading-snug sm:text-3xl md:text-4xl",
        className
      )}
      aria-label={text}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span aria-hidden style={{ opacity }} className="inline">
        {children}
      </motion.span>{" "}
    </>
  );
}