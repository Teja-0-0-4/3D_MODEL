// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ token, onLogout }) {
  return (
    <nav className="navbar">
      <h1>CAD Viewer</h1>
      {token ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;