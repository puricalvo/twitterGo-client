import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { map } from "lodash";
import configRouting from "./configRouting";

export default function Routing(props) {
  const { setRefreshCheckLogin } = props;
  return (
    // Usamos el Router (que ahora es HashRouter)
    <Router>
      <Routes>
        {map(configRouting, (route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.page setRefreshCheckLogin={setRefreshCheckLogin} />}
          />
        ))}
      </Routes>
    </Router>
  );
}
