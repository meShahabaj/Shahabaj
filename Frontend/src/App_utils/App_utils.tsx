import { lazy, LazyExoticComponent, FC, ReactNode } from "react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { SiKaggle, SiGmail } from "react-icons/si";
import { RiWhatsappFill } from "react-icons/ri";

interface App_utils_items {
  path: string,
  element: LazyExoticComponent<FC<any>>;
}

interface Contact {
  key: number;
  title: ReactNode;
  link: string

}

// ROUTES IMPORT
export const App_utils: App_utils_items[] = [
  { path: "/", element: lazy(() => import("../Pages/Home/Home.tsx")) },
  { path: "/projects/salary_predictor", element: lazy(() => import("../Pages/SalaryPredictor/SalaryPredictor.tsx")) },
  { path: "/projects/image_editor", element: lazy(() => import("../Pages/ImageEditor/ImageEditor.tsx")) },
  { path: "/projects/number_identifier", element: lazy(() => import("../Pages/NumberIdentifier/NumberIdentifier.js")) },
  { path: "/projects/stone_paper_scissor", element: lazy(() => import("../Pages/StonePaperScissor/StonePaperScissor.js")) },
  { path: "/projects/face_extractor", element: lazy(() => import("../Pages/FaceExtractor/FaceExtractor.tsx")) },
  {
    path: "/projects/assistant", element: lazy(() => import("../Pages/Assistant/Assistant.tsx"))
  },
  { path: "/projects/resume_scorer", element: lazy(() => import("../Pages/Resume_scorer/Resume_scorer.tsx")) },
  { path: "/projects/goal_achiever", element: lazy(() => import("../Pages/GoalAchiever/GoalAchieverShow.tsx")) },
  { path: "/projects/goal_achiever/signup", element: lazy(() => import("../Pages/GoalAchiever/Auth/Signup.tsx")) },
  { path: "/projects/goal_achiever/login", element: lazy(() => import("../Pages/GoalAchiever/Auth/Login.tsx")) },
  { path: "/projects/goal_achiever/goalcreate", element: lazy(() => import("../Pages/GoalAchiever/GoalAchieverCreate.tsx")) },
];

export const contacts: Contact[] = [
  {
    key: 1,
    title: <SiGmail style={{ color: "red", cursor: "pointer", fontSize: "22px" }} />,
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=shahabaj773@gmail.com",
  },
  {
    key: 2,
    title: <FaGithub style={{ color: "black", cursor: "pointer", fontSize: "22px" }} />,
    link: "https://github.com/meShahabaj",

  },
  {
    key: 3,
    title: <SiKaggle className="icon" style={{
      cursor: "pointer", fontSize: "22px", color: "blue"
    }} />,
    link: "https://kaggle.com/shahabaj11",

  },
  {
    key: 4,
    title: <RiWhatsappFill style={{ color: "green", cursor: "pointer", fontSize: "22px" }} />,
    link: "https://wa.me/919336934551",

  },
  {
    key: 5,
    title: <FaLinkedin style={{ color: "blue", cursor: "pointer", fontSize: "22px" }} />,
    link: "https://linkedin.com/in/shahabaj-khan/",

  },
  {
    key: 6,
    title: <FaYoutube style={{ color: "red", cursor: "pointer", fontSize: "22px" }} />,
    link: "https://www.youtube.com/channel/UCiNSEa7oKPMpgaqVWgs353A/",

  },
];