import { useState, useEffect } from "react";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/HeroSection";

function Index() {
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNavVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar visible={navVisible} />
      <HeroSection />
      <section id="about" className="min-h-screen" />
      <section id="skills" className="min-h-screen" />
      <section id="projects" className="min-h-screen" />
      <section id="education" className="min-h-screen" />
      <section id="contact" className="min-h-screen" />
    </main>
  );
}

export default Index;