# Cinematic scroll-scrub hero (the "Apple product page" effect) — end to end

> Scroll forward → the video scrubs forward. Scroll back → it rewinds.
> The video does not "play"; its `currentTime` is driven by scroll position.

This site ships a production-ready implementation:

- **`src/components/primitives/ScrollScrubHero.tsx`** — the reusable, generic engine.
- **`src/components/sections/HeroScrub.tsx`** — the Just A Second hero that uses it,
  with scroll-staged Hebrew overlay copy.
- **`public/videos/hero.webm`** — a real demo clip generated from the site's photos.

---

## 1. How it works

1. The hero is a **tall** section (`height: scrollVh × 100vh`, default `300vh`).
   Inside it, a **`position: sticky` stage** pins to the viewport for the whole
   section. That tall outer height is what gives you scroll distance to scrub
   across while the visual stays put.
2. `useScroll({ target, offset: ["start start", "end end"] })` yields
   `scrollYProgress` 0→1 across that pinned span.
3. A `requestAnimationFrame` loop **eases** the video's `currentTime` toward
   `progress × duration`:

   ```ts
   displayed += (target - displayed) * 0.12;            // critical-damped feel
   if (!seeking && Math.abs(displayed - video.currentTime) > 1/30) {
     seeking = true;                                     // one seek in flight
     video.currentTime = displayed;                      // → "seeked" clears it
   }
   ```

   Easing makes the scrub feel fluid instead of snapping frame-to-frame; the
   single-seek guard prevents the seek backlog that makes naive versions stutter.
4. Overlay copy is staged to scroll progress (intro → statement → CTAs) and
   crossfaded with `animate`.

### Why the overlay uses a discrete "stage" instead of per-frame `useTransform`

Per-frame `useTransform(progress, …)` opacities passed across a render-prop
boundary did **not** bind reliably to the DOM in testing (the MotionValue
updated, but the derived style wasn't written). The robust pattern — used here —
maps `progress` to a discrete `stage` via `useMotionValueEvent` + `useState`,
then crossfades stages with `animate`. It re-renders only at the two boundaries
(cheap) and is deterministic. Keep this in mind if you extend the overlay.

## 2. Using the component

```tsx
<ScrollScrubHero
  id="home"
  poster="/images/hero.jpg"
  posterAlt="…"
  scrollVh={3}                                  // hero is 300vh tall
  sources={[
    { src: "/videos/hero.mp4",  type: "video/mp4"  },   // Safari/iOS — list first
    { src: "/videos/hero.webm", type: "video/webm" },   // Chrome/Firefox/Edge
  ]}
  overlay={(progress) => <YourOverlay progress={progress} />}
/>
```

**Tuning**

- `scrollVh` — longer = slower, more cinematic scrub (more scroll per second of footage). `2.5`–`4` is a good range.
- Easing factor `0.12` in `ScrollScrubHero` — lower = silkier but laggier; higher = snappier.
- The seek threshold `1/30` ≈ one frame at 30 fps; match it to your video's fps.

## 3. Producing the video (the part that actually matters)

Scrub smoothness is **90% the encode**. Two rules:

### a) Frequent keyframes
Seeking jumps to the nearest keyframe, so sparse keyframes = choppy scrub. Encode
with a keyframe every frame (all-intra) or every few frames. A short hero (5–10s,
1280–1920px) stays small even all-intra.

```bash
# H.264 mp4 (Safari/iOS + everything) — keyframe every frame, no audio
ffmpeg -i source.mov -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -x264-params "scenecut=0" \
  -crf 22 -movflags +faststart hero.mp4

# VP9 webm (smaller; Chrome/Firefox/Edge, newer Safari)
ffmpeg -i source.mov -an -c:v libvpx-vp9 -g 1 -keyint_min 1 -b:v 0 -crf 30 hero.webm
```

Ship **both**; the browser picks the first it can play. `+faststart` puts the
moov atom up front so the file is seekable before it fully downloads.

### b) Keep it light
720p–1080p, no audio track, a few seconds. Aim for a couple of MB. Preload it
(`preload="auto"`) so the first scrub isn't waiting on the network.

### How `public/videos/hero.webm` here was generated
This environment had no H.264 encoder, so the demo clip was produced by rendering
a Ken-Burns + crossfade sequence of the site's photos onto a `<canvas>` in
Chromium and recording it with `MediaRecorder` (VP8/WebM). Good enough to prove
the effect live; **for production, replace it with a real `hero.mp4` + `hero.webm`
encoded as above** (drop them in `public/videos/`). The mp4 `<source>` is already
wired — adding the file is all that's left, and it removes the dev 404 for it.

### Alternative: image-sequence + canvas (the most "Apple-authentic" route)
Apple's product pages often draw a **numbered JPG sequence** to a canvas instead
of seeking a video — it sidesteps every codec/seek quirk and is buttery on iOS.
Trade-off: many files + more bytes. If you go this way, export ~100–240 frames,
preload them, and in the rAF loop `ctx.drawImage(frames[Math.round(progress×(n-1))])`.
The pinning/overlay logic from `ScrollScrubHero` carries over unchanged.

## 4. Mobile & Safari/iOS notes

- The video is `muted` + `playsInline` (required for inline iOS playback).
- iOS historically throttles rapid `currentTime` seeks; with an all-keyframe mp4
  it's smooth, but **test on a real device**. If you see jank, prefer the
  image-sequence route on small screens, or raise `scrollVh` to reduce seek rate.
- Safari does not reliably play VP8 `.webm` — that's exactly why the mp4 source
  must be present and listed first.

## 5. Accessibility

- `prefers-reduced-motion` → the component skips the video entirely and renders a
  static poster hero with the full overlay copy and working CTAs. No scrubbing,
  no motion.
- The poster carries the meaningful `alt`; the video is decorative.
- CTAs in non-active stages are `tabIndex={-1}` and `aria-hidden` so keyboard and
  screen-reader users only reach what's visible.

## 6. Porting to Next.js (App Router)

The technique is identical; only the shell differs.

1. Add `"use client"` at the top of `ScrollScrubHero.tsx` and the hero overlay —
   they use hooks, scroll, and refs, so they must be Client Components.
2. Put `hero.mp4` / `hero.webm` / poster in **`/public`**; reference them as
   `/videos/hero.mp4` (no `import.meta.env.BASE_URL` — Next serves `/public` at root).
3. For the poster, prefer `next/image` with `priority`; the `<video>` stays a
   plain element (you control `currentTime`, so `next/video` isn't needed).
4. Framer Motion works the same; keep the discrete-stage overlay pattern.
5. Everything else (Tailwind, the rAF scrub loop, the sticky pin) is unchanged.

```tsx
// app/page.tsx
import { Hero } from "@/components/HeroScrub"; // "use client" inside
export default function Page() { return <main><Hero /></main>; }
```
