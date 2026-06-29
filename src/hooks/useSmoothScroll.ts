import { useCallback, useEffect } from "react";

const HEADER_OFFSET = 80;

/** Smoothly scroll to a section id, accounting for the sticky header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const top =
    el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
}

/**
 * Returns a click handler for anchor links that:
 *  - prevents the default jump,
 *  - smooth-scrolls to the target with header offset,
 *  - updates the URL hash,
 *  - runs an optional callback (e.g. close the mobile menu).
 * Also scrolls to the hash on first load / refresh.
 */
export function useSmoothScroll(onNavigate?: () => void) {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      // Wait a tick for layout/fonts before measuring.
      const t = window.setTimeout(() => scrollToId(hash), 120);
      return () => window.clearTimeout(t);
    }
  }, []);

  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      scrollToId(id);
      if (window.history.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }
      onNavigate?.();
    },
    [onNavigate]
  );
}
