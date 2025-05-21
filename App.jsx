import './App.css';
import Identifier from './Identifier';
import RandomMessage from './RandomMessage';
import Home from './Home';
import Checker from './Checker';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Welcome to ReMorse</h1>
      <p>Read between the lines and dots.</p>

      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="home">Home</Link></li>
              <li><Link to="identifier">Identifier</Link></li>
              <li><Link to="checker">Checker</Link></li>
            </ul>
          </nav> 
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="identifier" element={<Identifier />} />
            <Route path="checker" element={<Checker />} />
          </Routes>    
        </div>
      </Router>
    </div>
  );
}

export default App;
