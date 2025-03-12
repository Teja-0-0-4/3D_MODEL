// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import CADViewer from './CADViewer';

function Dashboard({ token, onLogout }) {
  const [modelUrl, setModelUrl] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  };

  const handleSave = (transformations) => {
    console.log('Received transformations in Dashboard:', transformations);
    // Example: Save to localStorage (replace with backend API call if needed)
    localStorage.setItem('modelTransformations', JSON.stringify(transformations));
    alert('Transformations saved to localStorage!');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <nav style={{ backgroundColor: '#333', padding: '10px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <h3>3D Model Viewer Dashboard</h3>
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Log Out
        </button>
      </nav>
      <div style={{ marginTop: '20px' }}>
        <input type="file" onChange={handleFileUpload} accept=".stl,.obj,.gltf" />
        {modelUrl ? (
          <ErrorBoundary>
            <CADViewer modelUrl={modelUrl} onSave={handleSave} />
          </ErrorBoundary>
        ) : (
          <p>Please upload a 3D model to view.</p>
        )}
      </div>
      <footer style={{ backgroundColor: '#333', color: 'white', textAlign: 'center', padding: '10px', position: 'fixed', bottom: '0', width: '100%' }}>
        <p>© 2025 3D Model Viewer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;