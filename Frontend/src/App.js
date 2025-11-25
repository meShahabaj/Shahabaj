import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { App_utils } from "./App_utils/App_utils.tsx";
import { Suspense } from "react";
import { WakeServer } from "./App_utils/WakeServer.js";
import Loading from "./App_utils/Loading.tsx";

const App = () => {
  // Request to wakeup server
  WakeServer();

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* Importing routes dynamically */}
          {App_utils.map(({ path, element: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
