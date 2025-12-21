import { Link } from "react-router-dom";
import { projects } from "../Home_utils.tsx";

interface Props {
    refProp: React.RefObject<HTMLElement | null>;
}

export default function ProjectsSection({ refProp }: Props) {
    return (
        <section
            ref={refProp}
            className="bg-gradient-to-br from-slate-50 via-sky-50 to-white px-[6%] py-16"
        >
            {/* Header */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-sky-600">
                    Projects
                </h2>

            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-[1400px] mx-auto">
                {projects.map((p) => (
                    <div
                    >
                        <Link
                            to={p.address}
                            className="
        group block h-full
        rounded-2xl overflow-hidden
        bg-white/70 backdrop-blur
        shadow-md hover:shadow-xl
        transition-all duration-500

        hover:bg-sky-50/80
    "
                        >
                            {/* Image */}
                            <div className="overflow-hidden">
                                <img
                                    src={`/Data/Project_pic/${p.pic}`}
                                    alt={p.title}
                                    className="
                                        w-full h-56 object-cover
                                        transition-transform duration-700
                                        group-hover:scale-[1.03]
                                    "
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="h-[2px] w-0 bg-sky-500 transition-all duration-500 group-hover:w-full" />

                                <h3
                                    className="
        text-lg font-semibold mb-1
        text-slate-800
        transition-colors duration-300
        group-hover:text-sky-600
    "
                                >
                                    {p.title}
                                </h3>

                                <p
                                    className="
        text-sm text-slate-500
        transition-colors duration-300
        group-hover:text-sky-500
    "
                                >
                                    View project details →
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section >
    );
}
