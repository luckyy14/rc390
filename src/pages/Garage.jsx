import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Rc390 } from "../modules/rc390";
import * as THREE from "three";

/**
 * FoamOverlay3D - Covers all meshes, allows shift+hover to wipe foam.
 * Accepts a wipeKey to reset hidden state and a wipeRadius.
 */
function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], wipeRadius, hidden, setHidden }) {
  const { scene: originalScene } = useGLTF(modelUrl);
  const [scene] = useState(() => originalScene.clone(true));

  // Handler to hide mesh on shift+hover (smaller area = must be closer to mesh center)
  const handlePointerMove = useCallback(
    (e, uuid) => {
      if (e.shiftKey) {
        // Only wipe if pointer is near mesh center (simulate radius)
        const pointer = e.point;
        const mesh = e.object;
        const meshCenter = new THREE.Vector3();
        mesh.geometry.computeBoundingBox();
        mesh.geometry.boundingBox.getCenter(meshCenter);
        const dist = pointer.distanceTo(mesh.localToWorld(meshCenter));
        if (dist < wipeRadius) {
          setHidden((prev) => ({ ...prev, [uuid]: true }));
        }
      }
    },
    [wipeRadius, setHidden]
  );

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

  // Handler: hide all meshes if any vertex is within radius of pointer
  const handlePointerMoveAll = useCallback(
    (e) => {
      if (e.shiftKey) {
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
      }
    },
    [wipeRadius, setHidden, hidden, meshList]
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
          onPointerMove={handlePointerMoveAll}
          pointerEvents="all"
        />
      );
    }
  });

  return <group position={position} scale={scale}>{overlays}</group>;
}

/**
 * WaterSprayCursor - Shows a water spray SVG at the mouse position when shift is held.
 */
function WaterSprayCursor({ show, radius }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!show) return;
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [show]);

  if (!show) return null;
  return (
    <div style={{
      position: "fixed",
      left: pos.x - radius,
      top: pos.y - radius,
      pointerEvents: "none",
      zIndex: 9999,
      width: radius * 2,
      height: radius * 2,
    }}>
      {/* Water spray SVG */}
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <ellipse
          cx={radius}
          cy={radius}
          rx={radius * 0.7}
          ry={radius * 0.3}
          fill="#6EC6FF"
          opacity="0.5"
        />
        <ellipse
          cx={radius}
          cy={radius * 1.2}
          rx={radius * 0.3}
          ry={radius * 0.12}
          fill="#B3E5FC"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

const Garage = () => {
  const [foamLayers, setFoamLayers] = useState([]);
  const [wipeRadius, setWipeRadius] = useState(0.25);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [hidden, setHidden] = useState({}); // shared across all overlays

  const handleFoamIt = () => {
    setFoamLayers((layers) => [
      ...layers,
      { key: Date.now(), scale: 2 + layers.length * 0.01 }
    ]);
  };

  const handleWipeFoam = () => {
    setFoamLayers([]);
    setHidden({});
  };

  useEffect(() => {
    const handleDown = (e) => { if (e.key === "Shift") setShiftHeld(true); };
    const handleUp = (e) => { if (e.key === "Shift") setShiftHeld(false); };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return (
    <div className="flex flex-row flex-wrap mweb-flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-2 md:p-8">
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} />
        <Rc390 scale={2} position={[0, -0.6, 0]} />
        {foamLayers.map((layer, i) => (
          <FoamOverlay3D
            key={layer.key}
            scale={layer.scale}
            position={[0, -0.6, 0]}
            wipeRadius={wipeRadius}
            hidden={hidden}
            setHidden={setHidden}
          />
        ))}
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      <WaterSprayCursor show={shiftHeld && foamLayers.length > 0} radius={wipeRadius * 120} />
      <div className="absolute top-8 left-8 bg-[rgba(26,26,26,0.85)] text-[var(--color-white)] px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-lg font-heading text-xl tracking-widest border border-[var(--color-border)]">
        3D Bike Overview — Foam & Wipe!<br />
        <span className="text-[var(--color-accent)] text-base">
          Tip: Hold Shift and hover to wipe foam interactively.<br />
          Each "Foam It!" adds a new layer.<br />
          Wipe radius: <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.01"
            value={wipeRadius}
            onChange={e => setWipeRadius(Number(e.target.value))}
            style={{ width: 100, verticalAlign: "middle" }}
          /> {wipeRadius.toFixed(2)}
        </span>
      </div>
      <div className=" top-8 right-8 flex gap-4">
        <button
          className="button button-primary"
          onClick={handleFoamIt}
        >
          Foam It!
        </button>
        <button
          className="button button-secondary"
          onClick={handleWipeFoam}
        >
          Wipe Foam
        </button>
      </div>
    </div>
  );
};

export default Garage;
