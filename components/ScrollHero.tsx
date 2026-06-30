"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HERO } from "@/data/siteContent";
import { useSmoothScroll } from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic scroll-scrub hero — Apple product-page style.
 * - 300vh outer section gives scroll distance.
 * - Sticky inner stage fills the viewport.
 * - Video playhead lerp'd by scroll (smoothing 0.22).
 * - Hero text reveals with masked per-line slide-up on page load.
 * - Overlay content parallaxes upward + fades as you scroll away.
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleNav = useSmoothScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // ── Overlay parallax ────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const overlayY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-28%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // ── Scroll-scrub rAF ────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const fadeRaf = requestAnimationFrame(() => setVisible(true));
    if (reduce) return () => cancelAnimationFrame(fadeRaf);

    let raf = 0;
    let targetTime = 0;
    let displayed = 0;
    let seeking = false;
    const SMOOTHING = 0.22;

    const computeTarget = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      targetTime = progress * (video.duration || 0);
    };

    const onSeeked = () => (seeking = false);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!video.duration) return;
      displayed += (targetTime - displayed) * SMOOTHING;
      if (!seeking && Math.abs(displayed - video.currentTime) > 1 / 30) {
        seeking = true;
        try { video.currentTime = displayed; } catch { seeking = false; }
      }
    };

    computeTarget();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(fadeRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", computeTarget);
      window.removeEventListener("resize", computeTarget);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [reduce]);

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="ברוכים הבאים"
      className={cn("relative overflow-hidden", reduce ? "h-[100svh]" : "h-[300vh]")}
    >
      <div className="on-dark sticky top-0 flex h-[100svh] w-full items-center justify-center [overflow:clip]">
        {/* Scrubbed video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={HERO.image}
          aria-hidden="true"
          onLoadedMetadata={(e) => e.currentTarget.pause()}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          <source src="/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        {/* Gradient veil */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-900/65 via-ink-900/40 to-ink-900/85"
        />
        <div aria-hidden className="texture-dots absolute inset-0 opacity-45" />

        {/* ── Overlay copy — parallaxes upward on scroll ── */}
        <motion.div
          style={{ y: overlayY, opacity: overlayOpacity }}
          className="container relative flex flex-col items-center px-6 text-center"
        >
          {/* Kicker pill — fades + scales in */}
          <motion.p
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.88 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            className="mx-auto mb-6 inline-block rounded-full border border-ivory/25 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-ivory/90 backdrop-blur-sm sm:text-sm"
          >
            {HERO.kicker}
          </motion.p>

          {/* Headline — each line slides up from a clip mask */}
          <h1 className="text-fluid-hero font-black leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            {HERO.titleLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%", skewY: 5 }}
                  animate={{
                    y: visible ? "0%" : "110%",
                    skewY: visible ? 0 : 5,
                  }}
                  transition={{
                    duration: 1.05,
                    ease: EASE,
                    delay: 0.4 + i * 0.14,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 22 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            className="mx-auto mt-6 max-w-2xl text-base font-light text-ivory/85 sm:text-lg md:text-xl"
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
            className="mt-9 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row"
          >
            {HERO.ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                onClick={(e) => handleNav(e, cta.href.replace("#", ""))}
                className={cn(
                  cta.variant === "primary"
                    ? "btn-primary"
                    : cta.variant === "outline"
                      ? "btn-outline"
                      : "btn-ghost",
                  "group"
                )}
              >
                {cta.label}
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/70"
        >
          <span className="text-xs tracking-widest">{HERO.scrollCue}</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

export default ScrollHero;
