// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CADViewer from './components/CADViewer';
import FileUpload from './components/FileUpload';
import './styles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [modelUrl, setModelUrl] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleModelUploaded = (url) => {
    setModelUrl(url);
  };

  return (
    <Router>
      <div className="App">
        <Navbar token={token} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/login"
            element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              token ? (
                <div className="viewer-container">
                  <FileUpload token={token} onModelUploaded={handleModelUploaded} />
                  {modelUrl ? (
                    <CADViewer modelUrl={modelUrl} />
                  ) : (
                    <p>Please upload a 3D model to view</p>
                  )}
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;