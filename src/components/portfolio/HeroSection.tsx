import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Theme                                                              */
/* ------------------------------------------------------------------ */
const FONT_DISPLAY = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_BODY = "'Cinzel', serif";

const TYPE_TEXT = "I turn curiosity into intelligence-powered innovations";

/* ------------------------------------------------------------------ */
/*  Motion presets                                                     */
/* ------------------------------------------------------------------ */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 42 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

const lineDraw: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  show: { scaleY: 1, opacity: 1, transition: { duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  const [typedText, setTypedText] = useState("");

  /* Typewriter starts only once the section enters the viewport */
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const typingInterval = setInterval(() => {
      i += 1;
      setTypedText(TYPE_TEXT.substring(0, i));
      if (i >= TYPE_TEXT.length) clearInterval(typingInterval);
    }, 28);
    return () => clearInterval(typingInterval);
  }, [inView]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] py-24 md:py-28"
    >
      {/* Ember glow backdrop + divider from Welcome section */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[55%] h-[26rem] w-[min(90vw,60rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#720909]/25 blur-[140px] md:h-[32rem]" />
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#A30D0D]/60 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex w-full flex-col items-center text-center"
        >
          {/* Tag line */}
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: FONT_BODY }}
            className="mb-8 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D5220F] md:mb-10 md:text-xs md:tracking-[0.4em]"
          >
            Learning , Breaking  &amp; Building.
          </motion.p>

          {/* Name — burning type */}
          <motion.h1
            variants={fadeScale}
            style={{ fontFamily: FONT_DISPLAY }}
            className="mb-10 bg-gradient-to-b from-[#FF3B16] via-[#D5220F] to-[#720909] bg-clip-text text-[clamp(2.4rem,11.5vw,7rem)] font-black uppercase leading-[1.05] tracking-tight text-transparent drop-shadow-[0_0_28px_rgba(213,34,15,0.25)] md:mb-12"
          >
            PUNJAN
            <br />
            PANDEY
          </motion.h1>

          {/* Typewriter description */}
          <motion.div
            variants={fadeUp}
            style={{ fontFamily: FONT_BODY }}
            className="mb-10 h-auto min-h-[3.25rem] max-w-2xl text-base font-medium leading-relaxed text-[#E8E5E0] md:mb-12 md:min-h-12 md:text-xl"
          >
            <span className="inline-block">
              {typedText}
              <motion.span
                className="ml-1 inline-block text-[#FF3B16]"
                animate={{ opacity: [0, 1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                |
              </motion.span>
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: FONT_BODY }}
            className="mb-14 max-w-3xl text-sm leading-relaxed text-[#9A9692] md:mb-16 md:text-base"
          >
            Exploring the intelligence of machines to expand the possibilities of human creativity.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="mb-16 flex flex-col items-center justify-center gap-5 sm:flex-row md:gap-8"
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(213, 34, 15, 0.55)" }}
              whileTap={{ scale: 0.94 }}
            >
              <Button
                size="lg"
                style={{ fontFamily: FONT_BODY }}
                className="h-auto w-full rounded-lg border border-[#FF3B16]/40 bg-gradient-to-b from-[#D5220F] to-[#720909] px-10 py-5 text-sm font-bold uppercase tracking-wide text-[#E8E5E0] shadow-xl transition-all hover:from-[#FF3B16] hover:to-[#A30D0D] sm:w-auto md:px-12 md:py-6 md:text-base"
                onClick={() => scrollTo("#projects")}
              >
                View Projects
              </Button>
            </motion.div>

            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 59, 22, 0.35)" }}
              whileTap={{ scale: 0.94 }}
            >
              <Button
                variant="outline"
                size="lg"
                style={{ fontFamily: FONT_BODY }}
                className="h-auto w-full rounded-lg border-2 border-[#FF3B16]/70 bg-transparent px-10 py-5 text-sm font-bold uppercase tracking-wide text-[#FF3B16] transition-all hover:bg-[#FF3B16]/10 hover:text-[#FF3B16] sm:w-auto md:px-12 md:py-6 md:text-base"
                onClick={() => scrollTo("#contact")}
              >
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <motion.span
              style={{ fontFamily: FONT_BODY }}
              className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#9A9692]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Explore My Work
            </motion.span>
            <motion.div
              className="h-10 w-[1px] origin-top bg-gradient-to-b from-[#FF3B16] via-[#D5220D] to-transparent"
              variants={lineDraw}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}