import { courses } from "./Home_utils.tsx";
import { motion } from "framer-motion";

interface Props {
    refProp: React.RefObject<HTMLElement | null>;
}

export default function CertificatesSection({ refProp }: Props) {
    return (
        <section
            ref={refProp}
            className="relative bg-gradient-to-br from-blue-100 via-blue-100 to-blue px-[6%] py-20 flex flex-col items-center overflow-hidden"
        >
            <h2 className="text-4xl md:text-5xl text-sky-600 font-bold mb-12 drop-shadow-md">
                Certificates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-[1400px]">
                {courses.map((c) => (
                    <motion.div
                        key={c}
                        className="relative rounded-2xl shadow-lg overflow-hidden cursor-pointer bg-white"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src={`/Data/Courses_pic/${c}`}
                            alt={c}
                            className="w-full h-48 object-cover"
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
