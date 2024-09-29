import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserList from './components/UserList';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserForm from './components/UserForm';

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Users</Link>
            </li>
            <li>
              <Link to="/create">Create User</Link>
            </li>
            {/* <li>
              <Link to="/token">Token</Link>
            </li> */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/create" element={<UserForm/>} />
          {/* <Route path="/token" element={<Token />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
