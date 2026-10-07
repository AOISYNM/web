import { useEffect, useRef } from "react";

/**
 * BLACKFIRE FORGE 🔥 — Authentic Viking forge fire with Conqueror's Haki intensity.
 * Bellows-pumped white-hot core, coal bed, trailing forge sparks, rising ash,
 * Haki power surges. No dependencies besides React.
 * (Next.js: add "use client" at the top.)
 */

// ─── BLACKFIRE PALETTE ───
const BLOOD: RGB = [59, 5, 5]; // #3B0505
const CRIMSON: RGB = [114, 9, 9]; // #720909
const CONQUEROR: RGB = [163, 13, 13]; // #A30D0D
const EMBER: RGB = [213, 34, 15]; // #D5220F
const INFERNO: RGB = [255, 59, 22]; // #FF3B16

// ─── FORGE-SPECIFIC ───
// Real forge fire: the base is white-hot where bellows force air through coals
const WHITE_HOT: RGB = [255, 245, 215]; // searing white-hot core
const FORGE_GOLD: RGB = [255, 178, 48]; // hot amber gold
const COAL_GLOW: RGB = [200, 38, 10]; // glowing coal surface

type RGB = [number, number, number];

// Flame gradient: white-hot base → blood-red vanishing tip
const FLAME_GRADIENT: [number, RGB][] = [
  [0, WHITE_HOT],
  [0.06, FORGE_GOLD],
  [0.18, INFERNO],
  [0.38, EMBER],
  [0.6, CONQUEROR],
  [0.82, CRIMSON],
  [1, BLOOD],
];

function flameColorAt(p: number): string {
  p = Math.max(0, Math.min(1, p));
  for (let i = 1; i < FLAME_GRADIENT.length; i++) {
    if (p <= FLAME_GRADIENT[i][0]) {
      const [p0, c0] = FLAME_GRADIENT[i - 1];
      const [p1, c1] = FLAME_GRADIENT[i];
      const t = (p - p0) / (p1 - p0);
      return `${Math.round(c0[0] + (c1[0] - c0[0]) * t)},${Math.round(
        c0[1] + (c1[1] - c0[1]) * t
      )},${Math.round(c0[2] + (c1[2] - c0[2]) * t)}`;
    }
  }
  return BLOOD.join(",");
}

// ─── DATA STRUCTURES ───

interface Coal {
  x: number;
  y: number;
  size: number;
  phase: number;
  brightness: number;
}

interface Filament {
  pts: { x: number; y: number }[];
  x: number;
  y: number;
  cx: number;
  speed: number;
  phase: number;
  width: number;
  reach: number;
  prog: number;
}

interface ForgeSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  phase: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface AshParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  phase: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;

