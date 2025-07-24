import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export function useGLBControls({ initialCameraZ = 8, initialRotation = [0, 0, 0], initialPosition = [0, 0, 0] } = {}) {
  const [cameraZ, setCameraZ] = useState(initialCameraZ);
  const [rotation, setRotation] = useState(initialRotation); // [x, y, z] in radians
  const [position, setPosition] = useState(initialPosition); // [x, y, z]

  // Handlers for UI controls
  const handleCameraZ = useCallback((z) => setCameraZ(z), []);
  const handleRotation = useCallback((axis, value) => {
    setRotation((prev) => {
      const next = [...prev];
      next[axis] = value;
      return next;
    });
  }, []);
  const handlePosition = useCallback((axis, value) => {
    setPosition((prev) => {
      const next = [...prev];
      next[axis] = value;
      return next;
    });
  }, []);

  // Logging for debugging
  useEffect(() => {
    console.log('Camera Z:', cameraZ);
  }, [cameraZ]);
  useEffect(() => {
    console.log('Model rotation:', rotation);
  }, [rotation]);
  useEffect(() => {
    console.log('Model position:', position);
  }, [position]);

  // Utility to apply rotation/position to a THREE.Object3D
  const applyModelTransforms = useCallback((object3d) => {
    if (!object3d) return;
    object3d.rotation.set(...rotation);
    object3d.position.set(...position);
  }, [rotation, position]);

  return {
    cameraZ,
    setCameraZ: handleCameraZ,
    rotation,
    setRotation: handleRotation,
    position,
    setPosition: handlePosition,
    applyModelTransforms,
  };
} 