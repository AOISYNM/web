import { useState, useEffect, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
] as const;

const SCROLL_THRESHOLD = 50;
const NAVBAR_HEIGHT = 128;
const DESKTOP_MIN_WIDTH = 1024;
const LOGO_SRC = "/logo-name.png";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HIDE_DELTA = 10;
const HIDE_MIN_SCROLL = 120;

const displayFont = { fontFamily: "'Cinzel Decorative', 'Cinzel', serif" };
const bodyFont = { fontFamily: "'Cinzel', serif" };

interface NavbarProps {
  visible?: boolean;
}

export default function Navbar({ visible = true }: NavbarProps) {
  const reduce = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const showBar = visible && !hiddenByScroll;

  useEffect(() => {
    if (!showBar) setMobileOpen(false);
  }, [showBar]);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > SCROLL_THRESHOLD);

      if (mobileOpen) {
        lastY = y;
        return;
      }

      const delta = y - lastY;

      if (y <= 0) {
        setHiddenByScroll(false);
      } else if (delta > HIDE_DELTA && y > HIDE_MIN_SCROLL) {
        setHiddenByScroll(true);
      } else if (delta < -HIDE_DELTA) {
        setHiddenByScroll(false);
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.href.slice(1));
    const visibleSections = new Set<string>();

    const resolve = () => {
      let best = "";
      let bestTop = Infinity;

      visibleSections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top;

        if (top <= NAVBAR_HEIGHT + 120 && top < bestTop) {
          bestTop = top;
          best = id;
        }
      });

      if (!best && visibleSections.size > 0) {
        best = Array.from(visibleSections)[0];
      }

      setActiveSection(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        resolve();
      },
      {
        rootMargin: `-${NAVBAR_HEIGHT}px 0px -40% 0px`,
        threshold: 0,
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.href.slice(1));

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => {
      el.style.scrollMarginTop = `${NAVBAR_HEIGHT}px`;
    });

    return () => {
      elements.forEach((el) => {
        el.style.scrollMarginTop = "";
      });
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const goToSection = useCallback(
    (href: string) => {
      const el = document.getElementById(href.slice(1));

      if (el) {
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
        });
      }

      setMobileOpen(false);
    },
    [reduce]
  );

  const handleNavClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      goToSection(href);
    },
    [goToSection]
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });

    setMobileOpen(false);
  }, [reduce]);

  return (
    <>
      {/* Fixed Navigation Bar */}
      <motion.nav
        initial={{ y: -140, opacity: 0 }}
        animate={
          showBar
            ? { y: 0, opacity: 1 }
            : { y: -140, opacity: 0 }
        }
        transition={
          showBar
            ? { duration: reduce ? 0.2 : 0.65, ease: EASE }
            : { duration: 0.3 }
        }
        aria-label="Main navigation"
        aria-hidden={!showBar}
        className={`fixed inset-x-0 top-0 z-50 flex h-28 items-center transition-[background-color,border-color,box-shadow] duration-300 ease-out lg:h-32 ${
          !showBar ? "pointer-events-none" : ""
        } ${
          isScrolled || mobileOpen
            ? "border-b border-[#720909]/40 bg-[#050505]/90 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            aria-label="PUNJAN — back to top"
            className="relative shrink-0 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            {logoFailed ? (
              <span
                style={displayFont}
                className="block select-none text-5xl font-black leading-none tracking-[0.08em] text-[#E8E5E0] sm:text-[3.4rem]"
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
                className="block h-20 w-auto max-w-[58vw] select-none object-contain object-left sm:h-[88px] sm:max-w-none xl:h-24"
              />
            )}
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">
            <div
              className="flex items-center gap-1 xl:gap-2"
              role="navigation"
              aria-label="Section links"
            >
              {NAV_LINKS.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeSection === id;

                return (
                 <NavLink
  key={link.href}
  active={isActive}
  onClick={() => goToSection(link.href)}
  style={bodyFont}
  aria-current={isActive ? "page" : undefined}
  className={`group relative rounded-none bg-transparent px-3 text-xs uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-transparent focus:bg-transparent active:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] xl:px-4 ${
    isActive
      ? "!bg-transparent !text-[#FF3B16]"
      : "!bg-transparent !text-[#D8D4CF] hover:!text-[#FF3B16]"
  }`}
>
  {link.label}

  <span
    aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 -bottom-[6px] h-[2px] origin-center bg-gradient-to-r from-[#FF3B16] to-[#D5220F] transition-[transform,opacity] duration-300 ease-out ${
      isActive
        ? "scale-x-100 opacity-100 shadow-[0_0_10px_rgba(255,59,22,0.6)]"
        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
    }`}
  />
