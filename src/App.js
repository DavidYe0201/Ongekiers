import Kamai from "./kamai.js";
import Leaderboard from "./leaderboard.js";
import ScoreSimulator from "./scoresimulator.js";
import ScoreSimulatorV2 from "./scoresimulatorV2.js";

import withRouterParams from "./withRouterParams";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar.js";
import "./App.css";

const KamaiWithRouter = withRouterParams(Kamai);
const LeaderboardWithRouter = withRouterParams(Leaderboard);
const ScoreSimulatorWithRouter = withRouterParams(ScoreSimulator);
const ScoreSimulatorWithRouterV2 = withRouterParams(ScoreSimulatorV2);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
        <Navbar></Navbar>
          <Routes>
            <Route path="/:name/:version?" element={<KamaiWithRouter />} />
            <Route path="/" element={<KamaiWithRouter />} />
            <Route path="/leaderboard" element={<LeaderboardWithRouter />} />
            <Route
              path="/scoresimulator"
              element={<ScoreSimulatorWithRouter />}
            />
                        <Route
              path="/scoresimulatorv2"
              element={<ScoreSimulatorWithRouterV2 />}
            />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
