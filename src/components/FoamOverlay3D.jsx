import React, { useState, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], wipeRadius, hidden, setHidden, ragMode }) {
  const { scene: originalScene } = useGLTF(modelUrl);
  const [scene] = useState(() => originalScene.clone(true));

  // Overlay all meshes in the scene
  const overlayMat = new THREE.MeshBasicMaterial({
    color: "#fff",
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  // Collect all meshes for easier access in pointer handler
  const meshList = [];
  scene.traverse((child) => {
    if (child.isMesh) meshList.push(child);
  });

  // Handler: hide all meshes if any vertex is within radius of pointer (rag mode)
  const handlePointerDown = useCallback(
    (e) => {
      if (!ragMode) return;
      const pointer = e.point;
      const toHide = {};
      meshList.forEach((mesh) => {
        if (hidden[mesh.uuid]) return;
        const pos = mesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vertex = new THREE.Vector3(
            pos.getX(i),
            pos.getY(i),
            pos.getZ(i)
          );
          mesh.localToWorld(vertex);
          if (pointer.distanceTo(vertex) < wipeRadius) {
            toHide[mesh.uuid] = true;
            break;
          }
        }
      });
      if (Object.keys(toHide).length > 0) setHidden((prev) => ({ ...prev, ...toHide }));
    },
    [wipeRadius, setHidden, hidden, meshList, ragMode]
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
