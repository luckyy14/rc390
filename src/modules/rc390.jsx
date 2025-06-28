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
export function Rc390({ scale = 1, position = [0, -0.6, 0] }) {
  const { scene } = useGLTF("/assets/ktm.glb");
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
      <div style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        background: "rgba(255,255,255,0.85)",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <div>
          <label>
            Scale: 
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.01"
              value={scale}
              onChange={e => setScale(Number(e.target.value))}
              style={{ width: 120, marginLeft: 8 }}
            />
            <span style={{ marginLeft: 8 }}>{scale.toFixed(2)}</span>
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>
            Zoom: 
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.01"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              style={{ width: 120, marginLeft: 8 }}
            />
            <span style={{ marginLeft: 8 }}>{zoom.toFixed(2)}</span>
          </label>
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
