import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Rc390 } from "../modules/rc390";
import * as THREE from "three";

/**
 * FoamOverlay3D - Covers all meshes, allows shift+hover to wipe foam.
 */
function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], resetKey }) {
  const { scene: originalScene } = useGLTF(modelUrl);
  const [scene] = useState(() => originalScene.clone(true));
  const [hidden, setHidden] = useState({}); // {uuid: true}

  // Reset hidden state when resetKey changes
  useEffect(() => {
    setHidden({});
  }, [resetKey]);

  // Handler to hide mesh on shift+hover
  const handlePointerMove = useCallback(
    (e, uuid) => {
      if (e.shiftKey) {
        setHidden((prev) => ({ ...prev, [uuid]: true }));
      }
    },
    []
  );

  // Overlay all meshes in the scene
  const overlayMat = new THREE.MeshBasicMaterial({
    color: "#fff",
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  const overlays = [];
  scene.traverse((child) => {
    if (child.isMesh && !hidden[child.uuid]) {
      overlays.push(
        <mesh
          key={child.uuid}
          geometry={child.geometry.clone()}
          position={child.position}
          rotation={child.rotation}
          scale={child.scale}
          material={overlayMat}
          onPointerMove={(e) => handlePointerMove(e, child.uuid)}
          pointerEvents="all"
        />
      );
    }
  });

  return <group position={position} scale={scale}>{overlays}</group>;
}

const Garage = () => {
  const [showFoam, setShowFoam] = useState(false);
  const [foamReset, setFoamReset] = useState(0);

  const handleFoamIt = () => {
    setShowFoam(true);
    setFoamReset(r => r + 1);
  };

  return (
    <div className="w-full h-[80vh] bg-[var(--color-bg)] relative">
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} />
        <Rc390 scale={2} position={[0, -0.6, 0]} />
        {showFoam && <FoamOverlay3D scale={2} position={[0, -0.6, 0]} resetKey={foamReset} />}
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      <div className="absolute top-8 left-8 bg-[rgba(26,26,26,0.85)] text-[var(--color-white)] px-6 py-3 rounded-lg shadow-lg font-heading text-xl tracking-widest border border-[var(--color-border)]">
        3D Bike Overview — Foam & Wipe!<br />
        <span className="text-[var(--color-accent)] text-base">Tip: Hold Shift and hover to wipe foam interactively.</span>
      </div>
      <div className="absolute top-8 right-8 flex gap-4">
        <button
          className="bg-[var(--color-accent)] text-[var(--color-white)] px-6 py-2 rounded-lg font-heading text-lg shadow hover:bg-[var(--color-accent-hover)] transition"
          onClick={handleFoamIt}
        >
          Foam It!
        </button>
        <button
          className="bg-[var(--color-border)] text-[var(--color-white)] px-6 py-2 rounded-lg font-heading text-lg shadow hover:bg-[var(--color-muted)] transition"
          onClick={() => setShowFoam(false)}
        >
          Wipe Foam
        </button>
      </div>
    </div>
  );
};

export default Garage;
