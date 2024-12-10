import Kamai from './kamai.js';
import withRouterParams from "./withRouterParams";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

const KamaiWithRouter = withRouterParams(Kamai);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/:name/:version?" element={<KamaiWithRouter/>} />
            <Route path="/" element={<KamaiWithRouter/>} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
