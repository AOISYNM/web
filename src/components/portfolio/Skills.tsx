import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import ScrollReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ScrollReveal";

/**
 * Skills
 * Skill names come from the details provided, limited to the 4 strongest
 * per group.
 *
 * ⚠️ PLACEHOLDER LEVELS: the percentages below (skill bars AND radar) are
 * estimates, not facts. Replace each `level` / radar value with your own
 * honest number before publishing.
 * Skills at HIGH_LEVEL or above use the brighter Inferno Orange style.
 */

const HIGH_LEVEL = 70;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const displayFont = { fontFamily: "'Cinzel Decorative', 'Cinzel', serif" };
const bodyFont = { fontFamily: "'Cinzel', serif" };

type Skill = { name: string; level: number };

const categories: { title: string; skills: Skill[] }[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", level: 75 },
      { name: "JavaScript", level: 60 },
      { name: "C", level: 55 },
    ],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      { name: "NumPy", level: 70 },
      { name: "Pandas", level: 75 },
      { name: "Scikit-learn", level: 70 },
      { name: "TensorFlow", level: 50 },
    ],
  },
  {
    title: "Web Development",
    skills: [
      { name: "HTML", level: 80 },
      { name: "CSS", level: 70 },
      { name: "React", level: 65 },
      { name: "Django", level: 55 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "VS Code", level: 85 },
      { name: "Jupyter Notebook", level: 80 },
      { name: "Git & GitHub", level: 70 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  RADAR DATA: edit the numbers here whenever you update (scale 0–100) */
/* ------------------------------------------------------------------ */

/**
 * Each series below becomes one shape on the radar.
 * - Order here = drawing order (the first one sits at the back).
 * - To add a series: add it here, then add a value for it in every row of
 *   `radarData`. To remove one: delete it here and from the rows.
 */
const radarConfig = {
  current: { color: "#FF3B16" },
} satisfies ChartConfig;

type RadarKey = keyof typeof radarConfig;
type RadarRow = { topic: string; description: string } & Record<
  RadarKey,
  number
>;

const radarData: RadarRow[] = [
  {
    topic: "Logical Thinking",
    description: "Breaking complex problems into structured steps",
    current: 80,

  },
  {
    topic: "Problem Solving",
    description: "Finding effective solutions to difficult challenges",
    current: 75,

  },
  {
    topic: "Technical Knowledge",
    description: "Understanding programming concepts and systems",
    current: 75,

  },
  {
    topic: "AI & Computational Thinking",
    description: "Exploring intelligent systems, ML, DL and NLP",
    current: 65,

  },
  {
    topic: "Creativity & Innovation",
    description: "Turning ideas into original digital solutions",
    current: 80,

  },
  {
    topic: "Learning Agility",
    description: "Adapting quickly and learning unfamiliar technologies",
    current: 85,

  },
];

const radarKeys = Object.keys(radarConfig) as RadarKey[];

/** Splits a long axis label into short lines so it fits on small screens */
function wrapLabel(text: string, maxChars = 13) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const TICK_LINE_HEIGHT = 1.2; // em

/** Custom axis label: wraps onto several lines, grows away from the chart */
function RadarAxisTick({
  x = 0,
  y = 0,
  index = 0,
  payload,
  textAnchor,
}: {
  x?: number;
  y?: number;
  index?: number;
  payload?: { value: string };
  textAnchor?: "start" | "middle" | "end" | "inherit";
}) {
  const lines = wrapLabel(payload?.value ?? "");
  // Labels near the top extend upward, labels near the bottom extend downward
  const angle = ((90 - (360 * index) / radarData.length) * Math.PI) / 180;
  const lift =
    ((1 + Math.sin(angle)) / 2) * (lines.length - 1) * TICK_LINE_HEIGHT;

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="#E8E5E0"
      style={bodyFont}
      className="text-[9px] font-bold tracking-[0.06em] sm:text-[11px]"
    >
      {lines.map((line, i) => (
        <tspan
          key={line}
          x={x}
          dy={i === 0 ? `${0.35 - lift}em` : `${TICK_LINE_HEIGHT}em`}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

type RadarTooltipProps = {
  active?: boolean;
  payload?: {
    dataKey?: string | number;
    value?: number | string;
    payload?: RadarRow;
  }[];
};

/** Tooltip styled to match the site (independent of the shadcn theme) */
function RadarTooltip({ active, payload }: RadarTooltipProps) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div
      style={bodyFont}
      className="max-w-[220px] rounded-md border border-[#E8E5E0]/10 bg-[#0D0D0D]/95 px-3 py-2.5 shadow-[0_0_24px_rgba(213,34,15,0.25)] backdrop-blur"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF3B16]">
        {row.topic}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#9A9692]">
        {row.description}
      </p>
      <div className="mt-2.5 flex flex-col gap-1">
        {[...payload].reverse().map((item) => {
          const key = item.dataKey as RadarKey;
          const cfg = radarConfig[key];
          if (!cfg) return null;
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 text-[11px] font-bold tracking-widest text-[#E8E5E0]"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
              </span>
              <span>{item.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillRadar() {
  const ref = useRef<HTMLDivElement>(null);
  // Mount the chart when it scrolls into view so its draw-in animation is seen
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  const ariaLabel = `Radar chart of core strengths: ${radarData
    .map((r) => `${r.topic} ${r.current} percent`)
    .join(", ")}`;

  return (
    <div className="relative overflow-hidden rounded-lg border border-[#E8E5E0]/10 bg-[#0D0D0D] p-6 sm:p-8 md:p-10">
      {/* Soft crimson glow behind the chart */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(213,34,15,0.16),transparent_62%)]"
      />

      <div className="relative flex flex-col items-start">
        <h3
          style={bodyFont}
          className="mb-4 max-w-full border-l-2 border-[#FF3B16] bg-gradient-to-r from-[#D5220F]/20 to-transparent py-1.5 pl-3 pr-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF3B16] md:text-[11px] md:tracking-[0.25em]"
        >
          Core Strengths
        </h3>

        <div
          ref={ref}
          role="img"
          aria-label={ariaLabel}
          className="mx-auto aspect-square w-full max-w-[440px]"
        >
          {inView && (
            <ChartContainer
              config={radarConfig}
              className="aspect-auto h-full w-full"
            >
              <RadarChart
                data={radarData}
                outerRadius="66%"
                margin={{ top: 28, right: 28, bottom: 28, left: 28 }}
              >
                <ChartTooltip cursor={false} content={<RadarTooltip />} />
                <PolarGrid stroke="#E8E5E0" strokeOpacity={0.14} />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={<RadarAxisTick />}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                {radarKeys.map((key) => (
                  <Radar
                    key={key}
                    dataKey={key}
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    fill={`var(--color-${key})`}
                    fillOpacity={key === "current" ? 0.5 : 0.3}
                    dot={{
                      r: 3,
                      fillOpacity: 1,
                      fill: `var(--color-${key})`,
                    }}
                    isAnimationActive={!reduceMotion}
                  />
                ))}
              </RadarChart>
            </ChartContainer>
          )}
        </div>

        {/* Legend */}
        <ul className="mt-6 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[...radarKeys].reverse().map((key) => (
            <li
              key={key}
              style={bodyFont}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A9692]"
            >
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillBar({
  name,
  level,
  delay,
}: {
  name: string;
  level: number;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const isHigh = level >= HIGH_LEVEL;

  return (
    <motion.div
      ref={ref}
      role="progressbar"
      aria-label={`${name} level`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={level}
      className="h-[3px] w-full overflow-hidden rounded-full bg-[#E8E5E0]/10 transition-[height] duration-300 hover:h-[4px]"
      style={{
        boxShadow: isHigh
          ? "0 0 0px rgba(255,59,22,0)"
          : "0 0 0px rgba(213,34,15,0)",
      }}
      whileHover={{
        boxShadow: isHigh
          ? "0 0 15px rgba(255,59,22,0.5)"
          : "0 0 15px rgba(213,34,15,0.5)",
      }}
    >
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${
          isHigh
            ? "from-[#D5220F] to-[#FF3B16]"
            : "from-[#A30D0D] to-[#D5220F]"
        }`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : {}}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.3, delay, ease: EASE }
        }
      />
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 md:py-32"
    >
      {/* Crimson seam separating this section from the one above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#720909] to-transparent"
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading + radar: stacked below lg (radar under the heading),
            side by side from lg up */}
        <div className="mb-14 grid grid-cols-1 items-center gap-12 md:mb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <ScrollReveal direction="up" distance={80} duration={0.9}>
            {/* Heading: centered below lg, left-aligned from lg up (same as About) */}
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <h2
                id="skills-heading"
                style={displayFont}
                className="pb-1 text-[clamp(2rem,9vw,5.5rem)] font-black leading-[1.08] tracking-[0.02em] lg:text-[clamp(3rem,5.5vw,4.75rem)]"
              >
                <span className="block text-[#E8E5E0]">Technical</span>{" "}
                {/* Padding + matching negative margin keeps the decorative swash
                    from being clipped by the gradient's paint area */}
                <span className="-mx-[0.2em] -mt-[0.1em] block bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.2em] pb-[0.15em] pt-[0.1em] text-transparent">
                  Stack
                </span>
              </h2>
              <p
                style={bodyFont}
                className="mt-6 text-base leading-[1.9] tracking-[0.02em] text-[#9A9692] sm:text-lg"
              >
                The languages, libraries and tools I work with, from Python and
                machine learning to web development. Everything here is
                self-taught: I started with Python, and my focus today is
                machine learning and deep learning. The percentages show where
                I am right now, and they change as I keep learning.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={80} duration={0.9}>
            <div className="mx-auto w-full max-w-xl lg:max-w-none">
              <SkillRadar />
            </div>
          </ScrollReveal>
        </div>

        {/* Skill groups: 1 column on phones, 2 x 2 from sm up */}
        <StaggerContainer
          className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#E8E5E0]/10 bg-[#E8E5E0]/10 sm:grid-cols-2"
          staggerDelay={0.12}
        >
          {categories.map((cat) => (
            <StaggerItem key={cat.title} direction="up" distance={40}>
              <div className="group flex h-full flex-col items-start bg-[#0D0D0D] p-6 transition-colors duration-500 hover:bg-[#161616] sm:p-8 md:p-10">
                <h3
                  style={bodyFont}
                  className="mb-8 max-w-full border-l-2 border-[#FF3B16] bg-gradient-to-r from-[#D5220F]/20 to-transparent py-1.5 pl-3 pr-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF3B16] transition-colors duration-300 group-hover:text-white md:mb-10 md:text-[11px] md:tracking-[0.25em]"
                >
                  {cat.title}
                </h3>

                <div className="flex w-full flex-col gap-6 md:gap-7">
                  {cat.skills.map((skill, si) => {
                    const isHigh = skill.level >= HIGH_LEVEL;
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.1 }}
                        className="flex flex-col gap-3"
                      >
                        <div className="flex items-end justify-between gap-3">
                          <span
                            style={bodyFont}
                            className={`min-w-0 break-words text-sm font-bold uppercase tracking-[0.08em] text-[#E8E5E0] transition-colors duration-300 md:text-base lg:text-lg ${
                              isHigh
                                ? "group-hover:text-[#FF3B16]"
                                : "group-hover:text-[#D5220F]"
                            }`}
                          >
                            {skill.name}
                          </span>
                          <span
                            style={bodyFont}
                            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-widest md:text-xs ${
                              isHigh
                                ? "bg-[#FF3B16]/10 text-[#FF3B16]"
                                : "bg-[#E8E5E0]/5 text-[#9A9692]"
                            }`}
                          >
                            {skill.level}%
                          </span>
                        </div>
                        <SkillBar
                          name={skill.name}
                          level={skill.level}
                          delay={0.3 + si * 0.1}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}