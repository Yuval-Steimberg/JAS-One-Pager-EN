"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/animations";

export interface StoryStep {
  id?: string;
  image: string;
  alt: string;
  content: ReactNode;
}

interface StickyStorySectionProps {
  steps: StoryStep[];
  className?: string;
  /** Which side the pinned media sits on (logical, RTL-aware). */
  mediaSide?: "start" | "end";
  ratio?: string;
}

/**
 * Sticky storytelling: a media pane pins to the viewport while step blocks
 * scroll past it. The pinned image crossfades to the step currently in focus,
 * and a progress rail fills as you go.
 *
 * On small screens it gracefully degrades to a simple stacked timeline (each
 * step shows its own image), avoiding fragile sticky behaviour on mobile.
 */
export function StickyStorySection({
  steps,
  className,
  mediaSide = "start",
  ratio = "4/5",
}: StickyStorySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(steps.length - 1, Math.floor(v * steps.length));
    setActive(idx < 0 ? 0 : idx);
  });

  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative grid gap-x-12 lg:grid-cols-2",
        mediaSide === "end" && "lg:[direction:ltr]",
        className
      )}
    >
      {/* ── Pinned media (desktop only) ── */}
      <div
        className={cn(
          "hidden lg:block",
          mediaSide === "end" ? "lg:order-2" : "lg:order-1"
        )}
      >
        <div
          className="sticky top-24 overflow-hidden rounded-xl2 shadow-lift"
          style={{ aspectRatio: ratio }}
        >
          {steps.map((step, i) => (
            <motion.img
              key={i}
              src={step.image}
              alt={step.alt}
              loading="lazy"
              decoding="async"
              initial={false}
              animate={{
                opacity: active === i ? 1 : 0,
                scale: active === i ? 1 : 1.06,
              }}
              transition={spring}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ))}
          {/* progress rail */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              style={{ width: railHeight }}
              className="h-full bg-clay"
            />
          </div>
        </div>
      </div>

      {/* ── Steps ── */}
      <ol
        className={cn(
          "space-y-6 lg:space-y-[42vh] lg:py-[12vh] [direction:rtl]",
          mediaSide === "end" ? "lg:order-1" : "lg:order-2"
        )}
      >
        {steps.map((step, i) => (
          <motion.li
            key={i}
            id={step.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "transition-opacity duration-500",
              "lg:[&]:opacity-100",
              // dim non-active steps on desktop for focus
              "lg:data-[active=false]:opacity-40"
            )}
            data-active={active === i}
          >
            {/* mobile inline image */}
            <div
              className="mb-4 overflow-hidden rounded-lg shadow-soft lg:hidden"
              style={{ aspectRatio: "16/10" }}
            >
              <img
                src={step.image}
                alt={step.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            {step.content}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}