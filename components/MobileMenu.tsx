"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { NAV, CONTACT, asset } from "@/data/siteContent";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  active: string;
  onClose: () => void;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const panel: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { type: "spring", stiffness: 260, damping: 30 } },
  exit: { x: "100%", transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

const list: Variants = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0 },
};

/** Full-screen animated mobile navigation. Traps nothing fancy but is keyboard
 *  and screen-reader friendly (role=dialog, Esc to close, focusable links). */
export function MobileMenu({ open, active, onClose, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          initial="hidden"
          animate="show"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="תפריט ניווט"
        >
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="סגירת התפריט"
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* panel */}
          <motion.nav
            variants={panel}
            className="absolute inset-y-0 end-0 flex w-[82%] max-w-sm flex-col bg-ivory shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <img src={asset("jas-logo.png")} alt="Just A Second" className="h-9 w-auto" />
              <button
                type="button"
                onClick={onClose}
                aria-label="סגירת התפריט"
                className="rounded-full p-2 text-ink transition-colors hover:bg-ink/5"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <motion.ul variants={list} className="flex flex-col gap-1 px-4 py-6">
              {NAV.map((nav) => (
                <motion.li key={nav.id} variants={item}>
                  <a
                    href={`#${nav.id}`}
                    onClick={(e) => onNavigate(e, nav.id)}
                    aria-current={active === nav.id ? "true" : undefined}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-lg font-medium transition-colors",
                      active === nav.id
                        ? "bg-clay/10 text-clay"
                        : "text-ink hover:bg-ink/5"
                    )}
                  >
                    {nav.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-auto border-t border-ink/10 p-6">
              <a href={CONTACT.whatsapp} className="btn-primary w-full" target="_blank" rel="noopener noreferrer">
                דברו איתנו בוואטסאפ
              </a>
              <p className="mt-4 text-center text-sm text-ink/50">{CONTACT.address}</p>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}