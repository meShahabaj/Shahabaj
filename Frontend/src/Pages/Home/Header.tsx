import React, { FC } from "react";

interface NavLink {
    title: string;
    href?: string;
    isDownload?: boolean;
}

interface HeaderProps {
    scrollToSection: (ref: React.RefObject<HTMLElement>) => void;
    refs: { [key: string]: React.RefObject<HTMLElement> };
    downloadCV: () => void;
}

const Header: FC<HeaderProps> = ({ scrollToSection, refs, downloadCV }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const navLinks: NavLink[] = [
        { title: "About" },
        { title: "Skills" },
        { title: "Projects" },
        { title: "Certificates" },
        { title: "Download CV", isDownload: true },
    ];

    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-md transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                {/* Logo */}
                <button onClick={() => scrollToSection(refs["Home"])} className="text-3xl font-bold text-blue-600 cursor-pointer hover:scale-105 transition-transform">
                    Shahabaj
                </button>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (link.isDownload) downloadCV();
                                else scrollToSection(refs[link.title]);
                            }}
                            className={`font-medium transition-all ${link.isDownload
                                ? "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                : "relative text-gray-700 hover:text-blue-600 after:content-[''] after:block after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
                                }`}
                        >
                            {link.title}
                        </button>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-700 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-white/95 backdrop-blur-md shadow-md px-6 py-4 flex flex-col gap-3 transform transition-transform ${isOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                    }`}
            >
                {navLinks.map((link, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (link.isDownload) downloadCV();
                            else scrollToSection(refs[link.title]);
                            setIsOpen(false);
                        }}
                        className={`w-full font-medium transition-all ${link.isDownload
                            ? "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            : "text-gray-700 hover:text-blue-600 text-left"
                            }`}
                    >
                        {link.title}
                    </button>
                ))}
            </div>
        </header >
    );
};

export default Header;
