import { useState, useEffect, useRef } from "react";
import FireBackground from "@/components/FireBackground";
import WelcomeScreen from "@/components/WelcomeScreen";

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

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold text-white">PUNJAN</h1>
      </div>
    </main>
  );
}

export default Index;