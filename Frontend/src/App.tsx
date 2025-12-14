// library import
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, FC } from "react";

// local import
import { WakeServer } from "./App_utils/WakeServer.js";
import Loading from "./App_utils/Loading.tsx";
import { App_utils } from "./App_utils/App_utils.tsx";

interface AppRoute {
  path: string,
  element: FC
}

const App: FC = () => {
  // Request to wakeup server
  WakeServer();

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* Importing routes dynamically */}
          {(App_utils as AppRoute[])
            .map(({ path, element: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
