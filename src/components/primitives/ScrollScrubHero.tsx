import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrubSource {
  src: string;
  type: string;
}

interface ScrollScrubHeroProps {
  /** Ordered video sources — put the most compatible first (mp4/h264). */
  sources: ScrubSource[];
  /** Poster image: shown before the video is ready and as the a11y/fallback still. */
  poster: string;
  posterAlt?: string;
  /** Section id for anchor navigation. */
  id?: string;
  /**
   * How much scroll distance the scrub spans, as a multiple of the viewport
   * height. 3 = the hero is 300vh tall; the video scrubs across that scroll.
   */
  scrollVh?: number;
  className?: string;
  /** Overlay content rendered above the video, receives scroll progress 0..1. */
  children?: React.ReactNode;
  /** Optional render-prop for progress-driven overlays. */
  overlay?: (progress: import("framer-motion").MotionValue<number>) => React.ReactNode;
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  Cinematic scroll-scrub hero (the "Apple product page" effect)
 * ────────────────────────────────────────────────────────────────────────────
 *  A tall scroll container with a *pinned* (sticky) full-screen stage. As the
 *  user scrolls, the page scroll progress (0→1) drives the video's currentTime,
 *  so scrolling forward scrubs the footage forward and scrolling back rewinds.
 *
 *  Robustness built in:
 *   • currentTime is eased toward the target each frame (rAF + lerp) so the
 *     scrub feels fluid instead of snapping frame-to-frame.
 *   • We only seek when the delta is meaningful and never while a seek is in
 *     flight, avoiding the seek-backlog jank that naive implementations hit.
 *   • Poster shows instantly; the video is swapped in once it can play.
 *   • prefers-reduced-motion (or a missing/undecodable video) → a static,
 *     accessible poster hero. No motion, no layout shift.
 *   • Transform/opacity only on the overlay; the video uses object-cover inside
 *     a fixed-size stage, so there is zero layout shift while scrubbing.
 *
 *  Asset notes: ship an H.264 .mp4 (Safari/iOS) AND a VP9/VP8 .webm, both with
 *  frequent keyframes for snappy seeking (see /docs/SCROLL_SCRUB_HERO.md).
 */
export function ScrollScrubHero({
  sources,
  poster,
  posterAlt = "",
  id = "home",
  scrollVh = 3,
  className,
  children,
  overlay,
}: ScrollScrubHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Darken slightly as you scroll so overlay text stays legible deeper in.
  const veil = useTransform(scrollYProgress, [0, 1], [0.45, 0.75]);

  // ── Drive video.currentTime from scroll, with per-frame easing ──
  const targetTime = useRef(0);
  const durationRef = useRef(0);
  const seeking = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    targetTime.current = Math.max(0, Math.min(1, p)) * durationRef.current;
  });

  useEffect(() => {
    if (reduce || failed) return;
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let displayed = 0;

    const onSeeked = () => (seeking.current = false);
    video.addEventListener("seeked", onSeeked);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!durationRef.current) return;
      // Ease the displayed time toward the scroll target.
      displayed += (targetTime.current - displayed) * 0.12;
      if (
        !seeking.current &&
        Math.abs(displayed - video.currentTime) > 1 / 30
      ) {
        seeking.current = true;
        try {
          video.currentTime = displayed;
        } catch {
          seeking.current = false;
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [reduce, failed]);

  // Prime the video so frames are decoded and seekable, then keep it paused.
  function handleLoadedMeta() {
    const video = videoRef.current;
    if (!video) return;
    durationRef.current = video.duration || 0;
    video.pause();
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label="ברוכים הבאים"
      className={cn("relative", className)}
      style={{ height: reduce ? "100svh" : `${scrollVh * 100}vh` }}
    >
      {/* Pinned stage */}
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
        {/* Poster (instant) + fallback still */}
        <img
          src={poster}
          alt={posterAlt}
          fetchPriority="high"
          decoding="async"
          aria-hidden={posterAlt ? undefined : true}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready && !reduce && !failed ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Scrub video (skipped entirely for reduced-motion) */}
        {!reduce && !failed && (
          <video
            ref={videoRef}
            poster={poster}
            muted
            playsInline
            preload="auto"
            // We control playback via currentTime; never autoplay.
            onLoadedMetadata={handleLoadedMeta}
            onCanPlay={() => setReady(true)}
            // A failing <source> (e.g. an absent mp4) bubbles its error to the
            // <video>; ignore those and only fall back when the media element
            // itself has exhausted every source.
            onError={(e) => {
              if (e.target === videoRef.current && videoRef.current?.error) {
                setFailed(true);
              }
            }}
            className="absolute inset-0 h-full w-full object-cover"
          >
            {sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}

        {/* Legibility veil */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-forest-900"
          style={{ opacity: reduce ? 0.5 : veil }}
        />
        <div aria-hidden className="texture-dots absolute inset-0 opacity-50" />

        {/* Overlay content */}
        <div className="on-dark container relative flex h-full flex-col items-center justify-center text-center">
          {overlay ? overlay(scrollYProgress) : children}
        </div>
      </div>
    </section>
  );
}
