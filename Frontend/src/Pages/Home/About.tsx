import { about } from "./Home_utils.tsx";

interface Props {
    refProp: React.RefObject<HTMLElement | null>;
}

export default function About({ refProp }: Props) {
    return (
        <section
            ref={refProp}
            className="mt-(-10) relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden px-4  bg-gradient-to-br from-slate-100 via-sky-100 to-slate-100"
        >


            {/* Frosted glass content */}
            <div
                className="relative z-10 max-w-[900px] w-full bg-white/30 backdrop-blur-md rounded-2xl p-10 flex flex-col items-center shadow-xl"

            >
                <h2 className="text-4xl md:text-5xl font-bold text-sky-600 mb-6 drop-shadow-md">
                    About Me
                </h2>
                <p className="text-center text-lg text-slate-700 leading-relaxed">
                    {about}
                </p>
            </div>
        </section>
    );
}
