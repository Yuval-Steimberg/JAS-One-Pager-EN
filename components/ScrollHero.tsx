"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HERO } from "@/data/siteContent";
import { useSmoothScroll } from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  ScrollHero — cinematic scroll-scrub hero (the "Apple product page" effect)
 * ────────────────────────────────────────────────────────────────────────────
 *  Built to the exact spec:
 *   • Outer container is 300vh tall (provides scroll distance).
 *   • A sticky <video> fills the viewport (100vw × 100vh, object-cover).
 *   • Video is muted / playsInline / preload="auto" and PAUSED on mount
 *     (never autoplays — we drive playback by scroll).
 *   • A scroll listener reads getBoundingClientRect → progress (0→1) → target
 *     time; a requestAnimationFrame loop LERPS currentTime toward the target
 *     with smoothing 0.22 so the playhead glides instead of snapping.
 *   • Listener + rAF are cleaned up on unmount.
 *   • 200ms opacity fade-in on first mount.
 *
 *  Drop-in for Next.js too: it already starts with "use client"; place the video
 *  files in /public and the paths below resolve at the site root.
 *
 *  Asset: put the Higgsfield clip at /public/hero.mp4 (Safari/iOS). A WebM
 *  fallback (/videos/hero.webm) is included so the effect works without it.
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleNav = useSmoothScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // 200ms fade-in: flip on the next frame so the opacity transition runs.
    const fadeRaf = requestAnimationFrame(() => setVisible(true));

    if (reduce) return () => cancelAnimationFrame(fadeRaf);

    let raf = 0;
    let targetTime = 0; // where the playhead should be (from scroll)
    let displayed = 0; // eased playhead position
    let seeking = false; // keep one seek in flight to avoid backlog
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

    const onScroll = () => computeTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!video.duration) return;
      displayed += (targetTime - displayed) * SMOOTHING;
      if (!seeking && Math.abs(displayed - video.currentTime) > 1 / 30) {
        seeking = true;
        try {
          video.currentTime = displayed;
        } catch {
          seeking = false;
        }
      }
    };

    computeTarget();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(fadeRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [reduce]);

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="ברוכים הבאים"
      className={cn("relative", reduce ? "h-[100svh]" : "h-[300vh]")}
    >
      <div className="on-dark sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
        {/* Scrubbed video — paused on mount, driven by scroll */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={HERO.image}
          aria-hidden="true"
          onLoadedMetadata={(e) => e.currentTarget.pause()}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Higgsfield clip goes here (Safari/iOS): */}
          <source src="/hero.mp4" type="video/mp4" />
          {/* Working WebM fallback (Chrome/Firefox/Edge): */}
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        {/* Legibility veil + paper grain */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/45 to-ink-900/90"
        />
        <div aria-hidden className="texture-dots absolute inset-0 opacity-50" />

        {/* Overlay copy */}
        <div className="container relative flex flex-col items-center px-6 text-center">
          <p className="mx-auto mb-5 inline-block rounded-full border border-ivory/25 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-ivory/90 backdrop-blur-sm sm:text-sm">
            {HERO.kicker}
          </p>
          <h1 className="text-fluid-hero font-black leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            {HERO.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light text-ivory/85 sm:text-lg md:text-xl">
            {HERO.subtitle}
          </p>
          <div className="mt-9 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
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
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/70">
          <span className="text-xs tracking-widest">{HERO.scrollCue}</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </div>
      </div>
    </section>
  );
}

export default ScrollHero;
