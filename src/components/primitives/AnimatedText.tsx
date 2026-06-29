import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { textReveal, viewportOnce } from "@/lib/animations";
import type { ElementType } from "react";

interface AnimatedTextProps {
  text: string;
  /** Reveal granularity. "line" splits on \n, "word" on spaces. */
  by?: "word" | "line";
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Reveals text per word or per line with a masked upward slide. Each fragment
 * is wrapped in an overflow-hidden span so glyphs rise into view cleanly.
 * The full string is exposed to screen readers via aria-label; fragments are
 * decorative.
 */
export function AnimatedText({
  text,
  by = "word",
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.08,
}: AnimatedTextProps) {
  const fragments = by === "line" ? text.split("\n") : text.split(" ");
  const MotionTag = motion(Tag);

  return (
    <MotionTag
      className={cn(by === "line" && "flex flex-col", className)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {fragments.map((frag, i) => (
        <span key={i} aria-hidden className={by === "word" ? "inline" : "block"}>
          <span
            className={cn(
              "overflow-hidden pb-[0.08em]",
              by === "word" ? "inline-flex" : "block"
            )}
          >
            <motion.span variants={textReveal} className="inline-block">
              {frag}
            </motion.span>
          </span>
          {by === "word" && i < fragments.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionTag>
  );
}
