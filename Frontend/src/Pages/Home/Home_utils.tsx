import { ReactNode } from "react";
import {
  FcHome,
  FcInspection,
  FcManager,
  FcOpenedFolder,
  FcDownload,
  FcComboChart,
} from "react-icons/fc";


/* =======================
   TYPES
======================= */

export interface HeaderButton {
  name: string;
  icon: ReactNode;
}

export interface Project {
  title: string;
  pic: string;
  address: string;
}



export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
}

export interface Video {
  title: string;
  url: string;
  thumbnail: string;
}

/* =======================
   HEADER
======================= */

export const headerButtons: HeaderButton[] = [
  { name: "Home", icon: <FcHome className="icon" /> },
  { name: "About", icon: <FcManager className="icon" /> },
  { name: "Skills", icon: <FcComboChart className="icon" /> },
  { name: "Projects", icon: <FcOpenedFolder className="icon" /> },
  { name: "Certificates", icon: <FcInspection className="icon" /> },
  { name: "Download CV", icon: <FcDownload className="icon" /> },
];

/* =======================
   ABOUT
======================= */

export const about: string =
  "Hi, Shahabj Khan this side, a data enthusiast who loves transforming ideas into impactful data-driven projects. I enjoy working with tools like PyTorch, Python, Pandas, NumPy, Scikit-learn, and Power BI to uncover insights and build intelligent solutions. I’m always exploring new techniques in data analysis, visualization, and machine learning. Currently, I’m pursuing my Master of Computer Applications (MCA) from Lovely Professional University, which is helping me deepen my understanding of software development, algorithms, and real-world problem-solving. When I’m not coding, I’m experimenting with new libraries or learning about the latest in AI — always aiming to turn data into meaningful impact.";

/* =======================
   COURSES
======================= */

export const courses: string[] = [
  "SimpliLearn_Certificate_DL.png",
  "SimpliLearn_Certificate_ML.jpeg",
  "SimpliLearn_Certificate_PowerBI.png",
  "Udemy.jpeg",
];

/* =======================
   PROJECTS
======================= */

export const projects: Project[] = [
  {
    title: "Techis Talk: ",
    pic: "Techis_talk.png",
    address: "https://techistalk.vercel.app/",
  },
  {
    title: "Anixo: IT Solutions",
    pic: "anixo.png",
    address: "https://anixo.onrender.com/",
  },
  {
    title: "Image Editor",
    pic: "Image_editor.jpg",
    address: "/projects/image_editor",
  },
  {
    title: "Face Extractor From Image",
    pic: "Face_locator.jpg",
    address: "/projects/face_extractor",
  },
  {
    title: "AI (RAG) Chat Bot: About Me",
    pic: "pexels-thirdman-5592313.jpg",
    address: "/projects/assistant",
  }, {
    title: "Resume Scorer",
    pic: "resume_scorer.png",
    address: "/projects/resume_scorer",
  },
  {
    title: "Stone Paper Scissor Game with Live Gesture",
    pic: "Stone_paper_scissor.jpg",
    address: "/projects/stone_paper_scissor",
  },
  {
    title: "Salary Predictor",
    pic: "Salary_prediction_img.jpeg",
    address: "/projects/salary_predictor",
  },

  {
    title: "Goal Achiever",
    pic: "goal-achiever.png",
    address: "/projects/goal_achiever/analytics",
  },

];

/* =======================
   SKILLS
======================= */

