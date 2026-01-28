import React, { useState, useCallback, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePhysicsWorker } from "../hooks/usePhysicsWorker";

export function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], wipeRadius, ragMode, thickness = 0.05, noiseScale = 5.0, onClean }) {
  const { scene: originalScene } = useGLTF(modelUrl);
  const [scene] = useState(() => originalScene.clone(true));
  const { calculateHiding } = usePhysicsWorker();
  const [localHidden, setLocalHidden] = useState({}); // { meshName: Set(indices) }

  // Track total vertices and hidden vertices to detect "clean" state
  const totalVertices = useMemo(() => {
    let count = 0;
    scene.traverse((child) => {
      if (child.isMesh) count += child.geometry.attributes.position.count;
    });
    return count;
  }, [scene]);

  const hiddenCount = useMemo(() => {
    return Object.values(localHidden).reduce((sum, set) => sum + set.size, 0);
  }, [localHidden]);

  React.useEffect(() => {
    if (totalVertices > 0 && (hiddenCount / totalVertices) > 0.85) {
      onClean?.();
    }
  }, [hiddenCount, totalVertices, onClean]);

  // Overlay all meshes in the scene
  const overlayMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  // Collect all meshes and initialize visibility attributes
  const meshList = useMemo(() => {
    const list = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        // Clone material for this foam layer
        const mat = overlayMat.clone();

        // Custom uniforms for shader
        mat.userData.uThickness = { value: thickness };
        mat.userData.uNoiseScale = { value: noiseScale };

        // Modify shader to support vertex visibility, thickness, and noise
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uThickness = mat.userData.uThickness;
          shader.uniforms.uNoiseScale = mat.userData.uNoiseScale;

          shader.vertexShader = `
            attribute float vVisible;
            varying float vVis;
            uniform float uThickness;
            uniform float uNoiseScale;

            // Simple noise function
            float hash(float n) { return fract(sin(n) * 43758.5453123); }
            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f*f*(3.0-2.0*f);
                float n = p.x + p.y*57.0 + 113.0*p.z;
                return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                               mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                           mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                               mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
            }

            ${shader.vertexShader}
          `.replace(
            '#include <begin_vertex>',
            `
             #include <begin_vertex>
             vVis = vVisible;

             // Displace vertex along normal with noise
             float n = noise(position * uNoiseScale);
             transformed += normal * uThickness * (0.5 + 0.5 * n);
            `
          );

          shader.fragmentShader = `
            varying float vVis;
            ${shader.fragmentShader}
          `.replace(
            '#include <dithering_fragment>',
            `
             #include <dithering_fragment>
             if (vVis < 0.5) discard;
             // Simple opacity for testing
             gl_FragColor.a *= 0.9;
            `
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
