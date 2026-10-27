import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Globe } from "lucide-react";
import heartImg from "@/assets/HeartSTR.png";
import houseImg from "@/assets/HPP.png";
import unitedImg from "@/assets/united.png";
import naturalImg from "@/assets/NLP.png";
import rnnImg from "@/assets/RNN.png";
import CreditImg from "@/assets/Credit.png";

/* ══════════════════════════════════════════════════════════════════════════
   1. DATA: the only part you need to edit
   ──────────────────────────────────────────────────────────────────────────
   • starred: true   → appears in the Starred Projects showcase
   • starred: false  → appears in the Other Projects list (never in both)
   • github          → the repository URL ("Explore Project" opens it)
   • live            → deployed site URL. Leave it out and the
                       "View Project" button is hidden automatically
   • image           → optional screenshot path (e.g. "/projects/app.png",
                       from your /public folder). Without it, a generated
                       illustration is used, chosen by `visual`
   • visual          → "neural" | "terminal" | "chart"

   ⚠️ Every entry below is a PLACEHOLDER. Replace the text, stack, categories
   and URLs with your real project details. `github` currently points to your
   GitHub profile so no button is ever broken; change each one to the repo
   URL, e.g. https://github.com/AOISYNM/<repo-name>
   ══════════════════════════════════════════════════════════════════════════ */

type Visual = "neural" | "terminal" | "chart";

type Project = {
  id: string;
  starred: boolean;
  title: string;
  category: string;
  tagline: string;
  description: string;
  stack: string[];
  github: string;
  live?: string;
  image?: string;
  visual: Visual;
};

const GITHUB_PROFILE = "https://github.com/AOISYNM";

const PROJECTS: Project[] = [
/* ── Starred ─────────────────────────────────────────────────────────── */
{
  id: "project-one",
  starred: true,
  title: "Heart Stroke Risk Predictor",
  category: "Machine Learning",
  tagline: "Turning clinical health data into machine learning-powered risk estimates.",
  description:
    "An interactive machine learning application that estimates heart disease risk using clinical parameters such as age, cholesterol, and other factors. Built with Logistic Regression and Streamlit to deliver real-time predictions.",
  stack: ["Scikit-learn", "Streamlit", "Pandas", "NumPy"],
  github: `${GITHUB_PROFILE}/Heart_Disease_Predictor`,
  live: "https://punjan-heartdisease.streamlit.app/",
  image: heartImg,
  visual: "neural",
},
{
  id: "project-two",
  starred: true,
  title: "House Price Prediction",
  category: "Data Science & Machine Learning",
  tagline: "Uncovering housing market patterns through data analysis and predictive modeling.",
  description:
    "A data science project that analyzes housing data to identify patterns and factors affecting property prices. Uses data visualization and machine learning techniques to explore and predict house values.",
  stack: [ "Pandas", "Matplotlib", "Seaborn", "Scikit-learn"],
  github: "https://github.com/AOISYNM/DA_Practice/tree/main/House_Pred",
  live: "https://aoisynm-house-price-predction.streamlit.app/",
  image: houseImg,
  visual: "terminal",
},
{
  id: "project-three",
  starred: true,
  title: "United Travels and Tours",
  category: "Web Development",
  tagline: "A real-world digital experience built for United Travels and Tours.",
  description:
    "Worked on  a travel website for United Travels and Tours to showcase destinations and travel services through a professional, user-friendly experience. Built with Next.js, TypeScript, and Tailwind CSS to deliver a responsive interface for real-world business needs.",
  stack: ["Next.js", "Tailwind CSS", "Prisma", "TypeScript"],
  github: "https://github.com/Ghost9841/united-travel-tour",
  live: "https://www.unitedtravels.co.uk/",
  image: unitedImg,
  visual: "chart",
},

/* ── Other projects ──────────────────────────────────────────────────── */
{
  id: "project-four",
  starred: true,
  title: "Credit Risk Prediction",
  category: "Machine Learning",
  tagline: "Predicting loan default risk using SHAP and Probability Callibration .",
  description: "An end-to-end machine learning project focused on predicting credit risk and evaluating loan applicants' financial reliability. Explores data preprocessing, feature engineering, model training, and risk classification to estimate default probability and support data-driven lending decisions using Python.",
  stack: [ "FastAPI", "Scikit-learn", "XGBoost" , "SHAP"],
  github: "https://github.com/AOISYNM/Credit_Risk",
  live: "https://credit-risk-1-8tp8.onrender.com/",
  image:CreditImg,
  visual: "neural",
},
{
  id: "project-five",
  starred: false,
  title: "Natural Language Processing",
  category: "Data Science & NLP",
  tagline: "Exploring how machines process, interpret, and learn from human language.",
  description:
    "An NLP project exploring how text data can be processed and analyzed to extract meaningful insights. Includes text preprocessing and emotion classification using Python-based NLP techniques.",
  stack: [ "Pandas", "NumPy", "NLTK", "Scikit-learn"],
  github: "https://github.com/AOISYNM/DA_Practice/tree/main/NLP",
  live: "https://aoisynm-emotion-classifier.streamlit.app/",
  image: naturalImg,
  visual: "chart",
},

  {
    id: "project-six",
    starred: false,
    title: "Recurrent Neural Networks",
    category: "Deep Learning",
    tagline: "Learning sequential patterns with recurrent neural networks.",
    description: "A hands-on deep learning project exploring how Recurrent Neural Networks process sequential data and learn patterns over time. Focuses on understanding sequence modeling and the fundamentals of recurrent architectures using Python.",
    stack: ["NumPy", "Pandas", "TensorFlow", "Keras"],
    github: 'https://github.com/AOISYNM/DA_Practice/tree/main/RNN',
    live: "https://aoisynm-next-text-predictor.streamlit.app/",
    image: rnnImg,
    visual: "neural", 
  },
  {
    id: "project-seven",
    starred: false,
    title: "Student Grading System",
    category: "Analysis & Visualization",
    tagline: "Simplifying student assessment through automated grading.",
    description: "A student grading system designed to organize student marks and simplify grade calculation. The project focuses on making academic assessment more efficient and presenting student results in a structured format.",
    stack: ["C", "Data Structures","Pandas" ,"NumPy"],
    github: "https://github.com/AOISYNM/School-Grading-System",
    visual: "chart",
  },
  
];

