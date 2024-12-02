import logo from './logo.svg';
import Ongeki from './ongeki.js';
import Kamai from './kamai.js';

import './App.css';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Kamai></Kamai>
        <Ongeki></Ongeki>
      </header>
    </div>
  );
}

export default App;
