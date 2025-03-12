// src/components/CADViewer.jsx
import React, { Suspense, useRef, useState, useEffect, useFrame } from 'react'; // Added useFrame
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

// Convert degrees to radians for Three.js
const degToRad = (degrees) => degrees * (Math.PI / 180);

function Model({ url, scale, position, rotation }) {
  const fileExtension = url.split('.').pop().toLowerCase();
  const meshRef = useRef();

  let object;
  if (fileExtension === 'stl') {
    const geometry = useLoader(STLLoader, url);
    geometry.computeVertexNormals();
    geometry.center();
    geometry.rotateX(Math.PI / 2); // Rotate to horizontal
    return (
      <mesh ref={meshRef} scale={scale} position={position} rotation={rotation.map(degToRad)} castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          color="#7d7d7d" // Blender-like gray
          metalness={0.1} // Slight metallic sheen
          roughness={0.3} // Reduced for more highlights
          side={THREE.DoubleSide}
          envMapIntensity={2} // Stronger reflections for depth
        />
      </mesh>
    );
  } else if (fileExtension === 'obj') {
    object = useLoader(OBJLoader, url);
    object.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals();
        child.geometry.center();
        child.geometry.rotateX(Math.PI / 2); // Rotate to horizontal
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: '#7d7d7d',
          metalness: 0.1,
          roughness: 0.3,
          envMapIntensity: 2,
        });
      }
    });
  } else if (fileExtension === 'gltf' || fileExtension === 'glb') {
    object = useLoader(THREE.GLTFLoader, url).scene;
    object.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals();
        child.geometry.center();
        child.geometry.rotateX(Math.PI / 2); // Rotate to horizontal
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: '#7d7d7d',
          metalness: 0.1,
          roughness: 0.3,
          envMapIntensity: 2,
        });
      }
    });
  }

  return object ? (
    <primitive
      ref={meshRef}
      object={object}
      scale={scale}
      position={position}
      rotation={rotation.map(degToRad)} // Convert degrees to radians
      castShadow
      receiveShadow
    />
  ) : null;
}

function CADViewer({ modelUrl, onSave }) {
  const [scale, setScale] = useState([1, 1, 1]);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const meshRef = useRef();

  // Sync transformations with the model in real-time
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(scale[0], scale[1], scale[2]);
      meshRef.current.position.set(position[0], position[1], position[2]);
      meshRef.current.rotation.set(degToRad(rotation[0]), degToRad(rotation[1]), degToRad(rotation[2]));
    }
  });

  const handleSave = () => {
    onSave({ scale, position, rotation });
  };

  const handleInputChange = (setter, index, value) => {
    const newValue = value === '' ? 0 : parseFloat(value) || 0; // Default to 0 for empty or invalid input
    const newArray = [...(setter === setScale ? scale : setter === setPosition ? position : rotation)];
    newArray[index] = newValue;
    setter(newArray);
  };

  return (
    <div className="cad-viewer">
      {modelUrl ? (
        <>
          <div className="controls">
            <h3>Edit Model</h3>
            <div>
              <label>
                Scale X:
                <input
                  type="number"
                  value={scale[0]}
                  step="0.1"
                  onChange={(e) => handleInputChange(setScale, 0, e.target.value)}
                />
              </label>
              <label>
                Scale Y:
                <input
                  type="number"
                  value={scale[1]}
                  step="0.1"
                  onChange={(e) => handleInputChange(setScale, 1, e.target.value)}
                />
              </label>
              <label>
                Scale Z:
                <input
                  type="number"
                  value={scale[2]}
                  step="0.1"
                  onChange={(e) => handleInputChange(setScale, 2, e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Position X:
                <input
                  type="number"
                  value={position[0]}
                  step="0.1"
                  onChange={(e) => handleInputChange(setPosition, 0, e.target.value)}
                />
              </label>
              <label>
                Position Y:
                <input
                  type="number"
                  value={position[1]}
                  step="0.1"
                  onChange={(e) => handleInputChange(setPosition, 1, e.target.value)}
                />
              </label>
              <label>
                Position Z:
                <input
                  type="number"
                  value={position[2]}
                  step="0.1"
                  onChange={(e) => handleInputChange(setPosition, 2, e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Rotation X (degrees):
                <input
                  type="number"
                  value={rotation[0]}
                  step="1"
                  onChange={(e) => handleInputChange(setRotation, 0, e.target.value)}
                />
              </label>
              <label>
                Rotation Y (degrees):
                <input
                  type="number"
                  value={rotation[1]}
                  step="1"
                  onChange={(e) => handleInputChange(setRotation, 1, e.target.value)}
                />
              </label>
              <label>
                Rotation Z (degrees):
                <input
                  type="number"
                  value={rotation[2]}
                  step="1"
                  onChange={(e) => handleInputChange(setRotation, 2, e.target.value)}
                />
              </label>
            </div>
            <button onClick={handleSave}>Save Model</button>
          </div>
          <Canvas
            camera={{ position: [5, 5, 10], fov: 60, near: 0.1, far: 1000 }}
            shadows
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <color attach="background" args={['#3a3a3a']} />
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[15, 20, 15]}
              intensity={3}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.1}
              shadow-camera-far={100}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, 5, -10]} intensity={1.5} castShadow />
            <hemisphereLight skyColor="#ffffff" groundColor="#666666" intensity={0.8} />
            <Environment preset="studio" />
            <Suspense fallback={null}>
              <Model
                ref={meshRef} // Added ref to Model for dynamic updates
                url={modelUrl}
                scale={scale}
                position={position}
                rotation={rotation.map(degToRad)}
              />
            </Suspense>
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              target={[0, 0, 0]}
              rotateSpeed={1.0}
              panSpeed={1.0}
              zoomSpeed={0.5}
              minDistance={1}
              maxDistance={20}
              enableDamping={true}
              dampingFactor={0.05}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN,
              }}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN,
              }}
            />
            <gridHelper args={[10, 10]} />
            <axesHelper args={[5]} />
          </Canvas>
        </>
      ) : (
        <p>No model uploaded yet.</p>
      )}
    </div>
  );
}

export default CADViewer;