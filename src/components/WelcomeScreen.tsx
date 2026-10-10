"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import backgroundImage from "../assets/background.png";
import testing from "../assets/testing.png";
interface WelcomeScreenProps {
  isExiting: boolean;
  logo?: ReactNode;
  fireBackground?: ReactNode;
}

const C = {
  bg: "#050505",
  card: "#0D0D0D",
  border: "#161616",
  bloodRed: "#3B0505",
  crimson: "#720909",
  conquerorRed: "#A30D0D",
  emberRed: "#D5220F",
  inferno: "#FF3B16",
};

const FILAMENTS = [
  { d: "M 60,230 Q 200,155 400,255 T 580,185", delay: 1.1, dur: 1.1 },
  { d: "M 940,210 Q 800,135 600,235 T 420,175", delay: 1.3, dur: 1.1 },
  { d: "M 100,470 Q 240,415 380,480", delay: 1.5, dur: 0.85 },
  { d: "M 900,455 Q 760,395 620,465", delay: 1.7, dur: 0.85 },
  { d: "M 500,70 Q 518,230 488,400 T 508,540", delay: 1.4, dur: 1.2 },
];

export default function WelcomeScreen({ isExiting, logo, fireBackground }: WelcomeScreenProps) {
  const [phase, setPhase] = useState(0);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const [vh, setVh] = useState(() => typeof window !== "undefined" ? window.innerHeight : 800);
  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const embers = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        size: Math.random() * 2.5 + 1,
        left: Math.random() * 100,
        color: [C.inferno, C.emberRed, C.crimson][i % 3],
        dur: Math.random() * 3 + 4,
        delay: Math.random() * 5,
        yDist: Math.random() * 500 + 300,
        xDrift: (Math.random() - 0.5) * 60,
      })),
    [],
  );

  useEffect(() => {
    if (reducedMotion) {
      setPhase(5);
      return;
    }
    const t = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1300),
      setTimeout(() => setPhase(4), 1600),
      setTimeout(() => setPhase(5), 1900),
    ];
    return () => t.forEach(clearTimeout);
  }, [reducedMotion]);

  const exitY = isExiting ? -(vh + 100) : 0;

  const EnergyLine = ({ show, reverse = false }: { show: boolean; reverse?: boolean }) => (
    <div className="relative w-full max-w-[180px] sm:max-w-[260px] md:max-w-[340px] lg:max-w-[400px]">
      <motion.div
        className="h-[1px] w-full"
        style={{ backgroundColor: C.crimson, transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        animate={show ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute top-0 h-[1px] w-[30%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.inferno}CC, transparent)`,
        }}
        initial={{ left: reverse ? "100%" : "-30%", opacity: 0 }}
        animate={show ? { left: reverse ? "-30%" : "100%", opacity: [0, 1, 1, 0] } : {}}
        transition={{ delay: 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute top-0 left-0 h-[2px] w-full blur-sm"
        style={{ backgroundColor: C.crimson }}
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 0.3 } : {}}
        transition={{ delay: 0.55, duration: 0.45 }}
      />
    </div>
  );

  return (
    <motion.section
      className="fixed inset-0 z-50 overflow-hidden"
      animate={{ y: exitY, opacity: isExiting ? 0 : 1, scale: isExiting ? 0.97 : 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* LAYER 0: Background image */}
<img
  src={testing}
  alt=""
  className="absolute inset-0 w-full h-full object-cover pointer-events-none
             object-[center_40%] sm:object-[center_35%] md:object-[center_30%] lg:object-[center_25%]"
  style={{ zIndex: 0 }}
  aria-hidden="true"
/>

      {/* LAYER 1: Subtle dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity :0,
          zIndex: 1,
          background: "rgba(5, 5, 5, 0.03)"
        }}
        aria-hidden="true"
      />

      {/* LAYER 2: Fire background */}
{fireBackground && (
  <div
    className="absolute inset-0 pointer-events-none overflow-hidden"
    style={{ zIndex: 2, mixBlendMode: "screen" , opacity: 0.85}}
  >
    {fireBackground}
  </div>
)}

      {/* ═══ LAYER 3: Embers ═══ */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {embers.map((e, i) => (
          <motion.div
            key={`e${i}`}
            className="absolute rounded-full"
            style={{
              width: e.size,
              height: e.size,
              left: `${e.left}%`,
              bottom: "5%",
              backgroundColor: e.color,
              boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
            }}
            animate={{
              y: [0, -e.yDist],
              x: [0, e.xDrift],
              opacity: [0, 0.7, 0.3, 0],
            }}
            transition={{
              duration: e.dur,
              repeat: Infinity,
              delay: e.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

     {/* ═══ LAYER 4: Vignette ═══ */}
<div
  className="absolute inset-0 z-[4] pointer-events-none"
  style={{
    background: `radial-gradient(ellipse 80% 70% at 50% 40%, transparent 50%, ${C.bg}44 75%, ${C.bg}66 100%)`,
  }}
/>

      {/* ═══ LAYER 5: Scan grain ═══ */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 2px,${C.bg} 2px,${C.bg} 4px)`,
        }}
      />

      {/* ═══ LAYER 6: Atmospheric filaments ═══ */}
      <svg
        className="absolute inset-0 w-full h-full z-[6] pointer-events-none"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {FILAMENTS.map((f, i) => (
          <motion.path
            key={`f${i}`}
            d={f.d}
            stroke={C.crimson}
            strokeWidth={0.55}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase >= 5 ? { pathLength: 1, opacity: 0.3 } : {}}
            transition={{
              pathLength: { delay: f.delay - 1.0, duration: f.dur, ease: "easeOut" },
              opacity: { delay: f.delay - 1.0, duration: f.dur * 1.4, ease: "easeOut" },
            }}
          />
        ))}
      </svg>

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10 h-full flex flex-col items-center justify-start pt-[7vh] sm:pt-[9vh] md:pt-[12vh] px-4 sm:px-6">

        {/* Upper energy line */}
        <div className="mb-3 sm:mb-4 md:mb-5">
          <EnergyLine show={phase >= 1} />
        </div>

        {/* WELCOME */}
        <div className="flex items-baseline justify-center mb-1.5 sm:mb-2 md:mb-2.5" style={{ perspective: 600 }}>
          {"WELCOME".split("").map((ch, i) => (
            <motion.span
              key={`w${i}`}
              className="inline-block"
              style={{
                fontFamily: "'Cinzel Decorative','Cinzel',serif",
                fontWeight: 900,
                fontSize: "clamp(2rem,8vw,7.5rem)",
                letterSpacing: "0.04em",
                color: C.inferno,
                textShadow: `0 0 6px ${C.emberRed}AA,0 0 20px ${C.crimson}55,0 0 40px ${C.bloodRed}22`,
              }}
              initial={{ y: 55, opacity: 0, rotateX: -70, filter: "blur(6px)" }}
              animate={phase >= 2 ? { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.04 + i * 0.055, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          className="text-center mb-1"
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "clamp(0.45rem,1.4vw,0.9rem)",
            letterSpacing: "clamp(0.18em,0.55vw,0.5em)",
            color: C.emberRed,
          }}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={phase >= 3 ? { opacity: 0.85, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          TO THE FORCE OF MY LEGACY
        </motion.p>

        {/* Lower energy line */}
        <div className="mb-0">
          <EnergyLine show={phase >= 3} reverse />
        </div>

        {/* ═══ LOGO ═══ */}
        <div className="relative flex items-center justify-center -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">

          {/* Broad atmospheric glow — reveal burst */}
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              width: "clamp(260px,70vw,900px)",
              height: "clamp(260px,70vw,900px)",
              background: `radial-gradient(circle,${C.crimson}55,${C.bloodRed}28 35%,transparent 60%)`,
            }}
            initial={{ opacity: 0, scale: 0.25 }}
            animate={phase >= 4 ? { opacity: [0, 1, 0.55], scale: [0.25, 1.3, 1] } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Continuous pulse glow */}
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              width: "clamp(220px,65vw,850px)",
              height: "clamp(220px,65vw,850px)",
              background: `radial-gradient(circle,${C.emberRed}38,${C.conquerorRed}18 40%,transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: [0, 0.35, 0.12, 0.3, 0.12] } : {}}
            transition={{ delay: 1.6, duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Tight inferno rim */}
          <motion.div
            className="absolute rounded-full blur-xl"
            style={{
              width: "clamp(160px,42vw,550px)",
              height: "clamp(160px,42vw,550px)",
              background: `radial-gradient(circle,transparent 45%,${C.inferno}20 65%,transparent 80%)`,
            }}
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: [0, 0.9, 0.5] } : {}}
            transition={{ delay: 0.3, duration: 1.0, ease: "easeOut" }}
          />

          {/* Logo */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{
              width: "clamp(150px,42vw,520px)",
              height: "clamp(150px,42vw,520px)",
              filter: `
                drop-shadow(0 0 14px ${C.emberRed}77)
                drop-shadow(0 0 35px ${C.crimson}44)
                drop-shadow(0 0 60px ${C.bloodRed}28)
              `,
            }}
            initial={{ opacity: 0, y: 30, scale: 0.82 }}
            animate={phase >= 4 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {logo ?? (
              <img
                src="/logo-nobg.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>
        </div>

        {/* Scroll chevron */}
        {phase >= 5 && (
          <motion.div
            className="absolute bottom-5 sm:bottom-7 md:bottom-9 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                <path
                  d="M1 1L7 7L13 1"
                  stroke={C.emberRed}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}