export default function FireBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const TRAIL_LEN = 42; // longer trails = fuller flame body
    const SPARK_TRAIL_LEN = 7;
    let W = 0,
      H = 0;
    let filaments: Filament[] = [];
    let sparks: ForgeSpark[] = [];
    let ash: AshParticle[] = [];
    let coals: Coal[] = [];
    let clusters: { base: number; spread: number; seed: number }[] = [];
    let raf = 0;
    let last = performance.now();
    let time = 0;

    // ─── BELLOWS: Viking smith's rhythmic air pump ───
    // This is what makes it feel like a FORGE, not just fire.
    // Primary pump = slow powerful stroke
    // Secondary = faster lighter puff
    // Surge = rare Conqueror's Haki burst
    const bellows = (t: number): number => {
      const pump1 = Math.pow(Math.max(0, Math.sin(t * 1.6)), 2.8);
      const pump2 = Math.pow(Math.max(0, Math.sin(t * 3.1 + 1.0)), 3.5);
      const surge =
        Math.pow(Math.max(0, Math.sin(t * 0.55 + 0.3)), 10) * 0.7;
      return 0.5 + 0.32 * pump1 + 0.18 * pump2 + surge;
    };

    const clusterX = (i: number) =>
      clusters[i].base +
      Math.sin(time * 0.25 + clusters[i].seed) * 65 * bellows(time);

    // ─── SPAWN ───

    const spawn = (f: Filament, initial = false) => {
      const i = Math.floor(Math.random() * clusters.length);
      const c = clusters[i];
      const cx = clusterX(i);
      const dx = gauss() * c.spread * 1.3;
      const centerBoost = Math.exp(
        -(dx * dx) / (2 * c.spread * c.spread)
      );
      const bStr = bellows(time);

      f.cx = cx;
      f.x = cx + dx;
      f.reach =
        rand(0.18, 0.68) *
        H *
        (0.3 + 0.7 * centerBoost) *
        (0.65 + 0.55 * bStr);
      f.y = H + 12 - (initial ? rand(0, f.reach * 0.92) : 0);
      f.speed = rand(95, 290) * (0.55 + 0.65 * bStr);
      f.phase = rand(0, Math.PI * 2);
      f.width = rand(0.9, 2.8); // thicker strands for forge body
      f.prog = 0;
      f.pts = [{ x: f.x, y: f.y }];
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.ceil(W / 360) + 1;
      clusters = Array.from({ length: n }, (_, i) => ({
        base: ((i + 0.5) / n) * W + rand(-45, 45),
        spread: rand(75, 155),
        seed: rand(0, Math.PI * 2),
      }));

      // Denser filament count for volumetric forge fire
      const count = Math.min(Math.max(Math.floor(W / 3.8), 180), 480);
      filaments = Array.from({ length: count }, () => {
        const f = {} as Filament;
        spawn(f, true);
        return f;
      });

      sparks = [];
      ash = [];

      // ── Generate coal bed ──
      coals = [];
      const coalCount = Math.floor(W / 11);
      for (let i = 0; i < coalCount; i++) {
        coals.push({
          x: rand(-20, W + 20),
          y: H - rand(0, 42),
          size: rand(2.5, 14),
          phase: rand(0, Math.PI * 2),
          brightness: rand(0.25, 1),
        });
      }
    };

    const spawnSpark = (initial = false) => {
      const i = Math.floor(Math.random() * clusters.length);
      const cx = clusterX(i);
      const bStr = bellows(time);
      // 12% chance of a big hammer-strike spark
      const isHammerSpark = Math.random() < 0.12;
      const r = Math.random();

      sparks.push({
        x: cx + gauss() * clusters[i].spread * 1.5,
        y: initial ? rand(H * 0.15, H) : H - rand(0, 25),
        vx: rand(-35, 35) * (isHammerSpark ? 2.5 : 1),
        vy:
          -rand(90, 380) *
          (0.45 + 0.85 * bStr) *
          (isHammerSpark ? 1.6 : 1),
        life: initial ? rand(0.25, 1) : 1,
        decay: 1 / rand(0.9, isHammerSpark ? 5.5 : 3.8),
        size: isHammerSpark ? rand(1.8, 4) : rand(0.4, 2),
        phase: rand(0, Math.PI * 2),
        color:
          r < 0.45
            ? "255,215,130"
            : r < 0.7
              ? "255,248,210"
              : r < 0.88
                ? "255,59,22"
                : "213,34,15",
        trail: [],
      });
    };

    const spawnAsh = (initial = false) => {
      const i = Math.floor(Math.random() * clusters.length);
      ash.push({
        x: clusterX(i) + gauss() * clusters[i].spread * 2.2,
        y: initial ? rand(H * 0.05, H * 0.75) : H - rand(15, 90),
        vx: rand(-12, 12),
        vy: -rand(18, 70),
        life: initial ? rand(0.15, 0.7) : 1,
        decay: 1 / rand(2.5, 7),
        size: rand(1.5, 5),
        phase: rand(0, Math.PI * 2),
      });
    };

    // ─── STEP ───

    const step = (dt: number) => {
      time += dt;
      const bStr = bellows(time);

      // Filaments — forge turbulence is chaotic and bellows-driven
      for (const f of filaments) {
        f.prog = Math.min((H + 12 - f.y) / f.reach, 1);
        const turb = (0.45 + f.prog * 2.2) * (0.65 + 0.7 * bStr);
        const vx =
          (Math.sin(f.y * 0.012 + time * 1.7 + f.phase) * 70 +
            Math.sin(f.x * 0.008 - time * 0.95 + f.phase * 2.2) * 50 +
            Math.cos(f.y * 0.026 + time * 3.0 + f.phase) * 28 +
            // High-frequency forge chaos
            Math.sin(f.y * 0.048 + time * 4.5 + f.phase * 0.6) * 15) *
          turb;
        const vy = -f.speed * (1 - f.prog * 0.42);
        f.x += vx * dt;
        f.y += vy * dt;
        // Stronger base cohesion = forge flame shape (wide base, narrowing tip)
        f.x += (f.cx - f.x) * (0.22 + 0.12 * bStr) * dt * (1 - f.prog * 0.75);

        f.pts.push({ x: f.x, y: f.y });
        if (f.pts.length > TRAIL_LEN) f.pts.shift();
        if (f.prog >= 1) spawn(f);
      }

      // Forge sparks with trailing
      if (!reduceMotion) {
        const rate = (W / 12) * dt * (0.5 + 0.9 * bStr);
        if (sparks.length < 400) {
          for (
            let n = 0;
            n < rate + (Math.random() < rate % 1 ? 1 : 0);
            n++
          )
            spawnSpark();
        }
      }
      sparks = sparks.filter((s) => s.life > 0 && s.y > -30);
      for (const s of sparks) {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > SPARK_TRAIL_LEN) s.trail.shift();
        s.vx += (Math.random() - 0.5) * 520 * dt;
        s.vx *= 1 - 1.3 * dt;
        s.vy += 35 * dt; // gravity pulls cooling sparks down
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= s.decay * dt;
      }

      // Ash / smoke rising above the forge
      if (!reduceMotion) {
        if (ash.length < 90 && Math.random() < 0.35 * dt * 60) spawnAsh();
      }
      ash = ash.filter((a) => a.life > 0 && a.y > -30);
      for (const a of ash) {
        a.vx += Math.sin(time * 0.7 + a.phase) * 10 * dt;
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.life -= a.decay * dt;
      }
    };

    // ─── DRAW ───

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const bStr = bellows(time);

      // ── AMBIENT HAKI GLOW: subtle blood-red wash across the entire scene ──
      // This is the Conqueror's presence — the fire suffuses everything
      const hakiPulse =
        0.02 + 0.015 * Math.sin(time * 1.6) + 0.01 * Math.sin(time * 0.55);
      const hakiStr = hakiPulse * (0.5 + 0.8 * bStr);
      ctx.fillStyle = `rgba(${BLOOD.join(",")},${hakiStr})`;
      ctx.fillRect(0, 0, W, H);

      // ── COAL BED: glowing embers at the forge floor ──
      for (const c of coals) {
        const pulse =
          0.5 +
          0.3 * Math.sin(time * 1.4 + c.phase) +
          0.2 * Math.sin(time * 3.6 + c.phase * 2.1);
        const bright = c.brightness * pulse * (0.55 + 0.45 * bStr);
        if (bright < 0.04) continue;

        // Coal outer glow
        const gr = ctx.createRadialGradient(
          c.x,
          c.y,
          0,
          c.x,
          c.y,
          c.size * 2.5
        );
        gr.addColorStop(
          0,
          `rgba(${COAL_GLOW.join(",")},${bright * 0.35})`
        );
        gr.addColorStop(
          0.5,
          `rgba(${CRIMSON.join(",")},${bright * 0.15})`
        );
        gr.addColorStop(1, "rgba(59,5,5,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(
          c.x - c.size * 2.5,
          c.y - c.size * 2.5,
          c.size * 5,
          c.size * 5
        );

        // Coal hot core — brighter dot
        ctx.fillStyle = `rgba(${EMBER.join(",")},${bright * 0.5})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── HEAT GLOW (additive blending from here) ──
      ctx.globalCompositeOperation = "lighter";

      const glowPulse =
        0.22 + 0.1 * Math.sin(time * 1.6) + 0.06 * Math.sin(time * 4.2);
      const glowStr = glowPulse * (0.55 + 0.65 * bStr);

      for (let i = 0; i < clusters.length; i++) {
        const cx = clusterX(i);
        const sp = clusters[i].spread;

        // Broad warm forge glow
        const r1 = sp * 4.5;
        const g1 = ctx.createRadialGradient(cx, H + 35, 0, cx, H + 35, r1);
        g1.addColorStop(
          0,
          `rgba(${EMBER.join(",")},${glowStr * 0.45})`
        );
        g1.addColorStop(
          0.25,
          `rgba(${CRIMSON.join(",")},${glowStr * 0.25})`
        );
        g1.addColorStop(
          0.6,
          `rgba(${BLOOD.join(",")},${glowStr * 0.08})`
        );
        g1.addColorStop(1, "rgba(59,5,5,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(cx - r1, H + 35 - r1, r1 * 2, r1 * 2);

        // Intense white-hot core glow (this is the forge heart)
        const r2 = sp * 1.6;
        const g2 = ctx.createRadialGradient(cx, H + 8, 0, cx, H + 8, r2);
        g2.addColorStop(
          0,
          `rgba(${WHITE_HOT.join(",")},${glowStr * 0.12})`
        );
        g2.addColorStop(
          0.25,
          `rgba(${FORGE_GOLD.join(",")},${glowStr * 0.18})`
        );
        g2.addColorStop(
          0.55,
          `rgba(${INFERNO.join(",")},${glowStr * 0.12})`
        );
        g2.addColorStop(1, "rgba(114,9,9,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(cx - r2, H + 8 - r2, r2 * 2, r2 * 2);
      }

      // ── FIRE STRANDS: 4-segment gradient per trail ──
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const bMod = 0.65 + 0.35 * bStr;

      for (const f of filaments) {
        const n = f.pts.length;
        if (n < 4) continue;
        const col = flameColorAt(f.prog);
        const life = Math.pow(1 - f.prog, 0.9); // slower fade = fuller body
        const segments = 4;
        const seg = Math.ceil(n / segments);

        for (let s = 0; s < segments; s++) {
          const from = Math.max(s * seg - 1, 0);
          const to = Math.min((s + 1) * seg, n - 1);
          if (to <= from) continue;
          const k = (s + 1) / segments;

          ctx.beginPath();
          ctx.moveTo(f.pts[from].x, f.pts[from].y);
          for (let j = from + 1; j <= to; j++)
            ctx.lineTo(f.pts[j].x, f.pts[j].y);

          ctx.strokeStyle = `rgba(${col},${life * 0.6 * k * k * bMod})`;
          ctx.lineWidth =
            f.width * (0.25 + 0.75 * k) * (0.75 + 0.5 * (1 - f.prog));
          ctx.stroke();
        }
      }

      // ── FORGE SPARKS: trailing, halos, bright cores ──
      for (const s of sparks) {
        const a =
          Math.max(s.life, 0) *
          (0.55 + 0.45 * Math.sin(time * 26 + s.phase));

        // Spark trail (the streak behind a flying ember)
        if (s.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let j = 1; j < s.trail.length; j++) {
            ctx.lineTo(s.trail[j].x, s.trail[j].y);
          }
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = `rgba(${s.color},${a * 0.25})`;
          ctx.lineWidth = s.size * 0.5;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Spark glow halo
        ctx.fillStyle = `rgba(${s.color},${a * 0.1})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4.5, 0, Math.PI * 2);
        ctx.fill();
        // Spark bright core
        ctx.fillStyle = `rgba(${s.color},${a * 0.95})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── ASH / SMOKE: dark particles drifting above the forge ──
      ctx.globalCompositeOperation = "source-over";
      for (const a of ash) {
        const alpha = Math.max(a.life, 0) * 0.12;
        ctx.fillStyle = `rgba(20,14,10,${alpha})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── VIGNETTE: darken edges, focus the forge ──
      const vigGrad = ctx.createRadialGradient(
        W / 2,
        H,
        0,
        W / 2,
        H,
        Math.max(W, H) * 0.85
      );
      vigGrad.addColorStop(0, "rgba(5,5,5,0)");
      vigGrad.addColorStop(0.45, "rgba(5,5,5,0.1)");
      vigGrad.addColorStop(1, "rgba(5,5,5,0.55)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "source-over";
    };

    // ── ANIMATION LOOP ──
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    build();
    for (let i = 0; i < 100; i++) spawnSpark(true);
    for (let i = 0; i < 30; i++) spawnAsh(true);
    // Warm up so the first frame already looks like a roaring forge
    for (let i = 0; i < 80; i++) step(1 / 60);
    draw();
    if (!reduceMotion) raf = requestAnimationFrame(frame);

    const onResize = () => {
      build();
      for (let i = 0; i < 100; i++) spawnSpark(true);
      for (let i = 0; i < 80; i++) step(1 / 60);
      draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "#050505", // Obsidian Black
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}