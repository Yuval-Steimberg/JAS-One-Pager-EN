import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HERO } from "@/content/site";
import { useSmoothScroll, scrollToId } from "@/hooks/useSmoothScroll";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const handleNav = useSmoothScroll();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layered depth: background zooms + drifts slowest, content lifts & fades.
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const btnClass: Record<string, string> = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  return (
    <section
      id="home"
      ref={ref}
      aria-label="ברוכים הבאים"
      className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ── Layer 1: zooming background image ── */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <img
          src={HERO.image}
          alt={HERO.imageAlt}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>
      {/* ── Layer 2: gradient + grain for legibility ── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-900/70 via-forest-900/45 to-forest-900/90"
      />
      <div aria-hidden className="texture-dots absolute inset-0 -z-10 opacity-60" />

      {/* ── Layer 3: content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative flex flex-1 flex-col items-center justify-center pt-24 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="mb-5 inline-block rounded-full border border-cream/25 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cream/90 backdrop-blur-sm sm:text-sm"
        >
          {HERO.kicker}
        </motion.p>

        <h1 className="text-fluid-hero font-black leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {HERO.titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.12 }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base font-light leading-relaxed text-cream/85 sm:text-lg md:text-xl"
        >
          {HERO.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          className="mt-9 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row"
        >
          {HERO.ctas.map((cta) => (
            <a
              key={cta.label}
              href={cta.href}
              onClick={(e) => handleNav(e, cta.href.replace("#", ""))}
              className={cn(btnClass[cta.variant], "group")}
            >
              {cta.label}
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ── */}
      <motion.button
        type="button"
        style={{ opacity: cueOpacity }}
        onClick={() => scrollToId("about")}
        aria-label={HERO.scrollCue}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-cream/70 transition-colors hover:text-cream"
      >
        <span className="text-xs tracking-widest">{HERO.scrollCue}</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </section>
  );
}
