import { lazy, Suspense, JSX, useRef } from "react";
import { motion } from "framer-motion"
import EasyConnect from "../../App_utils/EasyConnect.tsx";
import Header from "./Components/Header.tsx";
import Banner from "./Components/Banner.tsx"
import About from "./Components/About.tsx"

// Lazy-load sections
const ProjectsSection = lazy(() => import("./Components/ProjectSection.tsx"));
const CertificatesSection = lazy(() => import("./Components/CertificateSection.tsx"));
const VideosSection = lazy(() => import("./Components/VideoSection.tsx"));
const Skills = lazy(() => import("./Components/Skills_temp.tsx"));
const Chatbot = lazy(() => import("./Components/Chatbot.tsx"));
const SectionLoader = () => (
  <div className="py-24 flex justify-center">
    <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function Home(): JSX.Element {

  // Section refs
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const skillRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const certificateRef = useRef<HTMLElement | null>(null);

  // CV download
  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/Data/CV.pdf";
    link.download = "Shahabaj_Khan_CV.pdf";
    link.click();
  };
  const SectionMotion = ({ children }: { children: JSX.Element }) => (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.43, 0.13, 0.23, 0.96], // PPT smooth
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="bg-slate-50 text-slate-800 overflow-x-hidden font-sans">
      <Suspense fallback={null}><Chatbot /></Suspense> <EasyConnect />
      <SectionMotion>
        <Header
          downloadCV={downloadCV}
          scrollToSection={(ref) =>
            ref?.current?.scrollIntoView({ behavior: "smooth" })
          }
          refs={{
            Home: homeRef,
            About: aboutRef,
            Skills: skillRef,
            Projects: projectsRef,
            Certificates: certificateRef,
          }}
        />
      </SectionMotion>

      <SectionMotion>
        <Suspense fallback={<SectionLoader />}>
          <Banner refProp={homeRef} />
        </Suspense>
      </SectionMotion>

      <SectionMotion>
        <Suspense fallback={<SectionLoader />}>
          <About refProp={aboutRef} />
        </Suspense>
      </SectionMotion>

      <SectionMotion>
        <Suspense fallback={<SectionLoader />}>
          <Skills refProp={skillRef} />
        </Suspense>
      </SectionMotion>

      <SectionMotion>
        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection
            refProp={projectsRef}
          />
        </Suspense>
      </SectionMotion>

      <SectionMotion>
        <CertificatesSection refProp={certificateRef} />

      </SectionMotion>

      <SectionMotion>
        <Suspense fallback={<SectionLoader />}>
          <VideosSection />
        </Suspense>
      </SectionMotion>



    </div>

  );
}
