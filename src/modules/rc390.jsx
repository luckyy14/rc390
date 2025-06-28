import React, { Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";

/**
 * Rc390 - Reusable KTM RC390 3D model component.
 * @param {Object} props
 * @param {number} [props.scale=1] - Uniform scale for the model.
 * @param {Array} [props.position=[0, -0.6, 0]] - Position of the model.
 * @returns JSX.Element
 */
import { useEffect } from "react";
import * as THREE from "three";

export function Rc390({ scale = 1, position = [0, -0.6, 0], foamMap }) {
  const { scene } = useGLTF("/assets/ktm.glb");

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          if (foamMap) {
            child.material.transparent = true;
            child.material.alphaMap = foamMap;
            child.material.alphaTest = 0.1;
          } else {
            child.material.transparent = false;
            child.material.alphaMap = null;
            child.material.alphaTest = 0;
          }
          child.material.needsUpdate = true;
        }
      });
    }
  }, [foamMap, scene]);

  return <primitive object={scene} position={position} scale={[scale, scale, scale]} />;
}

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#e5e7eb" />
    </mesh>
  );
}

function CameraZoom({ zoom }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  });
  return null;
}

/**
 * Rc390Viewer - Full interactive viewer for the RC390 model.
 * Includes scale and zoom sliders, camera controls, and lighting.
 */
export function Rc390Viewer({
  environmentPreset = "warehouse",
  sceneElements,
  children,
}) {
  const [scale, setScale] = useState(2);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="w-full h-[80vh] bg-[var(--color-bg)] relative">
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
          background: "rgba(26,26,26,0.85)",
          padding: "20px 28px",
          borderRadius: "16px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          border: "1.5px solid #333",
          fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
          color: "#E0E0E0",
          minWidth: 260,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          {/* Scale icon */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <rect x="2" y="8" width="16" height="4" rx="2" fill="#FF6F00"/>
            <rect x="7" y="6" width="6" height="8" rx="2" fill="#1A1A1A"/>
          </svg>
          <label className="font-bold tracking-wide" style={{ minWidth: 60 }}>
            Scale
          </label>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.01"
            value={scale}
            onChange={e => setScale(Number(e.target.value))}
            style={{
              width: 120,
              marginLeft: 8,
              accentColor: "#FF6F00",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #FF6F00 60%, #FF8C1A 100%)",
              boxShadow: "0 0 6px #FF6F0088",
              outline: "none",
              border: "1px solid #333",
              height: 4,
            }}
            className="focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <span style={{ marginLeft: 12, fontFamily: "Rajdhani, Inter, sans-serif", fontWeight: 700 }}>
            {scale.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Zoom icon */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="#FF6F00" strokeWidth="2" fill="#1A1A1A"/>
            <rect x="9" y="4" width="2" height="12" rx="1" fill="#FF6F00"/>
            <rect x="4" y="9" width="12" height="2" rx="1" fill="#FF6F00"/>
          </svg>
          <label className="font-bold tracking-wide" style={{ minWidth: 60 }}>
            Zoom
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.01"
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{
              width: 120,
              marginLeft: 8,
              accentColor: "#FF6F00",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #FF6F00 60%, #FF8C1A 100%)",
              boxShadow: "0 0 6px #FF6F0088",
              outline: "none",
              border: "1px solid #333",
              height: 4,
            }}
            className="focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <span style={{ marginLeft: 12, fontFamily: "Rajdhani, Inter, sans-serif", fontWeight: 700 }}>
            {zoom.toFixed(2)}
          </span>
        </div>
      </div>
      <Canvas shadows camera={{ position: [2, 2, 5], fov: 50, zoom }}>
        <CameraZoom zoom={zoom} />
        <ambientLight intensity={0.5} />
        {/* Ceiling lights */}
        <rectAreaLight
          position={[0, 5, 0]}
          width={6}
          height={6}
          intensity={8}
          color="#fff"
          lookAt={[0, 0, 0]}
          castShadow
        />
        <directionalLight
          position={[2, 5, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
          <Rc390 scale={scale} />
        </Suspense>
        {sceneElements}
        <OrbitControls enablePan enableZoom enableRotate />
        <Environment preset={environmentPreset} />
        {children}
      </Canvas>
    </div>
  );
}
