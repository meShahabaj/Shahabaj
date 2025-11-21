import "./Home.css";
import { useRef, useEffect } from "react";
import { about, headerButtons, courses, projects } from "./Home_utils";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Skill from "./skills";
import EasyConnect from "../EasyConnect";
import Chatbot from "../ChatBot/Chatbot";
import VideoSlider from "./VideoSlider";

const Home = () => {
  const navigate = useNavigate();

  // Section Refs (for scrolling effect)
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const certificateRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const videoRef = useRef(null);
  const skillRef = useRef(null);

  // Map section names to refs
  const refMap = {
    Home: homeRef,
    About: aboutRef,
    Skills: skillRef,
    Certificates: certificateRef,
    Projects: projectsRef,
    Contact: contactRef,
  };

  // Smooth scroll
  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: "smooth" });

  // CV Download
  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/Data/Shahabaj_Khan_CV.pdf";
    link.download = "Shahabaj_Khan_CV.pdf";
    link.click();
  };

  // Control video playback rate
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.8;
  }, []);

  return (
    <div className="page">
      <Chatbot />
      {/* Easy Connect Section */}
      <EasyConnect />

      {/* Header Navigation */}
      <div className="page_pagination">
        {headerButtons.map((b, i) => (
          <button
            key={i}
            className="page_pagination_button"
            onClick={() =>
              b.name === "Download CV"
                ? downloadCV()
                : scrollTo(refMap[b.name])
            }
          >
            {b.icon}
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* Home Section */}
      <div ref={homeRef} className="page_home">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="page_home_bgvideo"
        >
          <source src="Data/Home_bg.mp4" type="video/mp4" />
        </video>
        <div className="page_home_left">
          <h1>Shahabaj Khan</h1>
          <h3>
            <Typewriter
              options={{
                strings: [
                  "Data Scientist",
                  "ML Engineer",
                  "AI Developer",
                  "Python Developer",
                  "PyTorch", "Python",
                  "SQL", "Data Engineering",
                  "Data Analysis", "Model Designing",
                  "MERN Stack", "Power BI"
                ],
                autoStart: true,
                loop: true,
                delay: 45,
                deleteSpeed: 35,
              }}
            />
          </h3>
        </div>
        <div className="page_home_right">
          <img
            className="page_home_right_img"
            src="Data/pic.png"
            alt="Hello"
          />
        </div>
      </div>

      {/* About Section */}
      <div ref={aboutRef} className="page_about">

        <h2 className="page_about_heading">About Me</h2>
        <p className="page_about_paragraph">{about}</p>

      </div>
      <div ref={skillRef}>
        <Skill />
      </div>


      {/* Projects Section */}
      <div ref={projectsRef} className="page_projects">
        <h2 className="page_projects_h2">Projects</h2>

        <div className="page_projects_div">
          {projects.map((p, i) => (
            <div key={i} className="page_projects_div_div">
              <Link to={p.address} key={p.address} style={{ textDecoration: "None" }}>
                <img
                  className="page_projects_div_img"
                  src={`/Data/Project_pic/${p.pic}`}
                  alt={p.title}
                  loading="lazy"
                />
                <p className="page_projects_div_p">{p.title}</p>
              </Link>
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/projects")}
          style={{
            marginTop: "1rem", backgroundColor: "black",
            color: "white", border: "none", cursor: "pointer",
            padding: "4px", fontSize: "18px"
          }}>
          See All
        </button>

      </div>

      {/* Certificates Section */}
      <div ref={certificateRef} className="page_certificates">
        <h2 className="page_certificates_heading">Certificates</h2>
        <div className="page_certificates_imgdiv">
          {courses.map((c, i) => (
            <img
              key={i}
              className="page_certificates_imgdiv_img"
              src={`/Data/Courses_pic/${c}`}
              alt={c}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h2 className="page_projects_h2">Videos</h2>
        <VideoSlider  />
      </div>
    </div>
  );
}

export default Home;