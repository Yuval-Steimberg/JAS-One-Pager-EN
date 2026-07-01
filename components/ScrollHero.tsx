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
 * Cinematic hero.
 *
 * DESKTOP  — section is 200vh; sticky 100svh div pins for 100vh of scroll.
 *            Video currentTime is scrubbed by scroll + scale zooms 1→1.4
 *            creating the "flying into space" feel.
 * MOBILE   — section is 100svh; video seeks past dark intro, autoplays.
 *
 * Two separate visibility states:
 *   `visible`    — triggers text entrance animations immediately.
 *   `videoReady` — fades the video in ONLY after it is seeked to a
 *                  non-black frame, so users never see the t=0 void.
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleNav = useSmoothScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // scrollYProgress 0→0.5 = sticky div pinned; 0.5→1 = scrolling off.
  // All effects concentrated in the first half (pinned phase).
  const overlayY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-40%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.12, 0.38], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1.0, 1.4]);

  useEffect(() => {
    // Text animations fire immediately.
    const raf = requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(true), 50);

    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video || reduce) {
      setVideoReady(true);
      return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    // Skip the first 12 % — space videos typically start with dark void frames.
    const START_FRAC = 0.12;

    const seekTo = (time: number) => {
      if ("fastSeek" in video) {
        try {
          (video as HTMLVideoElement & { fastSeek(t: number): void }).fastSeek(time);
          return;
        } catch {}
      }
      try { video.currentTime = time; } catch {}
    };

    // Reveal the video once a seek has landed on a real frame.
    let revealedVideo = false;
    const revealVideo = () => {
      if (revealedVideo) return;
      revealedVideo = true;
      setVideoReady(true);
    };
    // Hard fallback: show whatever we have after 2 s.
    const revealFallback = setTimeout(revealVideo, 2000);

    if (mobile) {
      // ── Mobile: seek past dark intro, then autoplay ────────────────────
      const startPlay = () => {
        const startT = (video.duration || 0) * START_FRAC;
        seekTo(startT);
        video.play().catch(() => {});
      };

      if (video.readyState >= 1) {
        startPlay();
      } else {
        video.addEventListener("loadedmetadata", startPlay, { once: true });
      }

      // Show video once it is playing (i.e. past the black void seek).
      video.addEventListener("playing", revealVideo, { once: true });

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
        clearTimeout(revealFallback);
        video.pause();
      };
    }

    // ── Desktop: scroll-scrub ──────────────────────────────────────────────
    const pause = () => { try { video.pause(); } catch {} };

    const setupScrub = () => {
      pause();
      const startT = (video.duration || 0) * START_FRAC;
      seekTo(startT);
    };

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrub, { once: true });
    }

    // Unlock buffering via a short play → pause round-trip.
    video.play().then(pause).catch(() => {});

    let scrubRaf = 0;
    let displayed = (video.duration || 0) * START_FRAC;
    let seeking = false;
    const SMOOTHING = 0.15;

    const computeTarget = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      return (START_FRAC + progress * (1 - START_FRAC)) * (video.duration || 0);
    };

    let targetTime = computeTarget();

    const onSeeked = () => {
      seeking = false;
      revealVideo(); // first seeked event = we're on a real frame; show it
    };
    const onScroll = () => { targetTime = computeTarget(); };
    const onResize = () => { targetTime = computeTarget(); };
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const tick = () => {
      scrubRaf = requestAnimationFrame(tick);
      if (!video.duration) return;
      displayed += (targetTime - displayed) * SMOOTHING;
      if (!seeking && Math.abs(displayed - video.currentTime) > 1 / 30) {
        seeking = true;
        seekTo(displayed);
      }
    };
    scrubRaf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(revealFallback);
      cancelAnimationFrame(scrubRaf);
      video.removeEventListener("loadedmetadata", setupScrub);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="ברוכים הבאים"
      style={{ background: "#000" }}
      className={cn(
        "relative [overflow:clip]",
        reduce ? "h-[100svh]" : "h-[100svh] md:h-[200vh]"
      )}
    >
      {/* Deep-space gradient — always visible, shows while video is loading */}
      <div
        className="on-dark sticky top-0 flex h-[100svh] w-full items-center justify-center [overflow:clip]"
        style={{ background: "radial-gradient(ellipse at 50% 20%, #0c0524 0%, #040112 50%, #000000 100%)" }}
      >

        {/* ── Space video ─────────────────────────────────────────────────── */}
        {/* Wrapped in motion.div so scale() doesn't break the video element */}
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
              // Only fade in AFTER the video is seeked to a non-black frame.
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

        {/* ── Content — parallaxes up + fades out as user scrolls ── */}
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
