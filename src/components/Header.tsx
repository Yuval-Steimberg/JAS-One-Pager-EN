import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { NAV, CONTACT, asset } from "@/content/site";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { MobileMenu } from "./MobileMenu";

const SECTION_IDS = NAV.map((n) => n.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const handleNav = useSmoothScroll(() => setMenuOpen(false));

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // Lock body scroll while the mobile menu is open + close on Esc.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const onLight = scrolled; // dark text once the cream bar appears

  return (
    <>
      <a
        href="#about"
        onClick={(e) => handleNav(e, "about")}
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        דילוג לתוכן
      </a>

      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-cream/90 shadow-soft backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <nav
          aria-label="ניווט ראשי"
          className="container flex h-[72px] items-center justify-between"
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNav(e, "home")}
            className="flex items-center"
            aria-label="Just A Second — לדף הבית"
          >
            <img
              src={asset("jas-logo.png")}
              alt="Just A Second"
              width={402}
              height={120}
              className={cn(
                "h-8 w-auto transition-all sm:h-9",
                // The logo art has an opaque light background; over the dark hero
                // we float it on a soft white chip so it reads as a badge.
                onLight
                  ? "rounded"
                  : "rounded-md bg-white/95 px-2.5 py-1.5 shadow-soft"
              )}
            />
          </a>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((nav) => {
              const isActive = active === nav.id;
              return (
                <li key={nav.id} className="relative">
                  <a
                    href={`#${nav.id}`}
                    onClick={(e) => handleNav(e, nav.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      onLight
                        ? isActive
                          ? "text-ember"
                          : "text-forest/70 hover:text-forest"
                        : isActive
                          ? "text-white"
                          : "text-cream/80 hover:text-white"
                    )}
                  >
                    {nav.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ember"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={CONTACT.shop}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden rounded-full px-5 py-2 text-sm font-semibold transition-colors lg:inline-flex",
                onLight
                  ? "bg-ember text-white hover:bg-ember-600"
                  : "bg-cream text-forest hover:bg-white"
              )}
            >
              לחנות
            </a>
            <button
              type="button"
              aria-label="פתיחת התפריט"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={cn(
                "rounded-full p-2 transition-colors lg:hidden",
                onLight ? "text-forest hover:bg-forest/5" : "text-cream hover:bg-white/10"
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        active={active}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNav}
      />
    </>
  );
}
