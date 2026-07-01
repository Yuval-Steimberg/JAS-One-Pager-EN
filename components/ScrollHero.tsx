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
 * Cinematic hero — position:fixed background, scroll-scrubbed on desktop,
 * autoplay on touch/mobile (mobile video seek is too slow to scrub).
 *
 * Section is h-[150svh] on mobile / h-[200vh] on desktop.
 * The fixed background fades to 0 before the section exits so it never
 * bleeds over the next section.  `pinned` is driven by scrollYProgress
 * (not IntersectionObserver) for frame-accurate unpin timing.
 */
export function ScrollHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const handleNav   = useSmoothScroll();
  const reduce      = useReducedMotion();
  const [visible,    setVisible]    = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [pinned,     setPinned]     = useState(true);
  // On touch/mobile we autoplay instead of scroll-scrubbing (seek is laggy)
  const [isTouch,    setIsTouch]    = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Touch: text stays until 42–68 % of scroll. Desktop: fades early at 0–25 %.
  const overlayOpacity = useTransform(
    scrollYProgress,
    isTouch ? [0.42, 0.68] : [0, 0.25],
    [1, 0]
  );
  const overlayY = useTransform(
    scrollYProgress,
    isTouch ? [0.42, 0.75] : [0, 0.35],
    ["0%", "-22%"]
  );

  // Background rushes toward viewer the whole time
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.6]);

  // Background fades out in the last ~15 % so it never overlaps the next section
  const bgOpacity = useTransform(scrollYProgress, [0.82, 0.98], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Unpin a fraction before the section fully exits — eliminates overlap
    setPinned(p < 0.97);

    // Desktop only: scrub video with scroll
    if (isTouch || reduce) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const t = Math.min(p / 0.95, 1) * video.duration;
    if (Math.abs(video.currentTime - t) > 0.033) video.currentTime = t;
  });

  // Video setup
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const t   = setTimeout(() => setVisible(true), 50);

    const video = videoRef.current;
    if (!video || reduce) {
      setVideoReady(true);
      return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }

    if (isTouch) {
      // Mobile: autoplay freely — reveal after first real frame
      const onTime = () => {
        if (video.currentTime > 0) {
          video.removeEventListener("timeupdate", onTime);
          setVideoReady(true);
        }
      };
      video.addEventListener("timeupdate", onTime);
      video.play().catch(() => {});
      const fb = setTimeout(() => setVideoReady(true), 2000);
      return () => {
        cancelAnimationFrame(raf); clearTimeout(t); clearTimeout(fb);
        video.removeEventListener("timeupdate", onTime);
        try { video.pause(); } catch {}
      };
    }

    // Desktop: autoplay → pause on first real frame → scroll owns currentTime
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };
    const onTime = () => {
      if (video.currentTime > 0) {
        video.removeEventListener("timeupdate", onTime);
        unlock();
      }
    };
    video.addEventListener("timeupdate", onTime);
    video.play().catch(() => {});
    const fb = setTimeout(() => { setVideoReady(true); try { video.pause(); } catch {} }, 2000);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(t); clearTimeout(fb);
      video.removeEventListener("timeupdate", onTime);
      try { video.pause(); } catch {}
    };
  }, [reduce, isTouch]);

  const fixedStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  };
  const unpinnedBgStyle: React.CSSProperties = {
    position: "absolute", left: 0, right: 0, bottom: 0, height: "100vh",
  };

  return (
    // h-[200svh] on mobile (100svh scroll room), h-[300vh] on desktop (200vh scroll room)
    <section
      id="home"
      ref={sectionRef}
      aria-label="ברוכים הבאים"
      className="relative h-[200svh] md:h-[300vh]"
    >
      {/* ── Background: fixed while in-view, falls to absolute bottom after ── */}
      <motion.div
        style={{
          scale: heroScale,
          opacity: bgOpacity,
          background:
            "radial-gradient(ellipse at 50% 20%, #0c0524 0%, #040112 50%, #000000 100%)",
          ...(pinned ? fixedStyle : unpinnedBgStyle),
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
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65" />
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

      {/* ── Text overlay — fixed while pinned ────────────────────────────── */}
      <div
        style={pinned ? fixedStyle : { display: "none" }}
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

          {/* Headline */}
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

      {/* Scroll cue */}
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
