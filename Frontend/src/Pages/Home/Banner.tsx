import { useState } from "react";
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

// Galaxy-style particles
const particles = Array.from({ length: 100 }, () => ({
    size: Math.random() * 4 + 2,
    xStart: Math.random() * 100,
    yStart: Math.random() * 100,
    xRange: Math.random() * 30 - 15, // move left/right
    yRange: Math.random() * 30 - 15, // move up/down
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 5,
}));

export default function Banner({ refProp }: Props) {
    const [stepIndex, setStepIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("problem");
    const currentStep = steps[stepIndex];

    return (
        <section
            ref={refProp}
            className="relative min-h-[70vh] flex items-center justify-center px-6
                 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"

            style={{ marginTop: "70px" }}
        >

            {/* Galaxy-style floating particles */}
            {particles.map((p, idx) => (
                <motion.div
                    key={idx}
                    className="absolute rounded-full bg-cyan-400/40"
                    style={{
                        width: p.size,
                        height: p.size,
                        top: `${p.yStart}%`,
                        left: `${p.xStart}%`,
                    }}
                    animate={{
                        x: [0, p.xRange, -p.xRange, 0],
                        y: [0, p.yRange, -p.yRange, 0],
                        scale: [1, 0.8, 1.2, 1],
                    }}
                    transition={{
                        duration: p.duration * .8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay * .01,
                    }}
                />
            ))}

            {/* Banner Content */}
            {/* Banner Content */}
            <div className="relative max-w-7xl w-full grid md:grid-cols-3 gap-10 z-10">

                {/* PROBLEM */}
                <div className="flex flex-col justify-center text-right space-y-4">
                    <h3 className="text-xl font-semibold text-red-400">Problem</h3>
                    <div className="text-lg min-h-[3rem] text-slate-400">
                        {phase === "problem" ? (
                            <Typewriter
                                onInit={(typewriter) => {
                                    typewriter
                                        .changeDelay(65)
                                        .typeString(`❌ ${currentStep.problem}`)
                                        .callFunction(() => setTimeout(() => setPhase("arrow"), 400))
                                        .start();
                                }}
                            />
                        ) : (
                            <span>❌ {currentStep.problem}</span>
                        )}
                    </div>
                </div>

                {/* CENTER (Image + Arrow) */}
                <div className="flex flex-col justify-center items-center text-center gap-2">
                    <motion.div
                        animate={{
                            y: [0, -15, 0],     // move up by 15px then back
                        }}
                        transition={{
                            duration: 4,      // total cycle duration
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                        }}
                        className="w-48 h-48 rounded-full ring-4 ring-cyan-400/30 shadow-xl flex items-center justify-center overflow-hidden"
                    >
                        <img
                            src="/Data/pic.png"
                            alt="Shahabaj Khan"
                            className="rounded-full object-cover mt-4 ml-3"
                        />
                    </motion.div>

                    {phase === "arrow" ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0.3 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            transition={{ duration: 0.5, repeat: 1, repeatType: "reverse" }}
                            className="text-4xl text-cyan-400"
                            onAnimationComplete={() => setPhase("solution")}
                        >
                            →
                        </motion.div>
                    ) : (
                        <div className="text-4xl text-cyan-400/40">→</div>
                    )}

                    <p className="text-sm font-medium text-slate-400">
                        Transforming problems into solutions
                    </p>
                </div>

                {/* SOLUTION */}
                <div className="flex flex-col justify-center text-left space-y-4">
                    <h3 className="text-xl font-semibold text-emerald-400">Solution</h3>
                    <div className="text-lg min-h-[3rem] text-slate-200 drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]">
                        {phase === "solution" && (
                            <Typewriter
                                onInit={(typewriter) => {
                                    const words = currentStep.solution.split(" ");
                                    const first = words.slice(0, 2).join(" ");
                                    const rest = words.slice(2).join(" ");

                                    typewriter
                                        .changeDelay(40)
                                        .typeString(`✅ ${first} `)
                                        .changeDelay(22)
                                        .typeString(rest)
                                        .pauseFor(1200)
                                        .callFunction(() => {
                                            setPhase("problem");
                                            setStepIndex((prev) => (prev + 1) % steps.length);
                                        })
                                        .start();
                                }}
                            />
                        )}
                    </div>
                </div>



            </div>
        </section >
    );
}
