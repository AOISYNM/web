import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";
import Projects from "@/components/portfolio/Projects";
import Footer from "@/components/portfolio/Footer";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Index() {
  const [showWelcome, setShowWelcome] = useState(true);
  // Flips when the welcome screen starts lifting away, so the page
  // rises into view as the screen leaves instead of after it.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showWelcome ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showWelcome]);

  return (
    <main className="min-h-screen bg-[#050505]">
      {showWelcome && (
        <WelcomeScreen
          logo={
            <img
              src="/logo-nobg.png"
              alt="PUNJAN"
              className="w-full h-full object-contain"
            />
          }
          onExitStart={() => setRevealed(true)}
          onComplete={() => setShowWelcome(false)}
        />
      )}

      {/* Navbar rolls in once the welcome screen is gone. It finds each section
          by id (about, skills, projects, education, contact), so the root
          element of each component below must carry that id. */}
      <Navbar visible={!showWelcome} />

      {/* Everything stays mounted under the welcome screen so images and fonts
          load while it plays. Hero rises in first, the rest fades in behind it. */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.98 }}
        animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ delay: 0.45, duration: 1, ease: EASE }}
      >
        <HeroSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <Footer />
      </motion.div>
    </main>
  );
}

export default Index;