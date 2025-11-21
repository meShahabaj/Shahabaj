import { FcHome, FcInspection, FcManager, FcOpenedFolder, FcDownload, FcComboChart } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { SiKaggle, SiGmail } from "react-icons/si";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { Code, Database, Cpu, Server, Image as ImgIcon, Cloud } from "lucide-react";

// Header
export const headerButtons = [
  { name: "Home", icon: <FcHome className="icon" /> },
  { name: "About", icon: <FcManager className="icon" /> },
  { name: "Skills", icon: <FcComboChart className="icon" /> },{ name: "Projects", icon: <FcOpenedFolder className="icon" /> },
  { name: "Certificates", icon: <FcInspection className="icon" /> },
  
  { name: "Download CV", icon: <FcDownload className="icon" /> },
];

export const about = "A data enthusiast who loves transforming ideas into impactful data-driven projects. I enjoy working with tools like PyTorch, Python, Pandas, NumPy, Scikit-learn, and Power BI to uncover insights and build intelligent solutions. I’m always exploring new techniques in data analysis, visualization, and machine learning.Currently, I’m pursuing my Master of Computer Applications (MCA) from Lovely Professional University, which is helping me deepen my understanding of software development, algorithms, and real-world problem-solving. When I’m not coding, I’m experimenting with new libraries or learning about the latest in AI — always aiming to turn data into meaningful impact."


export const courses = ["SimpliLearn_Certificate_DL.png", "SimpliLearn_Certificate_ML.jpeg",
  "SimpliLearn_Certificate_PowerBI.png", "Udemy.jpeg"]
export const projects = [
  {
    "title": "Image Editor",
    "pic": "face-blurrring-featured-image.avif",
    "address": "/projects/image_editor"
  }, {
    "title": "Stone Paper Scissor Game with Live Gesture",
    "pic": "Stone_paper_scissor.jpg",
    "address": "/projects/stone_paper_scissor"
  },{
    "title": "Face Extractor From Image",
    "pic": "Face_locator.jpg",
    "address": "/projects/face_extractor"
  },
  {
    "title": "Salary Predictor",
    "pic": "Salary_prediction_img.jpeg",
    "address": "/projects/salary_predictor"
  },
  
  {
    "title": "Number Identifier",
    "pic": "Mnist.png",
    "address": "/projects/number_identifier"
  },

]
export const contacts = [{
  "title": <SiGmail
    style={{
      color: "#ff0000ff",
      cursor: "pointer",
    }}
  />,
  "link": "https://mail.google.com/mail/?view=cm&fs=1&to=shahabaj773@gmail.com"
},
{
  "title": <FaGithub className="icon" style={{
    color: "black", cursor: "pointer",
  }} />,
  "link": "https://github.com/meShahabaj"
},
{
  "title": <SiKaggle className="icon" />,
  "link": "https://kaggle.com/shahabaj11"
},
{
  "title": <RiWhatsappFill className="icon" style={{
    color: "green",
  }} />,
  "link": "https://wa.me/919336934551"
},
{
  "title": <FaLinkedin className="icon" style={{
    color: "blue"
  }} />,
  "link": "https://linkedin.com/in/shahabaj-khan/"
},
{
  "title": <FaYoutube className="icon" style={{
    color: "red"
  }} />,
  "link": "https://www.youtube.com/channel/UCiNSEa7oKPMpgaqVWgs353A/"
}
]

export const defaultSkills = [
  { id: 1, name: "Python", category: "Programming Languages", icon: <Code size={18} />, level: 90 },
  { id: 2, name: "Javascript", category: "Programming Languages", icon: <Code size={18} />, level: 85 },
  { id: 3, name: "C++", category: "Programming Languages", icon: <Code size={18} />, level: 75 },
  { id: 4, name: "React JS", category: "Web Dev", icon: <Code size={18} />, level: 90 },
  { id: 5, name: "Node JS", category: "Web Dev", icon: <Cpu size={18} />, level: 85 },
  { id: 6, name: "Django", category: "Web Dev", icon: <Server size={18} />, level: 75 },
  { id: 7, name: "MongoDB", category: "Database", icon: <Database size={18} />, level: 90 },
  { id: 8, name: "MySQL", category: "Database", icon: <Cloud size={18} />, level: 85 },
  { id: 9, name: "Pandas", category: "ML & DL", icon: <ImgIcon size={18} />, level: 90 },
  { id: 10, name: "Numpy", category: "ML & DL", icon: <ImgIcon size={18} />, level: 85 },
  { id: 11, name: "Matplotlib", category: "ML & DL", icon: <ImgIcon size={18} />, level: 80 },
  { id: 12, name: "Seaborn", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
  { id: 13, name: "Sckitlearn", category: "ML & DL", icon: <ImgIcon size={18} />, level: 80 },
  { id: 14, name: "PyTorch", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
  { id: 15, name: "Ultralytics", category: "ML & DL", icon: <ImgIcon size={18} />, level: 80 },
  { id: 16, name: "OpenCV", category: "ML & DL", icon: <ImgIcon size={18} />, level: 80 },
  { id: 17, name: "MediaPipe", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
  { id: 18, name: "PyGame", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
  { id: 19, name: "PowerBI", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
  { id: 20, name: "CNN", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
  { id: 20, name: "LangChain", category: "ML & DL", icon: <ImgIcon size={18} />, level: 75 },
];

export const categories = ["All", "ML & DL", "Programming Languages", "Web Dev", "Database"];

// videos.js
export const videos = [
  {
    title: "How to Create Salary Predictor From Scratch",
    url: "https://youtu.be/wM8BiuqH164",
    thumbnail: "https://img.youtube.com/vi/wM8BiuqH164/maxresdefault.jpg"
  },
  {
    title: "Linear Regression from Scratch",
    url: "https://youtu.be/f45xdjXsjIM",
    thumbnail: "https://img.youtube.com/vi/f45xdjXsjIM/maxresdefault.jpg"
  },
  {
    title: "Gesture Based Rock Paper Scissor Game from Scratch",
    url: "https://youtu.be/UX4J1AcQ3DA",
    thumbnail: "https://img.youtube.com/vi/UX4J1AcQ3DA/maxresdefault.jpg"
  },
  {
    title: "Face Detection Using AI",
    url: "https://youtu.be/wUFY26EzG_s",
    thumbnail: "https://img.youtube.com/vi/wUFY26EzG_s/maxresdefault.jpg"
  },
  {
    title: "Face Blur",
    url: "https://youtu.be/g0MqmEbD67o",
    thumbnail: "https://img.youtube.com/vi/g0MqmEbD67o/maxresdefault.jpg"
  }, {
    title: "Gaussian Blur",
    url: "https://youtu.be/4IeFVQ_qkyk",
    thumbnail: "https://img.youtube.com/vi/4IeFVQ_qkyk/maxresdefault.jpg"
  }
];
