import React, { useState, useCallback, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePhysicsWorker } from "../hooks/usePhysicsWorker";

export function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], wipeRadius, ragMode }) {
  const { scene: originalScene } = useGLTF(modelUrl);
  const [scene] = useState(() => originalScene.clone(true));
  const { calculateHiding } = usePhysicsWorker();
  const [localHidden, setLocalHidden] = useState({}); // { meshName: Set(indices) }

  // Overlay all meshes in the scene
  const overlayMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#fff",
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  }), []);

  // Collect all meshes and initialize visibility attributes
  const meshList = useMemo(() => {
    const list = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        // Clone material for this foam layer
        const mat = overlayMat.clone();
        // Modify shader to support vertex visibility
        mat.onBeforeCompile = (shader) => {
          shader.vertexShader = `
            attribute float vVisible;
            varying float vVis;
            ${shader.vertexShader}
          `.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
             vVis = vVisible;`
          );
          shader.fragmentShader = `
            varying float vVis;
            ${shader.fragmentShader}
          `.replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
             if (vVis < 0.5) discard;`
          );
        };
        child.material = mat;

        // Initialize visibility attribute if not present
        if (!child.geometry.attributes.vVisible) {
          const vVisible = new Float32Array(child.geometry.attributes.position.count).fill(1.0);
          child.geometry.setAttribute('vVisible', new THREE.BufferAttribute(vVisible, 1));
        }
        list.push(child);
      }
    });
    return list;
  }, [scene, overlayMat]);

  // Sync vertex visibility with local hidden state
  React.useEffect(() => {
    meshList.forEach((mesh) => {
      const hiddenIndices = localHidden[mesh.name];
      if (hiddenIndices && mesh.geometry.attributes.vVisible) {
        const attr = mesh.geometry.attributes.vVisible;
        hiddenIndices.forEach((idx) => {
          attr.setX(idx, 0.0);
        });
        attr.needsUpdate = true;
      }
    });
  }, [localHidden, meshList]);

  // Handler: delegate to worker and stop propagation
  const handleWipe = useCallback(
    async (e) => {
      if (!ragMode) return;
      e.stopPropagation(); // Stop from reaching lower layers or OrbitControls

      const pointer = e.point;
      const toHide = await calculateHiding(meshList, pointer, wipeRadius);

      if (Object.keys(toHide).length > 0) {
        setLocalHidden((prev) => {
          const next = { ...prev };
          Object.keys(toHide).forEach(name => {
            const newIndices = toHide[name]; // This is an array of indices from calculateHiding
            const existingSet = prev[name] || new Set(); // Get existing Set or create new one
            const combinedSet = new Set([...existingSet, ...newIndices]); // Merge
            next[name] = combinedSet; // Store the Set
          });
          return next;
        });
      }
    },
    [wipeRadius, meshList, ragMode, calculateHiding]
  );

  const [isWiping, setIsWiping] = useState(false);

  return (
    <primitive
      object={scene}
      position={position}
      scale={[scale, scale, scale]}
      onPointerDown={(e) => {
        if (ragMode) {
          e.stopPropagation();
          setIsWiping(true);
          handleWipe(e);
        }
      }}
      onPointerUp={(e) => {
        if (ragMode) {
          e.stopPropagation();
          setIsWiping(false);
        }
      }}
      onPointerMove={(e) => {
        if (ragMode) {
          e.stopPropagation();
          if (isWiping) {
            handleWipe(e);
          }
        }
      }}
    />
  );
}
