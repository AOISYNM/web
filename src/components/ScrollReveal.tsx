import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  scale?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
}

const getInitial = (
  direction: Direction,
  distance: number,
  scale: number
): Record<string, number> => {
  const base: Record<string, number> = { opacity: 0 };
  if (scale !== 1) base.scale = scale;
  switch (direction) {
    case "up":
      base.y = distance;
      break;
    case "down":
      base.y = -distance;
      break;
    case "left":
      base.x = distance;
      break;
    case "right":
      base.x = -distance;
      break;
  }
  return base;
};

const getAnimate = (
  direction: Direction,
  scale: number
): Record<string, number> => {
  const base: Record<string, number> = { opacity: 1 };
  if (scale !== 1) base.scale = 1;
  if (direction === "up" || direction === "down") base.y = 0;
  if (direction === "left" || direction === "right") base.x = 0;
  return base;
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 60,
  scale = 1,
  once = true,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={getInitial(direction, distance, scale)}
      animate={isInView ? getAnimate(direction, scale) : getInitial(direction, distance, scale)}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Staggered children wrapper */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
  distance = 40,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
}) {
  const initial: Record<string, number> = { opacity: 0 };
  const visible: Record<string, number> = { opacity: 1 };

  if (direction === "up") {
    initial.y = distance;
    visible.y = 0;
  } else if (direction === "down") {
    initial.y = -distance;
    visible.y = 0;
  } else if (direction === "left") {
    initial.x = distance;
    visible.x = 0;
  } else if (direction === "right") {
    initial.x = -distance;
    visible.x = 0;
  }

  return (
    <motion.div
      variants={{
        hidden: initial,
        visible: {
          ...visible,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}