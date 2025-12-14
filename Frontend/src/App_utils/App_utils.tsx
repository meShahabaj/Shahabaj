import { lazy, LazyExoticComponent, FC } from "react";

interface App_utils_items {
  path: string,
  element: LazyExoticComponent<FC<any>>;
}

// ROUTES IMPORT
export const App_utils: App_utils_items[] = [
  { path: "/", element: lazy(() => import("../Pages/Home/Home.tsx")) },
  { path: "/projects", element: lazy(() => import("../Pages/Projects/Projects.js")) },
  { path: "/projects/salary_predictor", element: lazy(() => import("../Pages/SalaryPredictor/SalaryPredictor.js")) },
  { path: "/projects/image_editor", element: lazy(() => import("../Pages/ImageEditor/ImageEditor.js")) },
  { path: "/projects/number_identifier", element: lazy(() => import("../Pages/NumberIdentifier/NumberIdentifier.js")) },
  { path: "/projects/stone_paper_scissor", element: lazy(() => import("../Pages/StonePaperScissor/StonePaperScissor.js")) },
  { path: "/projects/face_extractor", element: lazy(() => import("../Pages/FaceExtractor/FaceExtractor.js")) },
  { path: "/projects/assistant", element: lazy(() => import("../Pages/Assistant/Assistant.js")) },
  { path: "/projects/resume_scorer", element: lazy(() => import("../Pages/Resume_scorer/Resume_scorer.tsx")) },
];