/* ══════════════════════════════════════════════════════════════════════════
   2. Theme + helpers
   ══════════════════════════════════════════════════════════════════════════ */

const displayFont = { fontFamily: "'Cinzel Decorative', 'Cinzel', serif" };
const bodyFont = { fontFamily: "'Cinzel', serif" };
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const starred = PROJECTS.filter((p) => p.starred);
const others = PROJECTS.filter((p) => !p.starred); // never overlaps with starred

const pad = (n: number) => String(n).padStart(2, "0");

const GRID_BG = {
  backgroundImage:
    "linear-gradient(rgba(232,229,224,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,229,224,0.04) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

/* ══════════════════════════════════════════════════════════════════════════
   3. Generated visuals (used when a project has no screenshot)
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Neural network ─────────────────────────────────────────────────────── */

type Edge = { x1: number; y1: number; x2: number; y2: number; hot: boolean };

const NN_LAYERS = [4, 6, 6, 3];
const NN_X = [56, 150, 250, 344];
const nnY = (count: number, i: number) => 48 + (i * 204) / (count - 1);

const NN_NODES = NN_LAYERS.flatMap((count, l) =>
  Array.from({ length: count }, (_, i) => ({
    key: `${l}-${i}`,
    x: NN_X[l],
    y: nnY(count, i),
    hot: (l * 7 + i * 3) % 4 === 0,
  }))
);

const NN_EDGES: Edge[] = (() => {
  const edges: Edge[] = [];
  for (let l = 0; l < NN_LAYERS.length - 1; l++) {
    for (let a = 0; a < NN_LAYERS[l]; a++) {
      for (let b = 0; b < NN_LAYERS[l + 1]; b++) {
        edges.push({
          x1: NN_X[l],
          y1: nnY(NN_LAYERS[l], a),
          x2: NN_X[l + 1],
          y2: nnY(NN_LAYERS[l + 1], b),
          hot: (a * 3 + b * 5 + l * 2) % 9 === 0,
        });
      }
    }
  }
  return edges;
})();

const NN_PARTICLE_EDGES = NN_EDGES.filter((e) => e.hot).slice(0, 7);

function NeuralVisual({ animate }: { animate: boolean }) {
  const reduce = useReducedMotion();
  const showParticles = animate && !reduce;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nn-glow">
          <stop offset="0%" stopColor="#FF3B16" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF3B16" stopOpacity="0" />
        </radialGradient>
      </defs>

      {NN_EDGES.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={e.hot ? "#D5220F" : "#E8E5E0"}
          strokeOpacity={e.hot ? 0.55 : 0.08}
          strokeWidth={e.hot ? 1.2 : 0.8}
        />
      ))}

      {NN_NODES.map((n) => (
        <g key={n.key}>
          {n.hot && <circle cx={n.x} cy={n.y} r={16} fill="url(#nn-glow)" />}
          <circle
            cx={n.x}
            cy={n.y}
            r={6}
            fill={n.hot ? "#FF3B16" : "#050505"}
            stroke={n.hot ? "#FF3B16" : "#E8E5E0"}
            strokeOpacity={n.hot ? 1 : 0.35}
            strokeWidth={1.5}
          />
        </g>
      ))}

      {showParticles &&
        NN_PARTICLE_EDGES.map((e, k) => (
          <circle key={k} r={2.4} fill="#FF3B16">
            <animateMotion
              dur={`${2.6 + (k % 3)}s`}
              begin={`${k * 0.55}s`}
              repeatCount="indefinite"
              path={`M${e.x1} ${e.y1} L${e.x2} ${e.y2}`}
            />
          </circle>
        ))}
    </svg>
  );
}

