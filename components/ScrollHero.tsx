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

// Fraction of scrollYProgress over which video is scrubbed (0 → video.duration).
// After this point the video stays at the end while zoom continues.
const VIDEO_END = 0.88;

/**
 * Scroll-scrubbed cinematic hero.
 *
 * The section is 250 vh tall — the extra 150 vh creates the "scroll room"
 * that drives the video.  Inside, a sticky viewport pins the visual at
 * the top while the parent section accumulates scrollYProgress 0 → 1.
 *
 * Video strategy — iOS-safe:
 *   1. autoPlay + muted + playsInline unlocks the video element on iOS
 *   2. On the first `timeupdate` we immediately pause and hand control to scroll
 *   3. `scrollYProgress` drives video.currentTime on every frame
 *   4. Hard 2 s fallback reveals the video (gradient) if nothing loads
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const handleNav    = useSmoothScroll();
  const reduce       = useReducedMotion();
  const [visible,    setVisible]    = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // scrollYProgress: 0 when sticky viewport enters, 1 when section exits
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Text fades + rises once the user has scrolled a bit into the video
  const overlayOpacity = useTransform(scrollYProgress, [0.12, 0.32], [1, 0]);
  const overlayY       = useTransform(scrollYProgress, [0.12, 0.45], ["0%", "-28%"]);

  // Background zooms in throughout the full scroll — "flying into space"
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.6]);

  // Exit curtain: fades in just before sticky releases, bridging dark hero → ivory sections
  const exitOpacity = useTransform(scrollYProgress, [0.42, 0.6], [0, 1]);

  // Scroll drives the video — every frame update advances currentTime
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (!video || !video.duration || reduce) return;
    const clamped    = Math.min(progress / VIDEO_END, 1);
    const targetTime = clamped * video.duration;
    // Skip micro-seeks to avoid seek-storm on iOS
    if (Math.abs(video.currentTime - targetTime) > 0.033) {
      video.currentTime = targetTime;
    }
  });

  useEffect(() => {
    // Trigger text entrance immediately
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
      // Hand control to scroll — pause the autoplay
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };

    // `timeupdate` fires only when currentTime actually advances (iOS-safe).
    // Once we know real frames are available, we pause and let scroll take over.
    const onTimeUpdate = () => {
      if (video.currentTime > 0) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        unlock();
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.play().catch(() => {});

    // Hard fallback — show gradient (and whatever video frame we have) after 2 s
    const fallback = setTimeout(() => {
      setVideoReady(true);
      try { video.pause(); } catch {}
    }, 2000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(fallback);
      video.removeEventListener("timeupdate", onTimeUpdate);
      try { video.pause(); } catch {}
    };
  }, [reduce]);

  return (
    // Tall section — creates the scroll range that powers the video scrub.
    // NO overflow on the section — overflow:clip on a parent breaks position:sticky.
    // The clip lives on the sticky child instead, which is safe.
    <section
      id="home"
      ref={containerRef}
      aria-label="ברוכים הבאים"
      className="relative h-[250vh] bg-[#FBF8F1]"
    >
      {/* ── Sticky viewport — stays pinned while parent section scrolls ─── */}
      {/* [overflow:clip] here clips the scaled bg without breaking sticky  */}
      <div className="sticky top-0 h-[100svh] [overflow:clip]">

        {/* ── Zooming layer: gradient + video + vignettes ─────────────── */}
        {/* Gradient zooms immediately so the effect works before video loads */}
        <motion.div
          style={{
            scale: heroScale,
            background:
              "radial-gradient(ellipse at 50% 20%, #0c0524 0%, #040112 50%, #000000 100%)",
          }}
          className="absolute inset-0"
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

        {/* ── Content overlay — NOT inside zoom layer ──────────────────── */}
        <div className="on-dark absolute inset-0 flex items-center justify-center">
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

        {/* Scroll cue — outside zoom layer so it doesn't scale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.6 }}
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

        {/* Exit curtain — fades hero to ivory just before sticky releases,
            so the hand-off to the content sections below is seamless */}
        <motion.div
          aria-hidden
          style={{ opacity: exitOpacity, background: "#FBF8F1" }}
          className="pointer-events-none absolute inset-0 z-20"
        />

      </div>
    </section>
  );
}

export default ScrollHero;
