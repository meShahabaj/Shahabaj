import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { App_utils, Loading } from "./App_utils.js";
import { Suspense } from "react";
import { useWakeServer } from "./useWakeServer.js";

const App = () => {
  useWakeServer();

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {App_utils.map(({ path, element: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
