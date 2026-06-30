"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

type Tone = "cream" | "paper" | "ink" | "clay";

const toneClass: Record<Tone, string> = {
  cream: "bg-ivory text-ink",
  paper: "texture-paper text-ink",
  ink: "bg-ink text-ivory on-dark",
  clay: "bg-clay text-white on-dark",
};

interface SectionWrapperProps {
  id: string;
  /** Accessible label for the <section> landmark (defaults to title). */
  ariaLabel?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  /** Optional centred header rendered with a staggered reveal. */
  kicker?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Semantic, accessible section landmark with consistent vertical rhythm, brand
 * tones (incl. paper texture) and an optional animated header.
 */
export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  function SectionWrapper(
    {
      id,
      ariaLabel,
      tone = "cream",
      className,
      containerClassName,
      kicker,
      title,
      intro,
      children,
    },
    ref
  ) {
    const hasHeader = kicker || title || intro;
    return (
      <section
        id={id}
        ref={ref}
        aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
        className={cn(
          "scroll-mt-[72px] py-20 sm:py-28 lg:py-32",
          toneClass[tone],
          className
        )}
      >
        <div className={cn("container", containerClassName)}>
          {hasHeader && (
            <motion.header
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
            >
              {kicker && (
                <motion.p variants={fadeUp} className="section-kicker mb-3">
                  {kicker}
                </motion.p>
              )}
              {title && (
                <motion.h2
                  variants={fadeUp}
                  className="whitespace-pre-line text-fluid-h2 font-bold leading-tight"
                >
                  {title}
                </motion.h2>
              )}
              {intro && (
                <motion.p
                  variants={fadeUp}
                  className="mt-5 text-base leading-relaxed opacity-70 sm:text-lg"
                >
                  {intro}
                </motion.p>
              )}
            </motion.header>
          )}
          {children}
        </div>
      </section>
    );
  }
);