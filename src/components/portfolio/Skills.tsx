import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import ScrollReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ScrollReveal";

/**
 * Skills
 * Skill names come from the details provided, limited to the 4 strongest
 * per group.
 *
 * ⚠️ PLACEHOLDER LEVELS: the percentages below are estimates, not facts.
 * Replace each `level` with your own honest number before publishing.
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
      { name: "Pandas", level: 70 },
      { name: "Scikit-learn", level: 60 },
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
      { name: "VS Code", level: 80 },
      { name: "Jupyter Notebook", level: 75 },
      { name: "Git & GitHub", level: 65 },
    ],
  },
];

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
        {/* Heading: centered below lg, left-aligned from lg up (same as About) */}
        <ScrollReveal direction="up" distance={80} duration={0.9}>
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20 lg:mx-0 lg:text-left">
            <h2
              id="skills-heading"
              style={{
                ...displayFont,
                fontSize: "clamp(2rem, 9vw, 5.5rem)",
              }}
              className="pb-1 font-black leading-[1.08] tracking-[0.02em]"
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
              self-taught: I started with Python, and my focus today is machine
              learning and deep learning. The percentages show where I am
              right now, and they change as I keep learning.
            </p>
          </div>
        </ScrollReveal>

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