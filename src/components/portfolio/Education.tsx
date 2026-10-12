import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Theme                                                              */
/* ------------------------------------------------------------------ */
const FONT_DISPLAY = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_BODY = "'Cinzel', serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/*  Data: single source of truth, newest first                         */
/*  Dates are shown as given: the B.Sc. in AD, the +2 and SEE in BS.   */
/* ------------------------------------------------------------------ */
const education = [
  {
    degree: "BSc. CSIT",
    detail: "Computer Science and Information Technology",
    school: "Patan Multiple Campus",
    location: "Patan Dhoka, Lalitpur",
    period: "2025 – Present",
    current: true,
  },
  {
    degree: "+2 Science",
    detail: "Higher Secondary Education",
    school: "KCCS",
    location: "Soaltee Mode, Kathmandu",
    period: "Completed 2082 BS",
    current: false,
  },
  {
    degree: "SEE",
    detail: "Secondary Education Examination",
    school: "Nepalaya Education Foundation",
    location: "Kathmandu",
    period: "Completed 2079 BS",
    current: false,
  },
];

export default function Education() {
  const reduce = useReducedMotion();
  const m = reduce ? 0 : 1; // 0 removes every movement offset, leaving fades only

  /* ---------------------------------------------------------------- */
  /*  Motion presets                                                   */
  /* ---------------------------------------------------------------- */
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 * m },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
  };

  const slideLeft: Variants = {
    hidden: { opacity: 0, x: -60 * m },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: 60 * m },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 md:py-32"
    >
      {/* Crimson seam separating this section from the one above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#720909] to-transparent"
      />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* ---------- Header: centered below lg, left-aligned from lg up ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto mb-14 max-w-2xl text-center md:mb-20 lg:mx-0 lg:text-left"
        >
          <motion.h2
            id="education-heading"
            variants={fadeUp}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(2rem, 9vw, 5.5rem)",
            }}
            className="pb-1 font-black leading-[1.08] tracking-[0.02em]"
          >
            <span className="block text-[#E8E5E0]">Academic</span>{" "}
            {/* Padding + matching negative margin keeps the decorative swash
                from being clipped by the gradient's paint area */}
            <span className="-mx-[0.2em] -mt-[0.1em] block bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.2em] pb-[0.15em] pt-[0.1em] text-transparent">
              Journey
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{ fontFamily: FONT_BODY }}
            className="mt-6 text-base leading-[1.9] tracking-[0.02em] text-[#9A9692] sm:text-lg"
          >
            My education so far, from SEE in Kathmandu to a B.Sc. in Computer
            Science and Information Technology at Patan Multiple Campus.
            Alongside my studies, I'm teaching myself machine learning and deep
            learning.
          </motion.p>
        </motion.div>

        {/* ---------- Timeline ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Fire rail: draws in from the top, fading into the past */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 left-4 top-7 -ml-[0.5px] w-[1px] origin-top bg-gradient-to-b from-[#FF3B16] via-[#A30D0D] to-transparent md:left-1/2 md:top-10"
            initial={{ scaleY: reduce ? 1 : 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0.4 : 1.4, ease: EASE }}
          />

          {education.map((edu, i) => {
            const isRight = i % 2 === 0; // newest entry sits on the right at md+

            return (
              <motion.div
                key={edu.degree}
                variants={fade}
                className="relative mb-16 last:mb-0 md:mb-20"
              >
                {/* Node: sits on the rail; the current one pulses */}
                <motion.div
                  aria-hidden="true"
                  className="absolute left-4 top-7 z-10 md:left-1/2 md:top-10"
                  style={{ x: "-50%" }}
                  whileHover={{
                    scale: 1.8,
                    boxShadow:
                      "0 0 30px rgba(255,59,22,0.6), 0 0 60px rgba(114,9,9,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {edu.current && !reduce && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#FF3B16]/40"
                      animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                  <div className="h-4 w-4 rounded-full border-[3px] border-[#050505] bg-gradient-to-br from-[#FF3B16] to-[#720909] shadow-[0_0_12px_rgba(213,34,15,0.45)] md:h-5 md:w-5" />
                </motion.div>

                {/* Card: indented past the rail on phones, alternating on md+ */}
                <div className="pl-10 md:pl-0">
                  <div className="md:grid md:grid-cols-2 md:gap-16">
                    <motion.div
                      variants={isRight ? slideRight : slideLeft}
                      className={isRight ? "md:col-start-2" : "md:col-start-1"}
                    >
                      <motion.article
                        style={{
                          boxShadow: edu.current
                            ? "0 0 40px rgba(213,34,15,0.12), 0 0 0px rgba(59,5,5,0)"
                            : "0 0 0px rgba(255,59,22,0), 0 0 0px rgba(59,5,5,0)",
                        }}
                        whileHover={{
                          x: isRight ? -10 : 10,
                          boxShadow:
                            "0 0 25px rgba(255,59,22,0.18), 0 0 50px rgba(59,5,5,0.35)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                        className={`group rounded-lg border bg-gradient-to-br from-[#161616] to-[#0D0D0D] p-5 transition-colors duration-500 hover:border-[#D5220F]/50 sm:p-8 md:p-10 ${
                          edu.current
                            ? "border-[#D5220F]/40"
                            : "border-[#E8E5E0]/10"
                        }`}
                      >
                        <div
                          className={`flex flex-col items-start gap-4 text-left sm:gap-5 ${
                            isRight ? "" : "md:items-end md:text-right"
                          }`}
                        >
                          {/* Status + period */}
                          <div
                            className={`flex flex-wrap items-center gap-3 ${
                              isRight ? "" : "md:justify-end"
                            }`}
                          >
                            {edu.current && (
                              <span
                                style={{ fontFamily: FONT_BODY }}
                                className={`py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF3B16] ${
                                  isRight
                                    ? "border-l-2 border-[#FF3B16] bg-gradient-to-r from-[#D5220F]/20 to-transparent pl-3 pr-5"
                                    : "border-l-2 border-[#FF3B16] bg-gradient-to-r from-[#D5220F]/20 to-transparent pl-3 pr-5 md:border-l-0 md:border-r-2 md:bg-gradient-to-l md:pl-5 md:pr-3"
                                }`}
                              >
                                Running
                              </span>
                            )}
                            <span
                              style={{ fontFamily: FONT_BODY }}
                              className="rounded-md bg-[#E8E5E0]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A9692] md:text-xs"
                            >
                              {edu.period}
                            </span>
                          </div>

                          {/*  */}
                          <div className="flex flex-col gap-2">
                            <h3
                              style={{ fontFamily: FONT_DISPLAY }}
                              className="break-words text-[1.75rem] font-bold leading-[1.1] tracking-[0.02em] text-[#E8E5E0] transition-colors duration-300 group-hover:text-[#FF3B16] sm:text-4xl md:text-[2.75rem]"
                            >
                              {edu.degree}
                            </h3>
                            <p
                              style={{ fontFamily: FONT_BODY }}
                              className="text-sm leading-relaxed tracking-[0.02em] text-[#9A9692] md:text-base"
                            >
                              {edu.detail}
                            </p>
                          </div>

                          {/* School + location */}
                          <div className="flex flex-col gap-2">
                            <p
                              style={{ fontFamily: FONT_BODY }}
                              className="break-words text-base font-bold uppercase tracking-[0.06em] text-[#E8E5E0] md:text-lg"
                            >
                              {edu.school}
                            </p>
                            <p
                              style={{ fontFamily: FONT_BODY }}
                              className="text-xs uppercase tracking-[0.2em] text-[#9A9692]"
                            >
                              {edu.location}
                            </p>
                          </div>
                        </div>
                      </motion.article>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}