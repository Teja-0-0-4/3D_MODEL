// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Welcome to 3D Model Viewer</h1>
      <p>Please sign in or sign up to start viewing 3D models.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/signin">
          <button style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Sign In
          </button>
        </Link>
        <Link to="/signup">
          <button style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;