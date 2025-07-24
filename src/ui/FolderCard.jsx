import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLBControls } from '../3d/controls/useGLBControls';
import './BikeCardControls.css';

export function BikeCard({ modelUrl = null, initialZ = 8 }) {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const {
    cameraZ,
    applyModelTransforms,
  } = useGLBControls({ initialCameraZ: initialZ });

  useEffect(() => {
    if (!modelUrl) return;
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene and camera setup
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, cameraZ - 11);
    camera.rotation.y = Math.PI;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1).normalize();
    scene.add(dirLight);

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
        loadedModel.scale.setScalar(40 / maxDim);
        scene.add(loadedModel);
        applyModelTransforms(loadedModel);
      },
      undefined,
      (error) => console.error('Error loading GLB model:', error)
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (loadedModel) applyModelTransforms(loadedModel);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer || !currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      if (loadedModel) scene.remove(loadedModel);
    };
  }, [modelUrl, applyModelTransforms]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraZ - 11;
      cameraRef.current.rotation.y = Math.PI;
    }
  }, [cameraZ]);

  return (
    <div className="bikecard-root">
      <div ref={mountRef} className="bikecard-canvas" />
      {/* Removed CameraSlider, RotationSliders, and PositionSliders controls */}
    </div>
  );
}
