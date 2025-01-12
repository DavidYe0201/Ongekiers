import Kamai from './kamai.js';
import Leaderboard from './leaderboard.js'
import withRouterParams from "./withRouterParams";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

const KamaiWithRouter = withRouterParams(Kamai);
const LeaderboardWithRouter = withRouterParams(Leaderboard);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/:name/:version?" element={<KamaiWithRouter/>} />
            <Route path="/" element={<KamaiWithRouter/>} />
            <Route path="/leaderboard" element={<LeaderboardWithRouter/>} />

          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
