"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce, EASE } from "@/lib/animations";

type Tone = "cream" | "paper" | "ink" | "clay";

const toneClass: Record<Tone, string> = {
  cream: "bg-ivory text-ink",
  paper: "texture-paper text-ink",
  ink: "bg-ink text-ivory on-dark",
  clay: "bg-clay text-white on-dark",
};

interface SectionWrapperProps {
  id: string;
  ariaLabel?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  kicker?: string;
  title?: ReactNode;
  intro?: ReactNode;
  /** Rendered at section root (outside container) — use for KineticWord, etc. */
  decorative?: ReactNode;
  children: ReactNode;
}

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
      decorative,
      children,
    },
    ref
  ) {
    const hasHeader = kicker || title || intro;
    const titleLines =
      typeof title === "string" ? title.split("\n") : null;

    return (
      <section
        id={id}
        ref={ref}
        aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
        className={cn(
          "relative scroll-mt-[72px] overflow-hidden py-20 sm:py-28 lg:py-32",
          toneClass[tone],
          className
        )}
      >
        {decorative}
        <div className={cn("container relative", containerClassName)}>
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

              {/* Per-line masked slide-up for string titles */}
              {titleLines ? (
                <h2
                  className="text-fluid-h2 font-bold leading-tight"
                  aria-label={title as string}
                >
                  {titleLines.map((line, i) => (
                    <span key={i} className="block overflow-hidden">
                      <motion.span
                        className="block"
                        variants={{
                          hidden: { y: "115%", skewY: 3, opacity: 0 },
                          show: {
                            y: "0%",
                            skewY: 0,
                            opacity: 1,
                            transition: {
                              duration: 0.88,
                              ease: EASE,
                              delay: 0.08 + i * 0.14,
                            },
                          },
                        }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h2>
              ) : (
                title && (
                  <motion.h2
                    variants={fadeUp}
                    className="whitespace-pre-line text-fluid-h2 font-bold leading-tight"
                  >
                    {title}
                  </motion.h2>
                )
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
