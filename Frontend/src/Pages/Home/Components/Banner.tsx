import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

interface Props {
    refProp: React.RefObject<HTMLElement | null>;
}

const steps = [
    { problem: "Messy, unstructured data", solution: "Clean, reliable pipelines" },
    { problem: "Slow business decisions", solution: "ML-driven predictions" },
    { problem: "Manual repetitive workflows", solution: "Smart automation systems" },
];

type Phase = "problem" | "arrow" | "solution";

// Particles
const allParticles = Array.from({ length: 100 }, () => ({
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    xRange: Math.random() * 20 - 10,
    yRange: Math.random() * 20 - 10,
    duration: Math.random() * 8 + 4,
}));

export default function Banner({ refProp }: Props) {
    const [stepIndex, setStepIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("problem");

    const currentStep = steps[stepIndex];

    // Reduce particles on mobile
    const particles = useMemo(
        () => (window.innerWidth < 768 ? allParticles.slice(0, 30) : allParticles),
        []
    );

    return (
        <section
            ref={refProp}
            className="
        relative overflow-hidden
        min-h-[100vh] md:min-h-[70vh]
        pt-28 px-6 md:pt-40 md:pb-20
        flex items-center justify-center
        bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
      "
        >
            {/* Particles */}
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-cyan-400/40"
                    style={{
                        width: p.size,
                        height: p.size,
                        top: `${p.y}%`,
                        left: `${p.x}%`,
                    }}
                    animate={{
                        x: [0, p.xRange, -p.xRange, 0],
                        y: [0, p.yRange, -p.yRange, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* CONTENT */}
            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 items-center">

                {/* IMAGE (TOP ON MOBILE) */}
                <div className="order-1 md:order-2 flex flex-col items-center text-center gap-3">
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-36 h-36 md:w-48 md:h-48 rounded-full ring-4 ring-cyan-400/30 shadow-xl overflow-hidden"
                    >
                        <img
                            src="/Data/pic.png"
                            alt="Shahabaj Khan"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </motion.div>

                    {/* Arrow */}
                    {phase === "arrow" ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0.3 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            transition={{ duration: 0.5, repeat: 1, repeatType: "reverse" }}
                            className="text-3xl md:text-4xl text-cyan-400"
                            onAnimationComplete={() => setPhase("solution")}
                        >
                            →
                        </motion.div>
                    ) : (
                        <div className="text-3xl md:text-4xl text-cyan-400/40">→</div>
                    )}

                    <p className="text-sm text-slate-400 font-medium">
                        Transforming problems into solutions
                    </p>
                </div>

                {/* PROBLEM */}
                <div className="order-2 md:order-1 text-center md:text-right space-y-4">
                    <h3 className="text-xl font-semibold text-red-400">Problem</h3>
                    <div className="text-lg min-h-[3rem] text-slate-400">
                        {phase === "problem" ? (
                            <Typewriter
                                onInit={(tw) => {
                                    tw.changeDelay(60)
                                        .typeString(`❌ ${currentStep.problem}`)
                                        .callFunction(() =>
                                            setTimeout(() => setPhase("arrow"), 400)
                                        )
                                        .start();
                                }}
                            />
                        ) : (
                            <span>❌ {currentStep.problem}</span>
                        )}
                    </div>
                </div>

                {/* SOLUTION */}
                <div className="order-3 text-center md:text-left space-y-4">
                    <h3 className="text-xl font-semibold text-emerald-400">Solution</h3>
                    <div className="text-lg min-h-[3rem] text-slate-200 drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]">
                        {phase === "solution" && (
                            <Typewriter
                                onInit={(tw) => {
                                    tw.changeDelay(35)
                                        .typeString(`✅ ${currentStep.solution}`)
                                        .pauseFor(1200)
                                        .callFunction(() => {
                                            setPhase("problem");
                                            setStepIndex((i) => (i + 1) % steps.length);
                                        })
                                        .start();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