export const defaultSkills: Skill[] = [
  // ======================
  // PROGRAMMING LANGUAGES
  // ======================
  {
    id: 1,
    name: "Python",
    category: "Programming Languages",
    icon: "https://cdn.worldvectorlogo.com/logos/python-5.svg",
  },
  {
    id: 2,
    name: "JavaScript",
    category: "Programming Languages",
    icon: "https://cdn.worldvectorlogo.com/logos/javascript-1.svg",
  },
  {
    id: 3,
    name: "C++",
    category: "Programming Languages",
    icon: "https://cdn.worldvectorlogo.com/logos/c-plusplus.svg",
  },
  {
    id: 4,
    name: "HTML",
    category: "Programming Languages",
    icon: "https://cdn.worldvectorlogo.com/logos/html-1.svg",
  },
  {
    id: 5,
    name: "CSS",
    category: "Programming Languages",
    icon: "https://cdn.worldvectorlogo.com/logos/css-3.svg",
  },

  // =========
  // WEB DEV
  // =========
  {
    id: 6,
    name: "React",
    category: "Web Dev",
    icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
  },
  {
    id: 7,
    name: "Node.js",
    category: "Web Dev",
    icon: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg",
  },
  {
    id: 8,
    name: "FastAPI",
    category: "Web Dev",
    icon: "https://cdn.worldvectorlogo.com/logos/fastapi.svg",
  },
  {
    id: 9,
    name: "Flask",
    category: "Web Dev",
    icon: "https://cdn.worldvectorlogo.com/logos/flask.svg",
  },

  // =========
  // DATABASE
  // =========
  {
    id: 10,
    name: "MongoDB",
    category: "Database",
    icon: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
  },
  {
    id: 11,
    name: "MySQL",
    category: "Database",
    icon: "https://cdn.worldvectorlogo.com/logos/mysql-6.svg",
  },

  // =========
  // ML & DL
  // =========
  {
    id: 12,
    name: "Pandas",
    category: "ML & DL",
    icon: "https://cdn.worldvectorlogo.com/logos/pandas.svg",
  },
  {
    id: 13,
    name: "NumPy",
    category: "ML & DL",
    icon: "https://cdn.worldvectorlogo.com/logos/numpy-1.svg",
  },
  {
    id: 14,
    name: "Matplotlib",
    category: "ML & DL",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg",
  },
  {
    id: 15,
    name: "Seaborn",
    category: "ML & DL",
    icon: "https://cdn.worldvectorlogo.com/logos/seaborn-1.svg",
  },
  {
    id: 16,
    name: "Scikit-learn",
    category: "ML & DL",
    icon: "https://cdn.worldvectorlogo.com/logos/scikit-learn.svg",
  },
  {
    id: 17,
    name: "PyTorch",
    category: "ML & DL",
    icon: "https://logo.svgcdn.com/devicon/pytorch-original.svg",
  },
  {
    id: 18,
    name: "Ultralytics YOLO",
    category: "ML & DL",
    icon: "https://raw.githubusercontent.com/ultralytics/assets/main/logo/Ultralytics_YOLO_Logomark.png",
  },
  {
    id: 19,
    name: "OpenCV",
    category: "ML & DL",
    icon: "https://cdn.worldvectorlogo.com/logos/opencv.svg",
  },
  {
    id: 20,
    name: "MediaPipe",
    category: "ML & DL",
    icon: "https://logo.svgcdn.com/simple-icons/mediapipe-dark.svg",
  },
  {
    id: 21,
    name: "CNN",
    category: "ML & DL",
    icon: "https://cdn-icons-png.flaticon.com/512/2103/2103658.png",
  },
  {
    id: 22,
    name: "LangChain",
    category: "ML & DL",
    icon: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
  },
];


export const categories: string[] = [
  "ML & DL",
  "Programming Languages",
  "Web Dev",
  "Database",
];

/* =======================
   VIDEOS
======================= */

export const videos: Video[] = [
  {
    title: "How to Create Salary Predictor From Scratch",
    url: "https://youtu.be/wM8BiuqH164",
    thumbnail: "https://img.youtube.com/vi/wM8BiuqH164/maxresdefault.jpg",
  },
  {
    title: "Linear Regression from Scratch",
    url: "https://youtu.be/f45xdjXsjIM",
    thumbnail: "https://img.youtube.com/vi/f45xdjXsjIM/maxresdefault.jpg",
  },
  {
    title: "Gesture Based Rock Paper Scissor Game from Scratch",
    url: "https://youtu.be/UX4J1AcQ3DA",
    thumbnail: "https://img.youtube.com/vi/UX4J1AcQ3DA/maxresdefault.jpg",
  },
  {
    title: "Face Detection Using AI",
    url: "https://youtu.be/wUFY26EzG_s",
    thumbnail: "https://img.youtube.com/vi/wUFY26EzG_s/maxresdefault.jpg",
  },
  {
    title: "Face Blur",
    url: "https://youtu.be/g0MqmEbD67o",
    thumbnail: "https://img.youtube.com/vi/g0MqmEbD67o/maxresdefault.jpg",
  },
  {
    title: "Gaussian Blur",
    url: "https://youtu.be/4IeFVQ_qkyk",
    thumbnail: "https://img.youtube.com/vi/4IeFVQ_qkyk/maxresdefault.jpg",
  },
];