/* ── Terminal / code ────────────────────────────────────────────────────── */

const TERMINAL_LINES: { indent: number; w: number; hot?: boolean }[] = [
  { indent: 0, w: 70, hot: true },
  { indent: 0, w: 150 },
  { indent: 1, w: 110 },
  { indent: 1, w: 170, hot: true },
  { indent: 2, w: 90 },
  { indent: 1, w: 130 },
  { indent: 0, w: 60 },
  { indent: 0, w: 140, hot: true },
];

function TerminalVisual() {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect
        x="40"
        y="40"
        width="320"
        height="220"
        rx="6"
        fill="#0D0D0D"
        stroke="#E8E5E0"
        strokeOpacity="0.18"
      />
      <line
        x1="40"
        y1="68"
        x2="360"
        y2="68"
        stroke="#E8E5E0"
        strokeOpacity="0.12"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={54 + i * 14}
          y={51}
          width="7"
          height="7"
          rx="1.5"
          fill={i === 0 ? "#D5220F" : "#E8E5E0"}
          fillOpacity={i === 0 ? 1 : 0.25}
        />
      ))}
      {TERMINAL_LINES.map((l, i) => (
        <rect
          key={i}
          x={58 + l.indent * 22}
          y={88 + i * 21}
          width={l.w}
          height="6"
          rx="3"
          fill={l.hot ? "#FF3B16" : "#E8E5E0"}
          fillOpacity={l.hot ? 0.9 : 0.22}
        />
      ))}
      <rect
        x="206"
        y="253"
        width="9"
        height="14"
        fill="#FF3B16"
        className="animate-pulse motion-reduce:animate-none"
      />
    </svg>
  );
}

/* ── Chart / data ───────────────────────────────────────────────────────── */

const CHART_BARS = [38, 62, 48, 80, 58, 92, 70, 108];

