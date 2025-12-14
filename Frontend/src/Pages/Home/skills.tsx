import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultSkills, categories } from "./Home_utils.tsx";

/* =====================
   TYPES
===================== */

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
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, y: 8 },
};

/* =====================
   COMPONENT
===================== */

export default function Skills({ skills = defaultSkills }: SkillsProps) {
  const GENERIC_SKILL_ICON =
    "https://cdn-icons-png.flaticon.com/512/2103/2103658.png";

  const [activeCategory, setActiveCategory] = useState<string>("ML & DL");

  const filtered = useMemo(
    () => skills.filter((s) => s.category === activeCategory),
    [skills, activeCategory]
  );

  return (
    <section className="bg-black py-16 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Skills
        </h2>
        <p className="text-slate-400">
          Technologies I use to build modern, production-ready apps
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeCategory === c
                ? "bg-sky-600 text-white"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center"
      >
        <AnimatePresence>
          {filtered.map((skill) => (
            <motion.div
              key={skill.id}
              variants={item}
              exit="exit"
              className="flex flex-col items-center gap-2 p-3
                         transition-transform hover:scale-110"
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

              <span className="text-sm text-center font-medium text-slate-200">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