</NavLink>
                );
              })}
            </div>

            {/* Desktop Hire Me CTA */}
            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              style={bodyFont}
              className="group relative ml-5 inline-flex items-center rounded-none border-2 border-[#D5220D] bg-[#A30D0D] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#D5220F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] xl:ml-6"
            >
              Hire Me

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 -top-2 h-2 w-2 border-l-2 border-t-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-left-[11px] group-hover:-top-[11px] group-hover:border-[#FF3B16]"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -bottom-2 h-2 w-2 border-b-2 border-r-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-right-[11px] group-hover:-bottom-[11px] group-hover:border-[#FF3B16]"
              />
            </motion.a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E8E5E0]/15 bg-transparent text-[#E8E5E0] transition-colors duration-200 hover:border-[#D5220F]/60 hover:bg-transparent hover:text-[#FF3B16] focus:bg-transparent active:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{
                    rotate: reduce ? 0 : -90,
                    opacity: 0,
                  }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{
                    rotate: reduce ? 0 : 90,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <X size={22} strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{
                    rotate: reduce ? 0 : 90,
                    opacity: 0,
                  }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{
                    rotate: reduce ? 0 : -90,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Menu size={22} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile / Tablet Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && showBar && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-x-0 bottom-0 top-28 z-40 overflow-y-auto border-t border-[#720909]/40 bg-[#050505]/[0.98] backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Ember glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(114,9,9,0.4) 0%, rgba(59,5,5,0.2) 45%, transparent 75%)",
              }}
            />

            <nav className="relative flex min-h-[calc(100svh-7rem)] flex-col items-center justify-center px-6 py-10">
              <div className="flex w-full max-w-xs flex-col items-center gap-1">
                {NAV_LINKS.map((link, i) => {
                  const id = link.href.slice(1);
                  const isActive = activeSection === id;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{
                        opacity: 0,
                        y: reduce ? 0 : 14,
                      }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-full"
                    >
                      <NavLink
                        active={isActive}
                        onClick={() => goToSection(link.href)}
                        style={bodyFont}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative w-full rounded-none py-4 text-base uppercase tracking-[0.25em] transition-colors duration-200 ease-out hover:bg-transparent focus:bg-transparent active:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] ${
                          isActive
                            ? "!bg-transparent !text-[#FF3B16]"
                            : "!bg-transparent !text-white hover:!text-[#FF3B16]"
                        }`}
                      >
                        {link.label}

                        {/* Animated centered red underline */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute -bottom-2 left-1/2 h-[2px] w-10 -translate-x-1/2 origin-center bg-gradient-to-r from-[#FF3B16] to-[#D5220F] transition-[transform,opacity] duration-300 ease-out ${
                            isActive
                              ? "scale-x-100 opacity-100"
                              : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                          }`}
                        />
                      </NavLink>
                    </motion.div>
                  );
                })}

                {/* Mobile Hire Me CTA */}
                <motion.a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  initial={{
                    opacity: 0,
                    y: reduce ? 0 : 14,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: NAV_LINKS.length * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={bodyFont}
                  className="group relative mt-8 inline-flex h-14 w-full items-center justify-center rounded-none border-2 border-[#D5220D] bg-[#A30D0D] text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#D5220F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                >
                  Hire Me

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-2 -top-2 h-2 w-2 border-l-2 border-t-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-left-[11px] group-hover:-top-[11px] group-hover:border-[#FF3B16]"
                  />

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -bottom-2 h-2 w-2 border-b-2 border-r-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-right-[11px] group-hover:-bottom-[11px] group-hover:border-[#FF3B16]"
                  />
                </motion.a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}