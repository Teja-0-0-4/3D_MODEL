// src/components/FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ token, onModelUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('model', file);

    try {
      const response = await axios.post('http://localhost:5000/api/models/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const modelUrl = `http://localhost:5000${response.data.path}`;
      onModelUploaded(modelUrl);
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert('Upload failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".obj,.stl,.gltf,.glb"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload Model'}
      </button>
    </div>
  );
}

export default FileUpload;