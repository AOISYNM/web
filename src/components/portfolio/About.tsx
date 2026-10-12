import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Terminal, Brain, Sparkles } from "lucide-react";
import ScrollReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ScrollReveal";

/**
 * About
 * Content comes only from the details provided:
 * B.Sc. CSIT student · Kathmandu, Nepal · self-taught · started with Python,
 * AI, LLMs and ASI · focused on ML & Deep Learning · seeking internship/job.
 *
 * PROFILE_IMAGE: put your LinkedIn photo in /public as profile.jpg,
 * or change this path (or import it from src/assets and assign it here).
 */
const PROFILE_IMAGE = "/profile.jpg";

const displayFont = { fontFamily: "'Cinzel Decorative', 'Cinzel', serif" };
const bodyFont = { fontFamily: "'Cinzel', serif" };

const traits = [
  { icon: BookOpen, label: "Self-Taught Learner" },
  { icon: Terminal, label: "Python" },
  { icon: Brain, label: "ML & Deep Learning" },
  { icon: Sparkles, label: "LLMs & ASI" },
];

export default function About() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 md:py-32"
    >
      {/* Crimson seam separating this section from the one above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#720909] to-transparent"
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* DOM order = mobile order: heading → photo → text */}
        <div className="grid items-start gap-y-12 lg:grid-cols-[1fr_380px] lg:gap-x-20 lg:gap-y-10 xl:gap-x-28">
          {/* Heading */}
          <div className="lg:col-start-1 lg:row-start-1">
            <ScrollReveal direction="left" distance={80} duration={0.9}>
              <h2
                id="about-heading"
                style={{
                  ...displayFont,
                  fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
                }}
                className="pb-1 text-center font-black leading-[1.08] tracking-[0.02em] lg:text-left"
              >
                <span className="block text-[#E8E5E0]">Who</span>{" "}
                {/* Padding + matching negative margin enlarges the gradient's paint
                    area so the decorative swashes aren't clipped, without moving the text */}
                <span className="-mx-[0.2em] -mt-[0.1em] block bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.2em] pb-[0.15em] pt-[0.1em] text-transparent">
                  I Am
                </span>
              </h2>
            </ScrollReveal>
          </div>

          {/* Photo */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <ScrollReveal delay={0.2}>
              <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-xs lg:mx-0 lg:max-w-none">
                {/* Ember glow behind the frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-8 -z-10"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(163,13,13,0.25) 0%, transparent 65%)",
                  }}
                />
                {/* Offset crimson frame */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg border border-[#720909]"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#E8E5E0]/10 bg-[#161616]">
                  {imgFailed ? (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={displayFont}
                    >
                      <span className="text-6xl font-black text-[#D5220F]">
                        PP
                      </span>
                    </div>
                  ) : (
                    <img
                      src={PROFILE_IMAGE}
                      alt="Portrait of Punjan Pandey"
                      loading="lazy"
                      decoding="async"
                      onError={() => setImgFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505]/70 to-transparent"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Text */}
          <div
            style={bodyFont}
            className="mx-auto max-w-xl space-y-7 text-base leading-[1.9] tracking-[0.02em] text-[#9A9692] sm:text-lg md:space-y-8 lg:col-start-1 lg:row-start-2 lg:mx-0"
          >
            <ScrollReveal delay={0.15}>
              <p>
                I'm Punjan Pandey, a{" "}
                <strong className="font-bold text-[#FF3B16]">
                  B.Sc. CSIT student
                </strong>{" "}
                from{" "}
                <strong className="font-bold text-[#FF3B16]">
                  Kathmandu, Nepal
                </strong>
                .
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p>
                My path into technology started with curiosity about Python,
                AI, LLMs, and artificial superintelligence (ASI). My skills are{" "}
                <strong className="font-bold text-[#E8E5E0]">
                  entirely self-taught
                </strong>
                .
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.45}>
              <p>
                Right now, I'm focused on{" "}
                <strong className="font-bold text-[#FF3B16]">
                  machine learning and deep learning
                </strong>
                , and I'm looking for an internship or job where I can put
                that learning to work.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Focus cards */}
        <StaggerContainer
          className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 md:mt-24 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {traits.map((trait) => (
            <StaggerItem key={trait.label} direction="left" distance={50}>
              <motion.div
                className="group flex h-full flex-col items-center justify-center rounded-lg border border-[#E8E5E0]/10 bg-gradient-to-br from-[#161616] to-[#0D0D0D] p-5 text-center transition-colors duration-300 hover:border-[#D5220F]/60 sm:p-8"
                style={{ boxShadow: "0 0 0px rgba(213,34,15,0)" }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 28px rgba(213,34,15,0.25)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <trait.icon
                  aria-hidden="true"
                  className="mb-4 h-9 w-9 text-[#FF3B16] transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-12 sm:w-12"
                />
                <p
                  style={bodyFont}
                  className="break-words text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8E5E0] sm:text-[11px] sm:tracking-[0.25em]"
                >
                  {trait.label}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}