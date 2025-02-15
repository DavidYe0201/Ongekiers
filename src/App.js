import Kamai from "./kamai.js";
import Leaderboard from "./leaderboard.js";
import ScoreSimulator from "./scoresimulator.js";

import withRouterParams from "./withRouterParams";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar.js";
import "./App.css";

const KamaiWithRouter = withRouterParams(Kamai);
const LeaderboardWithRouter = withRouterParams(Leaderboard);
const ScoreSimulatorWithRouter = withRouterParams(ScoreSimulator);

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
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
