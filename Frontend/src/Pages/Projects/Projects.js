import { pages } from "./Projects_util";
import { Link } from "react-router-dom";
import "./Projects.css";
import EasyConnect from "../EasyConnect";

const Projects = () => {
  return (
    <div className="projects">
      <EasyConnect/>
      <h1 className="projects_h1">Projects</h1>

      <div className="Projects-container">

        {pages.map((p) => (
          <Link to={p.url} key={p.name} className="Projects-card">
            <img src={p.img} alt={p.name} className="Projects-card-img" />

            <div>
              <h2 className="Projects-card-title">{p.name}</h2>
              <p className="Projects-card-desc">{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
      </div>
  );
};

export default Projects;
