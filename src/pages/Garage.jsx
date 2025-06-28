import React, { useRef, useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Rc390 } from "../modules/rc390";
import * as THREE from "three";
import ragIcon from "../assets/rag.svg";
import foamIcon from "../assets/foam.svg";
import wipeIcon from "../assets/wipe.svg";

/**
 * FoamOverlay3D - Covers all meshes, allows shift+hover to wipe foam.
 * Accepts a wipeKey to reset hidden state and a wipeRadius.
 */
function FoamOverlay3D({ modelUrl = "/assets/ktm.glb", scale = 1, position = [0, 0, 0], wipeRadius, hidden, setHidden, ragMode }) {
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
  const [ragMode, setRagMode] = useState(false);
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

  return (
    <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
      <Helmet>
        <title>KTM RC 390 Garage | DarkRide</title>
        <meta name="description" content="Interact with the KTM RC 390 in the virtual garage. Add foam, wipe, and explore the 3D model in detail." />
        <meta name="keywords" content="KTM RC 390, garage, 3D, foam, wipe, motorcycle, superbike, DarkRide" />
        <meta property="og:title" content="KTM RC 390 Garage | DarkRide" />
        <meta property="og:description" content="Interact with the KTM RC 390 in the virtual garage. Add foam, wipe, and explore the 3D model in detail." />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">Garage</h1>
      <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
        <div className="flex-1 flex items-center justify-center min-w-[320px] min-h-[320px] md:min-w-[480px] md:min-h-[480px]" style={{height:'60vh'}}>
          <Canvas camera={{ position: [2, 2, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
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
                ragMode={ragMode}
              />
            ))}
            <OrbitControls enablePan={!ragMode} enableZoom enableRotate={!ragMode} />
          </Canvas>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1 mt-4">
        <button
          className={`button button-tertiary flex items-center gap-1 p-1 text-sm ${ragMode ? 'bg-[var(--color-accent)] text-[var(--color-white)]' : ''}`}
          onClick={() => setRagMode((v) => !v)}
          aria-pressed={ragMode}
          title={ragMode ? 'Wipe Mode: ON' : 'Wipe Mode'}
          style={{ fontSize: '0.9rem' }}
        >
          <img src={ragIcon} alt="Rag icon for wipe mode" className="w-5 h-5" />
          {ragMode ? 'Wipe Mode: ON' : 'Wipe Mode'}
        </button>
        <button
          className="button button-tertiary flex items-center justify-center p-1 text-sm"
          style={{ minWidth: 0, minHeight: 0, width: 28, height: 28, fontSize: '0.9rem' }}
          onClick={handleFoamIt}
          title="Add Foam"
        >
          <img src={foamIcon} alt="Foam icon for add foam" className="w-5 h-5" />
        </button>
        <button
          className="button button-tertiary flex items-center justify-center p-1 text-sm"
          style={{ minWidth: 0, minHeight: 0, width: 28, height: 28, fontSize: '0.9rem' }}
          onClick={handleWipeFoam}
          title="Wipe All Foam"
        >
          <img src={wipeIcon} alt="Wipe icon for wipe foam" className="w-5 h-5" />
        </button>
      </div>
      <div className="p-1 mt-6 bg-[rgba(26,26,26,0.85)] text-[var(--color-white)] px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-lg font-heading text-xl tracking-widest border border-[var(--color-border)] w-fit max-w-full mx-auto">
        3D Bike Overview — Foam & Wipe!<br />
        <span className="text-[var(--color-accent)] text-base">
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
    </div>
  );
};

export default Garage;
