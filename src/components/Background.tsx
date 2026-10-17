"use client";

import { motion, useReducedMotion } from "framer-motion";

const CRIMSON = "#720909";

// Same paths as WelcomeScreen's "Atmospheric filaments" layer.
// Coordinates live in a 1000×700 viewBox; delay/dur are in seconds.
const FILAMENTS = [
  { d: "M 60,230 Q 200,155 400,255 T 580,185", delay: 1.1, dur: 1.1 },
  { d: "M 940,210 Q 800,135 600,235 T 420,175", delay: 1.3, dur: 1.1 },
  { d: "M 100,470 Q 240,415 380,480", delay: 1.5, dur: 0.85 },
  { d: "M 900,455 Q 760,395 620,465", delay: 1.7, dur: 0.85 },
  { d: "M 500,70 Q 518,230 488,400 T 508,540", delay: 1.4, dur: 1.2 },
];

interface BackgroundProps {
  /** Start drawing the lines. Defaults to true; pass your own trigger (e.g. `phase >= 5`) to delay them. */
  active?: boolean;
  /** Color behind the lines. Transparent by default so it can sit over an image. */
  background?: string;
}

export default function Background({
  active = true,
  background = "transparent",
}: BackgroundProps) {
  const reduceMotion = useReducedMotion();
  const show = active || !!reduceMotion;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background,
      }}
    >
      <svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {FILAMENTS.map((f, i) => (
          <motion.path
            key={i}
            d={f.d}
            stroke={CRIMSON}
            strokeWidth={0.55}
            fill="none"
            strokeLinecap="round"
            // Reduced motion: render fully drawn, no animation
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={show ? { pathLength: 1, opacity: 0.3 } : {}}
            transition={{
              // original delays were offset from the 1.0s mark of the welcome sequence
              pathLength: { delay: f.delay - 1.0, duration: f.dur, ease: "easeOut" },
              opacity: { delay: f.delay - 1.0, duration: f.dur * 1.4, ease: "easeOut" },
            }}
          />
        ))}
      </svg>
    </div>
  );
}