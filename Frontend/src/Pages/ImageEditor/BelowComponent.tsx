import React from "react";
import { FaEye, FaUserSecret, FaArrowsAlt } from "react-icons/fa";

const features = [
    {
        title: "Blur Entire Image Instantly",
        description: "Apply smooth blur effects to the whole image with one click.",
        icon: <FaEye className="text-indigo-500 w-12 h-12" />,
    },
    {
        title: "Auto Blur All Faces",
        description: "Detect and anonymize all human faces automatically—perfect for privacy.",
        icon: <FaUserSecret className="text-green-500 w-12 h-12" />,
    },
    {
        title: "Resize Images Seamlessly",
        description: "Change dimensions without losing quality or aspect ratio.",
        icon: <FaArrowsAlt className="text-yellow-500 w-12 h-12" />,
    },
];

export default function FeaturesSection() {
    return (
        <section className="bg-gray-50 py-16 mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                    Key Features
                </h2>

                <div className="flex flex-col space-y-16">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={"flex flex-col md:flex-row items-center gap-8"}
                        >
                            {/* Icon */}
                            <div className="md:flex-1 flex justify-center md:justify-center">
                                <div className="bg-white p-6 rounded-3xl shadow-lg flex items-center justify-center w-32 h-32">
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Text */}
                            <div className="md:flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-lg">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
