import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────────
   Configuration
   ────────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
] as const;

const SCROLL_THRESHOLD = 50;
const NAVBAR_HEIGHT = 64;
const LOGO_SRC = "/logo-name.png";

/* ──────────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────────── */

interface NavbarProps {
  /** When false the bar is hidden above the viewport; flip to true to trigger
   *  the roll-down entrance. */
  visible?: boolean;
}

export default function Navbar({ visible = true }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  /* ── Close mobile menu whenever the navbar hides ─────────────────────────── */

  useEffect(() => {
    if (!visible) setMobileOpen(false);
  }, [visible]);

  /* ── Scroll state ───────────────────────────────────────────────────────── */

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active-section detection (IntersectionObserver) ─────────────────────── */

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
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

      if (!best && visibleSections.size > 0) best = Array.from(visibleSections)[0];
      if (best) setActiveSection(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visibleSections.add(e.target.id);
          else visibleSections.delete(e.target.id);
        });
        resolve();
      },
      { rootMargin: `-${NAVBAR_HEIGHT}px 0px -40% 0px`, threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── scroll-margin-top on each section ───────────────────────────────────── */

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    els.forEach((el) => (el.style.scrollMarginTop = `${NAVBAR_HEIGHT}px`));
    return () => els.forEach((el) => (el.style.scrollMarginTop = ""));
  }, []);

  /* ── Close mobile menu on resize to desktop ──────────────────────────────── */

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Lock body scroll while mobile menu is open ─────────────────────────── */

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ── Handlers ───────────────────────────────────────────────────────────── */

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    },
    []
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ─── Fixed Navigation Bar ────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={
          visible
            ? { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0.3 }
        }
        aria-label="Main navigation"
        aria-hidden={!visible}
        className={`fixed top-0 inset-x-0 z-50 flex items-center h-16 transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
          !visible ? "pointer-events-none" : ""
        } ${
          isScrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#161616] shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="PUNJAN — back to top"
            className="relative shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30D0D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            {logoFailed ? (
              <span className="block text-white font-semibold text-lg tracking-[0.18em] uppercase select-none">
                PUNJAN
              </span>
            ) : (
              <img
                src={LOGO_SRC}
                alt="PUNJAN"
                className="block h-8 w-auto select-none"
                draggable={false}
                onError={() => setLogoFailed(true)}
              />
            )}
          </motion.button>

          {/* ── Desktop Links ────────────────────────────────────────────── */}
          <div
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="Section links"
          >
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-3 py-2 text-[11px] font-medium tracking-[0.16em] uppercase rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30D0D] ${
                    isActive
                      ? "text-white"
                      : "text-[#777777] hover:text-[#cccccc]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`pointer-events-none absolute bottom-0 left-3 right-3 h-[1.5px] origin-center transition-[transform,opacity] duration-300 ease-out ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0"
                    }`}
                    style={{ backgroundColor: "#A30D0D" }}
                  />
                </a>
              );
            })}
          </div>

          {/* ── Desktop CTA ──────────────────────────────────────────────── */}
          <motion.a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="hidden md:inline-flex items-center ml-5 px-4 py-[7px] text-[11px] font-medium tracking-[0.16em] uppercase text-[#bbbbbb] border border-[#2a2a2a] rounded-sm transition-[color,border-color,background-color] duration-200 hover:text-white hover:border-[#A30D0D] hover:bg-[#A30D0D]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30D0D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Hire Me
          </motion.a>

          {/* ── Mobile Toggle ────────────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-sm text-[#999999] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30D0D]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <X size={20} strokeWidth={1.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Menu size={20} strokeWidth={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile Menu Overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && visible && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-16 z-40 md:hidden overflow-y-auto bg-[#050505]/[0.97] backdrop-blur-xl border-t border-[#161616]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-10">
              <div className="flex flex-col items-center gap-1 w-full max-w-[280px]">
                {NAV_LINKS.map((link, i) => {
                  const id = link.href.slice(1);
                  const isActive = activeSection === id;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      aria-current={isActive ? "true" : undefined}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`relative w-full text-center py-3.5 text-[13px] font-medium tracking-[0.2em] uppercase rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30D0D] ${
                        isActive
                          ? "text-white"
                          : "text-[#777777] hover:text-[#cccccc]"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-[1.5px] origin-center transition-[transform,opacity] duration-300 ease-out ${
                          isActive
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0"
                        }`}
                        style={{ backgroundColor: "#A30D0D" }}
                      />
                    </motion.a>
                  );
                })}

                {/* ── Mobile CTA ─────────────────────────────────────────── */}
                <motion.a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: NAV_LINKS.length * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-6 inline-flex items-center justify-center w-full max-w-[200px] py-2.5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#bbbbbb] border border-[#2a2a2a] rounded-sm transition-[color,border-color,background-color] duration-200 hover:text-white hover:border-[#A30D0D] hover:bg-[#A30D0D]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30D0D]"
                >
                  Hire Me
                </motion.a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}