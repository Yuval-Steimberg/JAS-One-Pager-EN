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
import { MagneticWrapper } from "@/components/MagneticWrapper";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic hero — 100svh on all devices, no blank scroll buffer anywhere.
 *
 * "Fly-through" feel:
 *   - Video autoplays (camera moves through space in the video itself)
 *   - As you scroll the section off-screen, the video scales 1→1.5
 *     which makes the frame rush toward you — feels like acceleration
 *   - Text fades + rises early so you get a clear zoom view before exit
 *
 * Video is kept opacity-0 until a "playing" event confirms the browser
 * is past the dark void at t=0.  Fallback reveals after 1.5 s.
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleNav = useSmoothScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // progress 0 → 1 as this 100svh section scrolls off the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const overlayY      = useTransform(scrollYProgress, [0, 0.55], ["0%", "-28%"]);
  // Scale zooms toward viewer as section exits — the "fly into space" effect.
  const videoScale    = useTransform(scrollYProgress, [0, 1], [1.0, 1.55]);

  useEffect(() => {
    // Text entrance: fire immediately.
    const raf = requestAnimationFrame(() => setVisible(true));
    const t   = setTimeout(() => setVisible(true), 50);

    const video = videoRef.current;
    if (!video || reduce) {
      setVideoReady(true);
      return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }

    // Skip the dark void at the start of the space video.
    const START_FRAC = 0.1;

    const startPlayback = () => {
      const startT = (video.duration || 0) * START_FRAC;
      try { video.currentTime = startT; } catch {}
      video.play().catch(() => {});
    };

    if (video.readyState >= 1) {
      startPlayback();
    } else {
      video.addEventListener("loadedmetadata", startPlayback, { once: true });
    }

    // Reveal once the browser confirms playback has started (past t=0 black void).
    const revealVideo = () => setVideoReady(true);
    video.addEventListener("playing", revealVideo, { once: true });
    // Hard fallback — show whatever frame is loaded after 1.5 s.
    const fallback = setTimeout(revealVideo, 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(fallback);
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("playing", revealVideo);
      video.pause();
    };
  }, [reduce]);

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="ברוכים הבאים"
      className="relative h-[100svh] [overflow:clip]"
    >
      {/* Deep-space gradient — visible while video loads */}
      <div
        className="on-dark absolute inset-0 flex items-center justify-center [overflow:clip]"
        style={{ background: "radial-gradient(ellipse at 50% 20%, #0c0524 0%, #040112 50%, #000000 100%)" }}
      >

        {/* ── Space video — scales up as section scrolls off ── */}
        <motion.div
          style={{ scale: videoScale }}
          className="absolute inset-0 h-full w-full"
        >
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            className={cn(
              "h-full w-full object-cover transition-opacity duration-1000",
              videoReady ? "opacity-100" : "opacity-0"
            )}
          >
            <source src="/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.webm" type="video/webm" />
          </video>
        </motion.div>

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
        {/* Animated film grain overlay */}
        <div aria-hidden className="grain-overlay absolute inset-0 opacity-[0.18] mix-blend-overlay" />

        {/* ── Content — fades + rises as user scrolls ── */}
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

        {/* Scroll cue */}
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
      </div>
    </section>
  );
}

export default ScrollHero;
