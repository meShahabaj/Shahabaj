import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { projects } from "../Home/Home_utils.tsx";
import { Link } from "react-router-dom";

const Header = () => {
    const [showTools, setShowTools] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-20">
            <div className="flex justify-between items-center">
                {/* Logo / Name */}
                <a href="#" className="text-3xl font-bold text-blue-600">Shahabaj Khan</a>


                {/* Desktop menu */}
                <nav className="hidden md:flex items-center space-x-4 relative">

                    <div
                        className="relative"
                        onMouseEnter={() => setShowTools(true)}
                        onMouseLeave={() => setShowTools(false)}
                    >
                        <button
                            className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors mx-10"
                            aria-haspopup="true"
                            aria-expanded={showTools ? "true" : "false"}
                        >
                            Other Tools
                        </button>

                        {/* Dropdown */}
                        <div
                            className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${showTools ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}
                        >
                            {projects.map((p, index) => (
                                <Link
                                    to={p.address}
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                    {p.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Mobile hamburger */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="text-gray-700 hover:text-blue-600 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {mobileMenu ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden mt-2 border-t border-gray-200 transition-all duration-300 overflow-hidden ${mobileMenu ? "max-h-60" : "max-h-0"
                    }`}
            >
                <nav className="flex flex-col py-2">
                    {projects.map((p, index) => (
                        <a
                            key={index}
                            href="#"
                            className="px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                            {p.title}
                        </a>
                    ))}
                </nav>
            </div>
        </header >
    );
};

export default Header;
