"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import Background from "@/components/Background";

interface WelcomeScreenProps {
  /** Fires the moment the screen starts lifting away. Use it to start revealing the page. */
  onExitStart?: () => void;
  /** Fires once the screen has fully left. Unmount it here. */
  onComplete?: () => void;
  logo?: ReactNode;
  title?: string;
  tagline?: string;
  /** Shown one after another while the bar fills. "Ready" is appended automatically. */
  loadingMessages?: string[];
}

/* ── Timeline (ms) ── */
const WELCOME_MS = 2600; // welcome text holds on screen
const LOADING_MS = 2200; // loading bar goes 0 → 100
const HOLD_MS = 350; // beat at 100% before leaving
const EXIT_MS = 1200; // screen lifts away

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Layout ──
   The screen is a size container, so cqw / cqh are the screen's own width and height.
   --u   : one "unit" = the smaller of 1% width or 1.5% height, so the whole composition
           keeps the same proportions on phones, tablets, desktops and ultrawides.
   --logo: logo square, limited by width, height and an absolute cap.
   Vertical zones (text : logo : loader) always split 3 : 5.5 : 1.5. */
const ZONES = "minmax(0,3fr) minmax(0,5.5fr) minmax(0,1.5fr)";
const SCREEN_VARS = {
  containerType: "size",
  "--u": "min(1cqw, 1.5cqh)",
  "--logo": "min(72cqw, 52cqh, 640px)",
} as CSSProperties;

/** n units, never smaller than minPx — keeps small type readable on small screens. */
const fluid = (n: number, minPx = 0) => `max(${minPx}px, calc(var(--u) * ${n}))`;

const C = {
  bg: "#050505",
  bloodRed: "#3B0505",
  crimson: "#720909",
  conquerorRed: "#A30D0D",
  emberRed: "#D5220F",
  inferno: "#FF3B16",
};

type Stage = "welcome" | "loading" | "exit";

function EnergyLine({ delay = 0, reverse = false }: { delay?: number; reverse?: boolean }) {
  return (
    <div className="relative" style={{ width: fluid(34, 120), maxWidth: "80cqw" }}>
      <motion.div
        className="h-[1px] w-full"
        style={{ backgroundColor: C.crimson, transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: 0.7, ease: EASE }}
      />
      <motion.div
        className="absolute top-0 h-[1px] w-[30%]"
        style={{ background: `linear-gradient(90deg, transparent, ${C.inferno}CC, transparent)` }}
        initial={{ left: reverse ? "100%" : "-30%", opacity: 0 }}
        animate={{ left: reverse ? "-30%" : "100%", opacity: [0, 1, 1, 0] }}
        transition={{ delay: delay + 0.12, duration: 0.65, ease: EASE }}
      />
      <motion.div
        className="absolute top-0 left-0 h-[2px] w-full blur-sm"
        style={{ backgroundColor: C.crimson }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: delay + 0.55, duration: 0.45 }}
      />
    </div>
  );
}

