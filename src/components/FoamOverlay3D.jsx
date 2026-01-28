import React, { useState, useCallback, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePhysicsWorker } from "../hooks/usePhysicsWorker";

export function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], wipeRadius, hidden, setHidden, ragMode }) {
  const { scene: originalScene } = useGLTF(modelUrl);
  const [scene] = useState(() => originalScene.clone(true));
  const { calculateHiding } = usePhysicsWorker();

  // Overlay all meshes in the scene
  const overlayMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#fff",
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  }), []);

  // Collect all meshes for easier access in pointer handler
  const meshList = useMemo(() => {
    const list = [];
    scene.traverse((child) => {
      if (child.isMesh) list.push(child);
    });
    return list;
  }, [scene]);

  // Handler: delegate to worker
  const handlePointerDown = useCallback(
    async (e) => {
      if (!ragMode) return;

      const pointer = e.point;
      const visibleMeshes = meshList.filter(mesh => !hidden[mesh.uuid]);

      if (visibleMeshes.length === 0) return;

      const toHide = await calculateHiding(visibleMeshes, pointer, wipeRadius);

      if (Object.keys(toHide).length > 0) {
        setHidden((prev) => ({ ...prev, ...toHide }));
      }
    },
    [wipeRadius, setHidden, hidden, meshList, ragMode, calculateHiding]
  );


  const overlays = [];
  meshList.forEach((child) => {
    if (!hidden[child.uuid]) {
      overlays.push(
        <mesh
          key={child.uuid}
          geometry={child.geometry.clone()}
          position={child.position}
          rotation={child.rotation}
          scale={child.scale}
          material={overlayMat}
          {...(ragMode ? { onPointerDown: handlePointerDown } : {})}
          pointerEvents="all"
        />
      );
    }
  });

  return <group position={position} scale={scale}>{overlays}</group>;
}
