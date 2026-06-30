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
 * Cinematic scroll-scrub hero — space fly-through effect.
 *
 * Desktop: video.currentTime is driven by scroll position (Apple-style scrub).
 * Mobile:  video autoplays and loops — no scrub (iOS Safari bans rapid seeking).
 *
 * KEY CSS RULES:
 * - Outer section uses [overflow:clip] NOT overflow-hidden.
 *   overflow:hidden creates a scroll container → kills position:sticky.
 * - Section is 300vh on desktop (scroll range for scrub), 100svh on mobile.
 * - No poster attribute — bg-black is the pre-load fallback (no furniture flash).
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleNav = useSmoothScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const overlayY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Trigger entrance animations immediately
    const raf = requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(true), 50);

    const video = videoRef.current;
    if (!video) return () => { cancelAnimationFrame(raf); clearTimeout(t); };

    if (isMobile || reduce) {
      // Mobile: autoplay + loop — no scroll scrub
      video.loop = true;
      video.play().catch(() => {});
      return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }

    const container = containerRef.current;
    if (!container) return () => { cancelAnimationFrame(raf); clearTimeout(t); };

    // Desktop: scroll-scrub
    let scrubRaf = 0;
    let targetTime = 0;
    let displayed = 0;
    let seeking = false;
    const SMOOTHING = 0.18;

    const computeTarget = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      targetTime = progress * (video.duration || 0);
    };

    const onSeeked = () => { seeking = false; };
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget);

    const tick = () => {
      scrubRaf = requestAnimationFrame(tick);
      if (!video.duration) return;
      displayed += (targetTime - displayed) * SMOOTHING;
      if (!seeking && Math.abs(displayed - video.currentTime) > 1 / 30) {
        seeking = true;
        try { video.currentTime = displayed; } catch { seeking = false; }
      }
    };

    computeTarget();
    scrubRaf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      cancelAnimationFrame(scrubRaf);
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
      className={cn(
        "relative [overflow:clip]",
        reduce ? "h-[100svh]" : "h-[100svh] md:h-[300vh]"
      )}
    >
      {/* bg-black: pre-load dark fallback — no poster, no old furniture flash */}
      <div className="on-dark sticky top-0 flex h-[100svh] w-full items-center justify-center bg-black [overflow:clip]">

        {/* Space video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          // Only pause for desktop scrub; mobile autoplays
          onLoadedMetadata={(e) => {
            const isMob = window.innerWidth < 768;
            const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!isMob && !prefersReduce) {
              e.currentTarget.pause();
            }
          }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          <source src="/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        {/* Cinema veil: top + bottom vignette, transparent in center */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65"
        />
        {/* Radial vignette — darkens edges for depth */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* ── Overlay: parallaxes up + fades on scroll ── */}
        <motion.div
          style={{ y: overlayY, opacity: overlayOpacity }}
          className="container relative flex flex-col items-center px-6 text-center"
        >
          {/* Kicker */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mx-auto mb-7 inline-block rounded-full border border-white/20 bg-white/5 px-5 py-1.5 text-xs font-semibold tracking-[0.18em] text-white/80 backdrop-blur-sm sm:text-sm"
          >
            {HERO.kicker}
          </motion.p>

          {/* Headline — masked per-line reveal */}
          <h1
            className="font-black leading-[0.88] tracking-tight text-white"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 10rem)",
              textShadow: "0 2px 60px rgba(0,0,0,0.9), 0 8px 40px rgba(0,0,0,0.7)",
            }}
          >
            {HERO.titleLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%", skewY: 4 }}
                  animate={{ y: visible ? "0%" : "110%", skewY: visible ? 0 : 4 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.38 + i * 0.16 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 24 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.82 }}
            className="mx-auto mt-7 max-w-xl text-base font-light text-white/70 sm:text-lg md:text-xl"
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
            className="mt-10 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row"
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
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/45"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">{HERO.scrollCue}</span>
          <motion.span
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

export default ScrollHero;
