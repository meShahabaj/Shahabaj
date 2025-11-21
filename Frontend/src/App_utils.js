import { lazy } from "react";

export const App_utils = [
  { path: "/", element: lazy(() => import("./Pages/Home/Home.js")) },
  { path: "/projects", element: lazy(() => import("./Pages/Projects/Projects.js")) },
  { path: "/projects/salary_predictor", element: lazy(() => import("./Pages/SalaryPredictor/SalaryPredictor.js")) },
  { path: "/projects/image_editor", element: lazy(() => import("./Pages/ImageEditor/ImageEditor.js")) },
  { path: "/projects/number_identifier", element: lazy(() => import("./Pages/NumberIdentifier/NumberIdentifier.js")) },
  { path: "/projects/stone_paper_scissor", element: lazy(() => import("./Pages/StonePaperScissor/StonePaperScissor.js")) },
  { path: "/projects/face_extractor", element: lazy(() => import("./Pages/FaceExtractor/FaceExtractor.js")) },
];

export const Loading = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "sans-serif",
    color: "#333",
    gap: "1rem",
  };

  const dotsContainerStyle = {
    display: "flex",
    gap: "10px",
  };

  const dotStyle = (delay) => ({
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    animation: `bounce 0.6s ${delay}s infinite alternate`,
  });

  const keyframes = `
    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-20px); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <div style={dotsContainerStyle}>
        <div style={dotStyle(0)}></div>
        <div style={dotStyle(0.2)}></div>
        <div style={dotStyle(0.4)}></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;

