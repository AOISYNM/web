import { useState, useEffect, useRef } from "react";
import FireBackground from "@/components/FireBackground";
import WelcomeScreen from "@/components/WelcomeScreen";
import Navbar from "@/components/portfolio/Navbar"; // ← added
import HeroSection from "@/components/portfolio/HeroSection";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";

function Index() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const exitTriggered = useRef(false);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showWelcome]);

  useEffect(() => {
    if (!showWelcome) return;

    const triggerExit = () => {
      if (exitTriggered.current) return;
      exitTriggered.current = true;
      setIsExiting(true);
      setTimeout(() => {
        setShowWelcome(false);
      }, 1300);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 25) triggerExit();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 60) triggerExit();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showWelcome]);

  return (
    <main className="min-h-screen bg-[#050505]">
      {showWelcome && (
        <WelcomeScreen
          isExiting={isExiting}
          fireBackground={<FireBackground />}
          logo={
            <img
              src="/logo-nobg.png"
              alt="PUNJAN"
              className="w-full h-full object-contain"
            />
          }
        />
      )}

      {/* ← added: navbar rolls in after welcome screen exits */}
      <Navbar visible={!showWelcome} />
      <HeroSection />
      <About/>
      <Skills/>
      <Education/>
      <Contact/>

      {/* ← added: placeholder sections so nav links work */}
      <section id="about" className="min-h-screen" />
      <section id="skills" className="min-h-screen" />
      <section id="projects" className="min-h-screen" />
      <section id="education" className="min-h-screen" />
      <section id="contact" className="min-h-screen" />
    </main>
  );
}

export default Index;