function ChartVisual() {
  const barX = (i: number) => 56 + i * 36;
  const points = CHART_BARS.map((h, i) => `${barX(i) + 9},${252 - h - 18}`).join(
    " "
  );

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D5220F" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#720909" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="44"
          x2="356"
          y1={72 + i * 60}
          y2={72 + i * 60}
          stroke="#E8E5E0"
          strokeOpacity="0.1"
        />
      ))}
      {CHART_BARS.map((h, i) => (
        <rect
          key={i}
          x={barX(i)}
          y={252 - h}
          width="18"
          height={h}
          rx="2"
          fill="url(#bar-fill)"
        />
      ))}
      <polyline
        points={points}
        fill="none"
        stroke="#FF3B16"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {CHART_BARS.map((h, i) => (
        <circle
          key={i}
          cx={barX(i) + 9}
          cy={252 - h - 18}
          r="3.5"
          fill="#050505"
          stroke="#FF3B16"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

/* ── Wrapper: screenshot if provided, generated illustration otherwise ──── */

function ProjectVisual({
  project,
  animate = false,
}: {
  project: Project;
  animate?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (project.image && !failed) {
    return (
      <img
        src={project.image}
        alt={`${project.title} preview`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-[#050505]"
      style={GRID_BG}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(114,9,9,0.45) 0%, transparent 70%)",
        }}
      />
      <div className="relative h-full w-full">
        {project.visual === "neural" && <NeuralVisual animate={animate} />}
        {project.visual === "terminal" && <TerminalVisual />}
        {project.visual === "chart" && <ChartVisual />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4. Shared pieces
   ══════════════════════════════════════════════════════════════════════════ */

/** Tech stack: crimson-tinted pills in the theme font, each led by a small
 *  diamond marker. Used by both the starred showcase and the other list. */
function TechBadges({
  stack,
  small = false,
}: {
  stack: string[];
  small?: boolean;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
      {stack.map((tech) => (
        <li
          key={tech}
          style={bodyFont}
          className={`inline-flex items-center gap-2 rounded-full border border-[#FF3B16]/25 bg-gradient-to-r from-[#720909]/35 to-[#720909]/5 font-semibold tracking-[0.1em] text-[#E8E5E0] transition-colors duration-300 hover:border-[#FF3B16]/60 ${
            small ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          <span
            aria-hidden="true"
            className="h-1 w-1 shrink-0 rotate-45 bg-[#FF3B16]"
          />
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** Corner brackets that draw outward on hover (same motif as the navbar CTA) */
function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-2 h-2 w-2 border-l-2 border-t-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-left-[11px] group-hover:-top-[11px] group-hover:border-[#FF3B16]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 -right-2 h-2 w-2 border-b-2 border-r-2 border-[#FF3B16]/50 transition-all duration-300 group-hover:-bottom-[11px] group-hover:-right-[11px] group-hover:border-[#FF3B16]"
      />
    </>
  );
}

const BUTTON_SPRING = { type: "spring", stiffness: 400, damping: 20 } as const;

/** Explore Project (GitHub repo) + View Project (live site, only if it exists).
 *  Both buttons always share the exact same width and height. */
function ProjectLinks({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const base = `group relative inline-flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-none border-2 font-bold uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
    compact
      ? "h-11 px-4 text-[11px] tracking-[0.14em]"
      : "h-12 px-4 text-[11px] tracking-[0.16em]"
  }`;

  // Equal-width grid cells: stacked on phones, side by side on tablets,
  // stacked again where the column is narrow, side by side on wide screens.
  const layout = compact
    ? "grid w-full grid-cols-1 gap-5 sm:max-w-md sm:grid-cols-2 lg:w-60 lg:max-w-none lg:grid-cols-1"
    : "grid w-full grid-cols-1 gap-5 sm:max-w-xl sm:grid-cols-2 lg:max-w-[17rem] lg:grid-cols-1 xl:max-w-xl xl:grid-cols-2";

  const arrow =
    "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

  return (
    <div className={layout}>
      {project.github && (
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Explore ${project.title} on GitHub (opens in a new tab)`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={BUTTON_SPRING}
          style={bodyFont}
          className={`${base} border-[#D5220F] bg-[#A30D0D] text-white hover:bg-[#D5220F]`}
        >
          <Github aria-hidden="true" className="h-4 w-4 shrink-0" />
          Explore Project
          <ArrowUpRight aria-hidden="true" className={arrow} />
          <CornerBrackets />
        </motion.a>
      )}

      {project.live && (
        <motion.a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} live (opens in a new tab)`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={BUTTON_SPRING}
          style={bodyFont}
          className={`${base} border-[#E8E5E0]/40 bg-transparent text-[#E8E5E0] hover:border-[#E8E5E0]/70 hover:bg-[#E8E5E0]/10`}
        >
          <Globe aria-hidden="true" className="h-4 w-4 shrink-0" />
          Project Demo
          <ArrowUpRight aria-hidden="true" className={arrow} />
          <CornerBrackets />
        </motion.a>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   5. Starred showcase
   ══════════════════════════════════════════════════════════════════════════ */

function Showcase({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const m = reduce ? 0 : 1;
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const n = projects.length;
  const project = projects[index];

  const go = (delta: number) => setPage([(index + delta + n) % n, delta]);
  const jump = (i: number) => {
    if (i !== index) setPage([i, i > index ? 1 : -1]);
  };

  // Everything inside the panel is swapped together, so visual, text, badges
  // and both links always belong to the same project.
  const slide: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 * m }),
    center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
    exit: (d: number) => ({
      opacity: 0,
      x: d * -40 * m,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <div className="relative border border-[#E8E5E0]/10 bg-[#0D0D0D]">
      {/* Frame brackets on all four corners */}
      <span aria-hidden="true" className="pointer-events-none absolute -left-px -top-px z-20 h-5 w-5 border-l-2 border-t-2 border-[#FF3B16]" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-px -top-px z-20 h-5 w-5 border-r-2 border-t-2 border-[#FF3B16]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -left-px z-20 h-5 w-5 border-b-2 border-l-2 border-[#FF3B16]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px z-20 h-5 w-5 border-b-2 border-r-2 border-[#FF3B16]" />

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={project.id}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid lg:min-h-[30rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
          >
            {/* ── Visual ── */}
            <div className="relative aspect-[16/10] w-full border-b border-[#E8E5E0]/10 lg:aspect-auto lg:h-full lg:border-b-0 lg:border-r">
              <ProjectVisual project={project} animate />
            </div>

            {/* ── Content ── */}
            <div
              className="relative flex flex-col justify-center overflow-hidden p-6 sm:p-8 lg:p-10"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 100% 0%, rgba(114,9,9,0.32) 0%, transparent 70%)",
              }}
            >
              {/* Oversized outlined numeral */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-3 select-none font-black leading-none sm:-top-5"
                style={{
                  ...displayFont,
                  fontSize: "clamp(6.5rem, 20vw, 11rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(232,229,224,0.1)",
                }}
              >
                {pad(index + 1)}
              </span>

              <div className="relative z-10 flex flex-col gap-5">
                {/* Category: theme font, no number badge */}
                <div
                  style={bodyFont}
                  className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#9A9692] sm:text-[13px]"
                >
                  <span className="min-w-0 truncate">{project.category}</span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gradient-to-r from-[#E8E5E0]/25 to-transparent"
                  />
                </div>

                {/* Title (red) + tagline */}
                <div>
                  <h3
                    style={displayFont}
                    className="-mx-[0.1em] inline-block bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.1em] pb-[0.1em] text-3xl font-bold leading-[1.1] tracking-[0.02em] text-transparent md:text-4xl lg:text-[2.6rem]"
                  >
                    {project.title}
                  </h3>
                  {project.tagline && (
                    <p
                      style={bodyFont}
                      className="mt-3 text-base tracking-[0.02em] text-[#E8E5E0] md:text-lg"
                    >
                      {project.tagline}
                    </p>
                  )}
                </div>

                {/* Description with an editorial rule */}
                <p
                  style={bodyFont}
                  className="border-l-2 border-[#720909] pl-4 text-sm leading-[1.9] tracking-[0.02em] text-[#9A9692] md:text-base"
                >
                  {project.description}
                </p>

                {/* Stack */}
                <TechBadges stack={project.stack} />

                {/* Actions */}
                <div className="border-t border-[#E8E5E0]/10 pt-6">
                  <ProjectLinks project={project} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Screen readers hear which project is showing */}
      <p className="sr-only" aria-live="polite">
        Showing starred project {index + 1} of {n}: {project.title}
      </p>

      {/* Controls */}
      {n > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-[#E8E5E0]/10 px-4 sm:px-6 lg:px-10">
          <div
            className="flex items-center"
            role="group"
            aria-label="Choose a starred project"
          >
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => jump(i)}
                aria-label={`Show project ${i + 1}: ${p.title}`}
                aria-current={i === index ? "true" : undefined}
                className="group flex h-11 items-center px-1 focus-visible:outline-none"
              >
                <span
                  className={`block h-[3px] w-6 transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#FF3B16] sm:w-9 ${
                    i === index
                      ? "bg-gradient-to-r from-[#FF3B16] to-[#D5220F]"
                      : "bg-[#E8E5E0]/15 group-hover:bg-[#E8E5E0]/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3">
            {[
              { label: "Previous project", delta: -1, Icon: ChevronLeft },
              { label: "Next project", delta: 1, Icon: ChevronRight },
            ].map(({ label, delta, Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => go(delta)}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-none border border-[#E8E5E0]/15 text-[#E8E5E0] transition-colors duration-200 hover:border-[#D5220F]/60 hover:text-[#FF3B16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B16]"
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   6. Other projects: compact index
   ══════════════════════════════════════════════════════════════════════════ */

function OtherRow({
  project,
  number,
  variants,
}: {
  project: Project;
  number: number;
  variants: Variants;
}) {
  return (
    <motion.li
      variants={variants}
      className="group relative border-b border-[#E8E5E0]/10 transition-colors duration-300 hover:bg-[#0D0D0D]"
    >
      {/* Restrained hover cue: an accent line draws down the left edge */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-gradient-to-b from-[#FF3B16] to-[#D5220F] transition-transform duration-300 group-hover:scale-y-100"
      />

      <div className="grid gap-5 px-3 py-6 sm:px-5 md:grid-cols-[3.5rem_9rem_minmax(0,1fr)] md:gap-x-6 md:py-7 lg:grid-cols-[3.5rem_10rem_minmax(0,1fr)_auto] lg:items-center">
        {/* Number (md and up): theme display font, bold */}
        <p
          style={displayFont}
          className="hidden text-2xl font-black tracking-[0.04em] text-[#9A9692] transition-colors duration-300 group-hover:text-[#FF3B16] md:block"
        >
          {pad(number)}
        </p>

        {/* Preview */}
        <div className="w-full max-w-[16rem] md:max-w-none">
          <div className="aspect-[16/9] overflow-hidden rounded-sm border border-[#E8E5E0]/10 bg-[#050505] md:aspect-[4/3]">
            <ProjectVisual project={project} />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p
            style={displayFont}
            className="mb-2 text-lg font-black tracking-[0.04em] text-[#FF3B16] md:hidden"
          >
            {pad(number)}
          </p>
          <h4
            style={displayFont}
            className="text-xl font-bold tracking-[0.02em] text-[#E8E5E0] transition-colors duration-300 group-hover:text-[#FF3B16] sm:text-2xl"
          >
            {project.title}
          </h4>
          <p
            style={bodyFont}
            className="mt-2 text-sm leading-relaxed tracking-[0.02em] text-[#9A9692]"
          >
            {project.description}
          </p>
          <div className="mt-3">
            <TechBadges stack={project.stack} small />
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-start-3 lg:col-start-4 lg:row-start-1">
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </motion.li>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   7. Section
   ══════════════════════════════════════════════════════════════════════════ */

export default function Projects() {
  const reduce = useReducedMotion();
  const m = reduce ? 0 : 1;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 * m },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
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
            id="projects-heading"
            variants={fadeUp}
            style={displayFont}
            className="pb-1 text-[length:clamp(2rem,9vw,5.5rem)] font-black leading-[1.08] tracking-[0.02em]"
          >
            <span className="block text-[#E8E5E0]">My</span>{" "}
            {/* Padding + matching negative margin keeps the decorative swash
                from being clipped by the gradient's paint area */}
            <span className="-mx-[0.2em] -mt-[0.1em] block bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.2em] pb-[0.15em] pt-[0.1em] text-transparent">
              Projects
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={bodyFont}
            className="mt-6 text-base leading-[1.9] tracking-[0.02em] text-[#9A9692] sm:text-lg"
          >
            A closer look at my projects . Each one links to its
  GitHub repository for detailed explanation and a live deployed link if availabe. The starred projects are highlighted for their significance, while the others showcase the breadth of my work.
          </motion.p>
        </motion.div>

        {/* ---------- Starred showcase ---------- */}
        {starred.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Showcase projects={starred} />
          </motion.div>
        )}

        {/* --------- Other projects --------- */}
        {others.length > 0 && (
          <div className="mt-20 md:mt-28">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="mb-8 text-center md:mb-10 lg:text-left"
            >
              <motion.h3
                variants={fadeUp}
                style={displayFont}
                className="text-[length:clamp(1.75rem,6vw,3rem)] font-black leading-[1.1] tracking-[0.02em]"
              >
                <span className="text-[#E8E5E0]">Other </span>
                <span className="bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.1em] text-transparent">
                  Projects
                </span>
              </motion.h3>
            </motion.div>

            <motion.ol
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="border-t border-[#E8E5E0]/10"
            >
              {others.map((project, i) => (
                <OtherRow
                  key={project.id}
                  project={project}
                  number={i + 1}
                  variants={fadeUp}
                />
              ))}
            </motion.ol>
          </div>
        )}
      </div>
    </section>
  );
}