"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HERO } from "@/data/siteContent";
import { useSmoothScroll } from "@/lib/smoothScroll";
import { MagneticWrapper } from "@/components/MagneticWrapper";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-scrubbed cinematic hero — NO sticky, NO blank space.
 *
 * The section is h-[300vh] tall (scroll driver), but the background layer
 * is position:fixed so it stays viewport-filling the entire time.  When the
 * section exits the viewport the fixed layer falls back to absolute at its
 * bottom edge, naturally sliding off screen — zero dead zone.
 *
 * scrollYProgress (0→1) over the section's lifetime drives:
 *   • video.currentTime  — scroll physically advances the footage
 *   • heroScale          — background zooms toward the viewer
 *   • text overlay       — fades + rises early, leaving pure cinema
 */
export function ScrollHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const handleNav   = useSmoothScroll();
  const reduce      = useReducedMotion();
  const [visible,    setVisible]    = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  // When true, background switches from fixed → absolute (section has exited)
  const [pinned,    setPinned]     = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Text fades early so the zoom dominates the second half
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const overlayY       = useTransform(scrollYProgress, [0, 0.35], ["0%", "-22%"]);

  // Background rushes toward viewer throughout the scroll
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.65]);

  // Scrub video with scroll — every tick advances footage
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const video = videoRef.current;
    if (!video || !video.duration || reduce) return;
    const t = Math.min(p, 1) * video.duration;
    if (Math.abs(video.currentTime - t) > 0.033) video.currentTime = t;
  });

  // Switch fixed→absolute when section scrolls past the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPinned(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // Video setup: autoplay unlocks the element (iOS), first timeupdate → pause,
  // scroll takes over from there.  Hard 2 s fallback reveals gradient.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const t   = setTimeout(() => setVisible(true), 50);

    const video = videoRef.current;
    if (!video || reduce) {
      setVideoReady(true);
      return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };

    const onTimeUpdate = () => {
      if (video.currentTime > 0) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        unlock();
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.play().catch(() => {});
    const fallback = setTimeout(() => { setVideoReady(true); try { video.pause(); } catch {} }, 2000);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(t); clearTimeout(fallback);
      video.removeEventListener("timeupdate", onTimeUpdate);
      try { video.pause(); } catch {}
    };
  }, [reduce]);

  return (
    // h-[300vh] = 200 vh of scroll room inside the hero
    // No overflow restriction so nothing breaks the fixed background
    <section
      id="home"
      ref={sectionRef}
      aria-label="ברוכים הבאים"
      className="relative h-[300vh]"
    >
      {/* ── Background: fixed while section is in view, absolute after ────── */}
      {/* Switching from fixed→absolute at the section's bottom edge means      */}
      {/* it naturally slides off screen with zero gap or dead zone.            */}
      <motion.div
        ref={bgRef}
        style={{
          scale: heroScale,
          background:
            "radial-gradient(ellipse at 50% 20%, #0c0524 0%, #040112 50%, #000000 100%)",
          // Fixed: fills viewport.  Absolute (bottom-aligned): slides off when section exits.
          ...(pinned
            ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }
            : { position: "absolute", left: 0, right: 0, bottom: 0, height: "100vh" }),
        }}
        className="z-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            videoReady ? "opacity-100" : "opacity-0"
          )}
        >
          <source src="/hero.mp4"          type="video/mp4" />
          <source src="/videos/hero.webm"  type="video/webm" />
        </video>

        {/* Cinema vignette */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65"
        />
        {/* Radial edge vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 38%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        {/* Film grain */}
        <div aria-hidden className="grain-overlay absolute inset-0 opacity-[0.18] mix-blend-overlay" />
      </motion.div>

      {/* ── Text overlay — fixed so it stays on screen while section scrolls ── */}
      <div
        style={pinned ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0 } : { display: "none" }}
        className="on-dark z-10 flex items-center justify-center"
      >
        <motion.div
          style={{ y: overlayY, opacity: overlayOpacity }}
          className="container relative flex flex-col items-center px-6 text-center"
        >
          {/* Kicker pill */}
          <motion.p
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.88 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mx-auto mb-7 inline-block rounded-full border border-white/20 bg-white/6 px-5 py-1.5 text-xs font-semibold tracking-[0.2em] text-white/80 backdrop-blur-sm sm:text-sm"
          >
            {HERO.kicker}
          </motion.p>

          {/* Headline — per-line masked slide-up */}
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
            className="mt-10 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row"
          >
            {HERO.ctas.map((cta) => (
              <MagneticWrapper key={cta.label}>
                <a
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
              </MagneticWrapper>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue — fixed while section in view */}
      {pinned && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="fixed bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/45"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">{HERO.scrollCue}</span>
          <motion.span
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.div>
      )}
    </section>
  );
}

export default ScrollHero;
