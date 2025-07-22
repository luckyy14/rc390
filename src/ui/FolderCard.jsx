import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLBControls } from '../hooks/useGLBControls';

export function BikeCard({ modelUrl = null, initialZ = 8 }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const {
    cameraZ,
    setCameraZ,
    rotation,
    setRotation,
    position,
    setPosition,
    applyModelTransforms,
  } = useGLBControls({ initialCameraZ: initialZ });

  useEffect(() => {
    if (!modelUrl) return;
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, cameraZ - 11); // Move camera z+10
    camera.rotation.y = Math.PI; // Rotate camera by pi radians around Y
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Load GLB model
    let loadedModel = null;
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        loadedModel = gltf.scene;
        // Center and scale model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 40 / maxDim;
        loadedModel.scale.setScalar(scale);
        scene.add(loadedModel);
        // Apply initial transforms
        applyModelTransforms(loadedModel);
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (loadedModel) {
        applyModelTransforms(loadedModel);
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (camera && renderer && currentMount) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (loadedModel) scene.remove(loadedModel);
    };
  }, [modelUrl, applyModelTransforms]);

  // Update camera position
  React.useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.rotation.y = Math.PI; // Always rotate camera by pi radians
    }
  }, [cameraZ]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '80vh' }}>
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'transparent',
        }}
      />
      {/* Camera Z Slider */}
      <input
        type="range"
        min="2"
        max="30"
        step="0.1"
        value={cameraZ}
        onChange={e => setCameraZ(Number(e.target.value))}
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          width: '60%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 35,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          color: '#fff',
          background: 'rgba(0,0,0,0.5)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        Camera Z: {cameraZ.toFixed(2)}
      </div>
      {/* Rotation Sliders */}
      <div style={{ position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 2, background: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 }}>
        <div style={{ color: '#fff', fontSize: 12, marginBottom: 4 }}>Rotation (radians)</div>
        {["X", "Y", "Z"].map((axis, i) => (
          <div key={axis} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ width: 16 }}>{axis}:</span>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={rotation[i]}
              onChange={e => setRotation(i, Number(e.target.value))}
              style={{ width: 120, marginLeft: 4 }}
            />
            <span style={{ marginLeft: 8, width: 48 }}>{rotation[i].toFixed(2)}</span>
          </div>
        ))}
      </div>
      {/* Position Sliders */}
      <div style={{ position: 'absolute', bottom: 170, left: '50%', transform: 'translateX(-50%)', zIndex: 2, background: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 }}>
        <div style={{ color: '#fff', fontSize: 12, marginBottom: 4 }}>Position</div>
        {["X", "Y", "Z"].map((axis, i) => (
          <div key={axis} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ width: 16 }}>{axis}:</span>
            <input
              type="range"
              min={-10}
              max={10}
              step={0.01}
              value={position[i]}
              onChange={e => setPosition(i, Number(e.target.value))}
              style={{ width: 120, marginLeft: 4 }}
            />
            <span style={{ marginLeft: 8, width: 48 }}>{position[i].toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 