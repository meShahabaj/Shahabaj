import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultSkills, categories } from "./Home_utils.tsx";

/* =====================
   TYPES
===================== */
interface SkillsProps {
  skills?: Skill[];
  refProp?: React.RefObject<HTMLElement | null>;
}
interface Skill {
  id: number;
  name: string;
  icon: string;
  category: string;
}

interface SkillsProps {
  skills?: Skill[];
}

/* =====================
   ANIMATIONS
===================== */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, y: 10, scale: 0.9 },
};

/* =====================
   COMPONENT
===================== */

export default function Skills({
  skills = defaultSkills,
  refProp,
}: SkillsProps) {
  const GENERIC_SKILL_ICON =
    "https://cdn-icons-png.flaticon.com/512/2103/2103658.png";

  const [activeCategory, setActiveCategory] = useState<string>("ML & DL");

  const filtered = useMemo(
    () => skills.filter((s) => s.category === activeCategory),
    [skills, activeCategory]
  );


  return (

    <section
      ref={refProp}
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden py-20 px-6">


      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 drop-shadow-lg">
          Skills
        </h2>
        <p className="text-slate-300 text-lg">
          Technologies I use to build modern, production-ready apps
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <div className="relative z-10 flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeCategory === c
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-cyan-600 hover:text-white"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div
        className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filtered.map((skill) => (
            <motion.div
              key={skill.id}
              variants={item}
              exit="exit"
              className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-md hover:scale-110 transition-transform duration-300"
            >
              <img
                src={skill.icon}
                alt={skill.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = GENERIC_SKILL_ICON;
                }}
                className="w-14 h-14 object-contain"
              />
              <span className="text-sm text-center font-medium text-white">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
