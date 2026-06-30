"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { CursorGlow } from "@/components/CursorGlow";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

/**
 * Wraps the app in MotionConfig (respects OS reduce-motion) and mounts
 * the global CursorGlow + ScrollProgressBar overlays.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CursorGlow />
      <ScrollProgressBar />
      {children}
    </MotionConfig>
  );
}