export default function WelcomeScreen({
  onExitStart,
  onComplete,
  logo,
  title = "WELCOME",
  tagline = "TO THE FORCE OF MY LEGACY",
  loadingMessages = ["Stoking the embers", "Forging the interface", "Summoning the legacy"],
}: WelcomeScreenProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("welcome");
  const [labelIndex, setLabelIndex] = useState(0);

  // Callbacks live in a ref so a parent re-render can't restart the timeline.
  const callbacks = useRef({ onExitStart, onComplete });
  callbacks.current = { onExitStart, onComplete };

  // One motion value (0–100) drives the bar, the counter, the glow and the label.
  const progress = useMotionValue(0);
  const barScale = useTransform(progress, (v) => v / 100);
  const headLeft = useTransform(progress, (v) => `${v}%`);
  const percent = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const heatOpacity = useTransform(progress, [0, 100], [0, 0.4]);
  const heatScale = useTransform(progress, [0, 100], [0.8, 1.1]);

  const labels = [...loadingMessages, "Ready"];

  // Title split into words → letters, so long titles wrap at word breaks on narrow screens.
  const words = useMemo(() => {
    let i = 0;
    return title.split(" ").map((w) => Array.from(w).map((ch) => ({ ch, i: i++ })));
  }, [title]);

  const embers = useMemo(() => {
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return Array.from({ length: 18 }).map((_, i) => ({
      size: Math.random() * 2.5 + 1,
      left: Math.random() * 100,
      color: [C.inferno, C.emberRed, C.crimson][i % 3],
      dur: Math.random() * 3 + 4,
      delay: Math.random() * 5,
      yDist: h * (Math.random() * 0.45 + 0.3),
      xDrift: (Math.random() - 0.5) * 60,
    }));
  }, []);

  // Timeline: welcome → loading → exit → done
  useEffect(() => {
    const welcomeMs = reduceMotion ? 600 : WELCOME_MS;
    const loadingMs = reduceMotion ? 900 : LOADING_MS;
    const exitMs = reduceMotion ? 400 : EXIT_MS;
    const exitAt = welcomeMs + loadingMs + HOLD_MS;

    let fill: { stop: () => void } | undefined;
    const timers = [
      window.setTimeout(() => {
        setStage("loading");
        fill = animate(progress, 100, { duration: loadingMs / 1000, ease: [0.4, 0, 0.2, 1] });
      }, welcomeMs),
      window.setTimeout(() => {
        setStage("exit");
        callbacks.current.onExitStart?.();
      }, exitAt),
      window.setTimeout(() => callbacks.current.onComplete?.(), exitAt + exitMs),
    ];

    return () => {
      timers.forEach(window.clearTimeout);
      fill?.stop();
    };
  }, [reduceMotion, progress]);

  // Swap the status line as the bar fills
  useEffect(
    () =>
      progress.on("change", (v) => {
        const n = loadingMessages.length;
        setLabelIndex(v >= 100 ? n : Math.min(Math.floor(v / (100 / n)), n - 1));
      }),
    [progress, loadingMessages.length],
  );

  const inWelcome = stage === "welcome";
  const leaving = stage === "exit";

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        role="status"
        aria-label="Loading"
        className="fixed inset-0 z-50 overflow-hidden"
        style={{ backgroundColor: C.bg, ...SCREEN_VARS }}
        animate={leaving ? { y: "-110%", opacity: 0, scale: 0.97 } : { y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: (reduceMotion ? 400 : EXIT_MS) / 1000, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* LAYER 0: Background (filaments) — it sets its own z-index 0 */}
        <Background />

        {/* LAYER 1: Low ember glow along the bottom edge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `radial-gradient(ellipse 75% 45% at 50% 100%, ${C.crimson}55, ${C.bloodRed}22 50%, transparent 78%)`,
          }}
          aria-hidden="true"
        />

        {/* LAYER 2: Embers */}
        {!reduceMotion && (
          <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
            {embers.map((e, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: e.size,
                  height: e.size,
                  left: `${e.left}%`,
                  bottom: "5%",
                  backgroundColor: e.color,
                  boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
                }}
                animate={{ y: [0, -e.yDist], x: [0, e.xDrift], opacity: [0, 0.7, 0.3, 0] }}
                transition={{ duration: e.dur, repeat: Infinity, delay: e.delay, ease: "easeOut" }}
              />
            ))}
          </div>
        )}

        {/* LAYER 3: Vignette */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 70% at 50% 40%, transparent 50%, ${C.bg}44 75%, ${C.bg}66 100%)`,
          }}
          aria-hidden="true"
        />

        {/* LAYER 4: Scan grain */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 2px,${C.bg} 2px,${C.bg} 4px)`,
          }}
          aria-hidden="true"
        />

        {/* ═══ CONTENT — three zones, 3 : 5.5 : 1.5 ═══ */}
        <div
          className="relative z-10 h-full grid"
          style={{
            gridTemplateRows: ZONES,
            padding:
              "env(safe-area-inset-top) max(4cqw, env(safe-area-inset-right)) env(safe-area-inset-bottom) max(4cqw, env(safe-area-inset-left))",
          }}
        >
          {/* ZONE 1 — welcome text (fades out when loading begins) */}
          <div className="min-h-0 flex flex-col items-center justify-end" style={{ paddingBottom: fluid(1.5, 6) }}>
            <motion.div
              className="flex flex-col items-center max-w-full"
              animate={
                inWelcome
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: -28, filter: "blur(10px)" }
              }
              transition={{ duration: 0.7, ease: EASE }}
            >
              <EnergyLine delay={0.2} />

              <div
                className="flex flex-wrap items-baseline justify-center text-center"
                style={{
                  fontSize: fluid(10.5, 28),
                  columnGap: "0.3em",
                  margin: `${fluid(1.2, 8)} 0 ${fluid(0.9, 6)}`,
                  perspective: "5em",
                }}
              >
                {words.map((word, wi) => (
                  <span key={wi} className="inline-flex whitespace-nowrap">
                    {word.map(({ ch, i }) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        style={{
                          fontFamily: "'Cinzel Decorative','Cinzel',serif",
                          fontWeight: 900,
                          fontSize: "1em",
                          lineHeight: 1.1,
                          letterSpacing: "0.04em",
                          color: C.inferno,
                          textShadow: `0 0 0.05em ${C.emberRed}AA, 0 0 0.17em ${C.crimson}55, 0 0 0.33em ${C.bloodRed}22`,
                        }}
                        initial={{ y: 55, opacity: 0, rotateX: -70, filter: "blur(6px)" }}
                        animate={{ y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.55 + i * 0.06, duration: 0.7, ease: EASE }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </div>

              <motion.p
                className="text-center"
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: fluid(1.1, 10),
                  letterSpacing: "0.38em",
                  textWrap: "balance",
                  color: C.emberRed,
                  marginBottom: fluid(1.2, 8),
                }}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 1.25, duration: 0.85, ease: EASE }}
              >
                {tagline}
              </motion.p>

              <EnergyLine delay={1.45} reverse />
            </motion.div>
          </div>

          {/* ZONE 2 — logo (stays put across both stages) */}
          <div className="min-h-0 relative flex items-center justify-center">
            {/* Reveal burst */}
            <motion.div
              className="absolute rounded-full blur-3xl"
              style={{
                width: "calc(var(--logo) * 1.5)",
                height: "calc(var(--logo) * 1.5)",
                background: `radial-gradient(circle,${C.crimson}55,${C.bloodRed}28 35%,transparent 60%)`,
              }}
              initial={{ opacity: 0, scale: 0.25 }}
              animate={{ opacity: [0, 0.6, 0.3], scale: [0.25, 1.3, 1] }}
              transition={{ delay: 1.3, duration: 1.5, ease: "easeOut" }}
              aria-hidden="true"
            />

            {/* Slow pulse */}
            <motion.div
              className="absolute rounded-full blur-3xl"
              style={{
                width: "calc(var(--logo) * 1.4)",
                height: "calc(var(--logo) * 1.4)",
                background: `radial-gradient(circle,${C.emberRed}38,${C.conquerorRed}18 40%,transparent 60%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0.06, 0.15, 0.06] }}
              transition={{ delay: 2, duration: 5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />

            {/* Heat — builds with the loading bar */}
            <motion.div
              className="absolute rounded-full blur-2xl"
              style={{
                width: "calc(var(--logo) * 1.1)",
                height: "calc(var(--logo) * 1.1)",
                background: `radial-gradient(circle,${C.inferno}55,${C.emberRed}22 45%,transparent 68%)`,
                opacity: heatOpacity,
                scale: heatScale,
              }}
              aria-hidden="true"
            />

            {/* Logo */}
            <motion.div
              className="relative flex items-center justify-center"
              style={{
                width: "var(--logo)",
                height: "var(--logo)",
                filter: `
                  drop-shadow(0 0 calc(var(--logo) * 0.02) ${C.emberRed}44)
                  drop-shadow(0 0 calc(var(--logo) * 0.06) ${C.crimson}28)
                `,
              }}
              initial={{ opacity: 0, y: 30, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.45, duration: 1, ease: EASE }}
            >
              <motion.div
                className="w-full h-full flex items-center justify-center"
                animate={stage === "loading" ? { scale: [1, 1.035, 1] } : { scale: 1 }}
                transition={
                  stage === "loading"
                    ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.4 }
                }
              >
                {logo ?? <img src="/logo-nobg.png" alt="Logo" className="w-full h-full object-contain" />}
              </motion.div>
            </motion.div>
          </div>

          {/* ZONE 3 — loader (fades in as the welcome text leaves) */}
          <div className="min-h-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="flex flex-col items-center"
              style={{ width: "min(72cqw, max(220px, calc(var(--u) * 26)))", gap: fluid(1.1, 8) }}
              initial={{ opacity: 0, y: 16 }}
              animate={inWelcome ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: inWelcome ? 0 : 0.35 }}
            >
              <div className="flex items-center overflow-hidden" style={{ height: fluid(1.6, 16) }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={labelIndex}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: fluid(1, 10),
                      letterSpacing: "0.32em",
                      color: C.emberRed,
                    }}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {labels[labelIndex].toUpperCase()}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="relative h-[2px] w-full" style={{ backgroundColor: `${C.crimson}55` }}>
                <motion.div
                  className="absolute inset-y-0 left-0 w-full origin-left"
                  style={{
                    scaleX: barScale,
                    background: `linear-gradient(90deg, ${C.crimson}, ${C.emberRed}, ${C.inferno})`,
                  }}
                />
                <motion.span
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: headLeft,
                    width: fluid(0.5, 6),
                    height: fluid(0.5, 6),
                    backgroundColor: C.inferno,
                    boxShadow: `0 0 10px 2px ${C.inferno}, 0 0 24px 6px ${C.emberRed}88`,
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: fluid(1.1, 11),
                  letterSpacing: "0.2em",
                  fontVariantNumeric: "tabular-nums",
                  color: C.emberRed,
                  opacity: 0.7,
                }}
              >
                <motion.span>{percent}</motion.span>%
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}