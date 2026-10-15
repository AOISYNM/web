import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const LOGO_SRC = "/logo-name.png"; // same logo as the navbar
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const displayFont = { fontFamily: "'Cinzel Decorative', 'Cinzel', serif" };
const bodyFont = { fontFamily: "'Cinzel', serif" };

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/AOISYNM",
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/punjanpnd/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:punjanpandey@gmail.com",
    icon: Mail,
    external: false,
  },
];

export default function Footer() {
  const reduce = useReducedMotion();
  const m = reduce ? 0 : 1; // 0 removes movement, leaving fades only
  const [logoFailed, setLogoFailed] = useState(false);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  /* ---------------------------------------------------------------- */
  /*  Motion presets (same as the other sections)                      */
  /* ---------------------------------------------------------------- */
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 * m },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <footer className="relative overflow-hidden bg-[#050505]">
      {/* Crimson seam separating the footer from the section above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#720909] to-transparent"
      />

      {/* Soft ember glow rising from the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 90% at 50% 100%, rgba(114,9,9,0.28) 0%, rgba(59,5,5,0.12) 45%, transparent 75%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="container relative mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-16"
      >
        {/* Logo + (social icons with copyright beneath): stacked and centered
            on phones/tablets, logo left and icons/copyright right from lg up */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <motion.div variants={fadeUp}>
            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label="PUNJAN — back to top"
              className="relative rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              {logoFailed ? (
                <span
                  style={displayFont}
                  className="block select-none text-4xl font-black tracking-[0.08em] text-[#E8E5E0] sm:text-5xl lg:text-6xl"
                >
                  PUNJAN
                </span>
              ) : (
                <img
                  src={LOGO_SRC}
                  alt="PUNJAN"
                  decoding="async"
                  draggable={false}
                  onError={() => setLogoFailed(true)}
                  className="block h-24 w-auto max-w-[70vw] select-none object-contain sm:h-28 lg:h-36"
                />
              )}
            </motion.button>
          </motion.div>

          {/* Icons with the copyright directly beneath them */}
          <div className="flex flex-col items-center gap-5 lg:items-end">
            <motion.ul
              variants={fadeUp}
              className="flex items-center gap-6"
              aria-label="Social links"
            >
              {socials.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={
                      external ? `${label} (opens in a new tab)` : "Send me an email"
                    }
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-none border border-[#E8E5E0]/15 text-[#E8E5E0] transition-colors duration-300 hover:border-[#D5220F]/70 hover:bg-[#D5220F]/10 hover:text-[#FF3B16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />

                    {/* Corner brackets that draw outward on hover (same as the buttons) */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-2 -top-2 h-2 w-2 border-l-2 border-t-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-left-[11px] group-hover:-top-[11px] group-hover:border-[#FF3B16]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-2 -right-2 h-2 w-2 border-b-2 border-r-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-bottom-[11px] group-hover:-right-[11px] group-hover:border-[#FF3B16]"
                    />
                  </motion.a>
                </li>
              ))}
            </motion.ul>

            <motion.p
              variants={fadeUp}
              style={bodyFont}
              className="text-center text-xs tracking-[0.12em] text-[#9A9692] sm:text-sm lg:text-right"
            >
              © {new Date().getFullYear()} Punjan Pandey. All rights reserved.
            </motion.p>
          </div>
        </div>

        {/* Divider line sits below everything */}
        <motion.div variants={fadeUp} className="mt-10 sm:mt-12">
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-[#720909]/60 to-transparent lg:from-[#720909]/60"
          />
        </motion.div>
      </motion.div>
    </footer>
  );
}