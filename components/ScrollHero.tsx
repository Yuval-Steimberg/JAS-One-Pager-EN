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
 * Cinematic scroll-scrub hero.
 *
 * DESKTOP: section is 300vh; video.currentTime driven by scroll + scale zoom.
 * MOBILE:  section is 100svh; video autoplays so the camera flies through space
 *          without any blank scroll buffer below the viewport.
 *
 * iOS Safari requires autoPlay + muted + playsInline to buffer frames;
 * on desktop we call play().then(pause) to unlock buffering, then hand
 * control to the rAF scrub loop.
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

  // Parallax + fade for the text overlay
  const overlayY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.45, 0.72], [1, 0]);

  // Scale the video up as you scroll — "flying into" the space
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.18]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(true), 50);

    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video || reduce) {
      return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;

    if (mobile) {
      // Mobile: autoplay the space journey. Section is 100svh so there is
      // no extra scroll buffer and therefore no blank ivory gap.
      video.play().catch(() => {});
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
        video.pause();
      };
    }

    // ── Desktop: scroll-scrub ─────────────────────────────────────────────
    const START_FRAC = 0.06; // skip the first 6 % — usually dark empty frames

    const pause = () => { try { video.pause(); } catch {} };
    const seekTo = (time: number) => {
      if ("fastSeek" in video) {
        try {
          (video as HTMLVideoElement & { fastSeek(t: number): void }).fastSeek(time);
          return;
        } catch {}
      }
      try { video.currentTime = time; } catch {}
    };

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

    // Unlock buffering (iOS + Chrome Android need a play attempt)
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
    const onSeeked = () => { seeking = false; };
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
      className={cn(
        "relative [overflow:clip]",
        // Mobile: 100svh = no blank gap. Desktop: 300vh for scroll range.
        reduce ? "h-[100svh]" : "h-[100svh] md:h-[300vh]"
      )}
    >
      {/* Deep-space gradient: cinematic even before the video loads */}
      <div
        className="on-dark sticky top-0 flex h-[100svh] w-full items-center justify-center [overflow:clip]"
        style={{ background: "radial-gradient(ellipse at 50% 20%, #0c0524 0%, #040112 50%, #000000 100%)" }}
      >

        {/* ── Space video ── */}
        {/* Scale grows with scroll (desktop) to create the "flying into space" sensation */}
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
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            <source src="/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.webm" type="video/webm" />
          </video>
        </motion.div>

        {/* Cinema vignette: top+bottom dark, center open for video */}
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

          {/* CTAs — each wrapped in magnetic pull */}
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
