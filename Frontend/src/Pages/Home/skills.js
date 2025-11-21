import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, defaultSkills } from "./Home_utils";
import "./skills.css";

const container = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Skill({ skills = defaultSkills }) {

  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return skills
      .filter((s) => (active === "All" ? true : s.category === active))
      .filter((s) => s.name.toLowerCase().includes(search.trim().toLowerCase()))
      .slice(0, 9);
  }, [skills, active, search]);

  return (
    <section className="skills-container" id="skills">
      <div className="skills-header">
        <div>
          <h2 className="skills-title">Skills</h2>
          <p className="skills-subtitle">Technologies I use to build modern, production-quality apps.</p>
        </div>

        <div className="skills-controls">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="skills-search"
          />

          <div className="skills-filter-buttons">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setActive(c) }}
                className={`filter-btn ${active === c ? "active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        variants={container}
        // initial="hidden"
        animate="show"
        className="skills-grid"
        layout

      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" className="skills-empty" layout>
              <p>No skills found. Try a different filter or search term.</p>
            </motion.div>
          ) : (
            filtered.map((s) => (
              <motion.div layout variants={item} key={s.id} className="skill-card">
                <div className="skill-card-top">
                  <div className="skill-info">
                    <div className="skill-icon">{s.icon}</div>
                    <div>
                      <h3 className="skill-name">{s.name}</h3>
                      <p className="skill-category">{s.category}</p>
                    </div>
                  </div>
                  <div className="skill-level">{s.level}%</div>
                </div>

                <div className="skill-bar-wrapper">
                  <SkillBar percentage={s.level} />
                </div>

                <div className="skill-footer">
                  <span className="skill-exp">Experience: 3+ yrs</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
      

      <div className="skills-bottom">
        <div className="skills-count">Showing {filtered.length} skills</div>
        <button onClick={() => { setActive("All"); setSearch(""); }} className="reset-btn">Reset</button>
      </div>
    </section>
  );
}

function SkillBar({ percentage = 50 }) {
  const safePct = Math.max(0, Math.min(100, Math.round(percentage)));
  return (
    <div className="skill-bar-container">
      <div className="skill-bar-bg">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="skill-bar-fill"
        />
      </div>
      <div className="skill-bar-text">Proficiency</div>
    </div>
  );
}
