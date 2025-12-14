import { useRef, useEffect, lazy, Suspense } from "react";
import { about, courses, projects } from "./Home_utils.tsx";
import Typewriter from "typewriter-effect";
import { useNavigate, Link } from "react-router-dom";
import EasyConnect from "../../App_utils/EasyConnect.tsx";
import Header from "./Header.tsx";

// Lazy loaded
const Skill = lazy(() => import("./skills.tsx"));
const Chatbot = lazy(() => import("../ChatBot/Chatbot"));
const VideoSlider = lazy(() => import("./VideoSlider.tsx"));

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  // ✅ Properly typed refs
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const skillRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const certificateRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const downloadCV = (): void => {
    const link = document.createElement("a");
    link.href = "/Data/CV.pdf";
    link.download = "Shahabaj_Khan_CV.pdf";
    link.click();
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 overflow-x-hidden">
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>

      <EasyConnect />

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

      {/* HERO */}
      <section
        ref={homeRef}
        className="relative flex flex-col md:flex-row items-center justify-center min-h-[80vh] mt-20 text-white"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-110"
        >
          <source src="/Data/Home_bg.mp4" type="video/mp4" />
        </video>

        <div className="z-10 flex-1 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Shahabaj Khan
          </h1>

          <h3 className="mt-3 text-slate-300 font-medium">
            <Typewriter
              options={{
                strings: [
                  "Data Scientist",
                  "ML Engineer",
                  "AI Developer",
                  "Python Developer",
                  "PyTorch",
                  "SQL",
                  "Data Analysis",
                  "MERN Stack",
                  "Power BI",
                ],
                autoStart: true,
                loop: true,
                delay: 45,
                deleteSpeed: 35,
              }}
            />
          </h3>
        </div>

        <div className="z-10 flex-1 flex justify-center mt-8 md:mt-0">
          <img
            src="/Data/pic.png"
            alt="Profile"
            loading="lazy"
            className="w-[60%] max-w-[320px] rounded-full
                       shadow-[0_8px_25px_rgba(3,105,161,0.4)]
                       bg-cyan-500/10 hover:scale-105 transition"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section
        ref={aboutRef}
        className="bg-white px-[10%] py-10 flex flex-col items-center"
      >
        <h2 className="text-3xl text-sky-600 font-semibold relative after:block after:w-16 after:h-1 after:bg-sky-500 after:mx-auto after:mt-2">
          About Me
        </h2>

        <p className="max-w-[850px] text-center text-slate-600 mt-8 leading-8 text-lg">
          {about}
        </p>
      </section>

      {/* SKILLS */}
      <section ref={skillRef}>
        <Suspense fallback={null}>
          <Skill />
        </Suspense>
      </section>

      {/* PROJECTS */}
      <section
        ref={projectsRef}
        className="bg-white px-[8%] py-20 flex flex-col items-center"
      >
        <h2 className="text-3xl text-sky-600 font-semibold mb-8">
          Projects
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {projects.map((p) => (
            <Link
              key={p.address}
              to={p.address}
              className="bg-slate-50 rounded-xl w-[280px] overflow-hidden
                         shadow-md hover:-translate-y-1 hover:shadow-xl transition"
            >
              <img
                src={`/Data/Project_pic/${p.pic}`}
                alt={p.title}
                loading="lazy"
                className="w-full h-[180px] object-cover"
              />
              <p className="text-center py-4 font-medium text-slate-700">
                {p.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          onClick={() => navigate("/projects")}
          className="mt-6 bg-black text-white px-4 py-1 text-lg rounded hover:opacity-90"
        >
          See All
        </button>
      </section>

      {/* CERTIFICATES */}
      <section
        ref={certificateRef}
        className="bg-slate-100 px-[6%] py-20 flex flex-col items-center"
      >
        <h2 className="text-3xl text-sky-600 font-semibold mb-10">
          Certificates
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {courses.map((c) => (
            <img
              key={c}
              src={`/Data/Courses_pic/${c}`}
              alt={c}
              loading="lazy"
              className="w-[22%] min-w-[200px] rounded-xl shadow-lg
                         hover:scale-105 hover:shadow-cyan-400/30 transition"
            />
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      <section className="flex flex-col items-center py-16">
        <h2 className="text-3xl text-sky-600 font-semibold mb-6">
          Videos
        </h2>

        <Suspense fallback={null}>
          <VideoSlider />
        </Suspense>
      </section>
    </div>
  );
}
