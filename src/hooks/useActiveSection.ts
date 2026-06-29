import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view and keeps it in sync with the URL
 * hash (without adding history entries). Returns the active section id.
 *
 * - Uses IntersectionObserver with a viewport band so the "active" section is
 *   the one occupying the centre of the screen.
 * - Updates `location.hash` via replaceState so refresh/share keeps the spot
 *   but the back button isn't flooded with hash steps.
 */
export function useActiveSection(ids: string[], headerOffset = 88) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || !ids.length) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        // Pick the most-visible section.
        let best = active;
        let bestRatio = -1;
        for (const id of ids) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0 && best !== active) {
          setActive(best);
          if (window.history.replaceState) {
            window.history.replaceState(null, "", `#${best}`);
          }
        }
      },
      {
        // Bias detection toward the area just below the sticky header.
        rootMargin: `-${headerOffset}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // `active` intentionally omitted: observer closure reads latest via state setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), headerOffset]);

  return active;
}
