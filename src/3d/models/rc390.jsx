import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import Rc390Model from "../../components/3d/rc390/Rc390Model";
import BikeController from "../../components/3d/rc390/BikeController";
import ViewerUI from "../../components/3d/rc390/ViewerUI";

/**
 * Internal helper to update camera zoom.
 */
function CameraZoom({ zoom }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  });
  return null;
}

/**
 * Rc390Viewer - Modular interactive viewer for the RC390 model.
 */
export function Rc390Viewer({
  environmentPreset = "warehouse",
  sceneElements,
  children,
  showUI = false,
  showControls = false,
  showCrosshair = false,
  enableRightClick = true,
}) {
  const [scale, setScale] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [scene, setScene] = useState(null);
  const containerRef = useRef(null);
  const crosshairRef = useRef(null);

  // Custom cursor movement logic
  useEffect(() => {
    if (!showCrosshair) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current || !crosshairRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only show if mouse is within bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        crosshairRef.current.style.transform = `translate(${x}px, ${y}px)`;
        crosshairRef.current.style.opacity = '1';
      } else {
        crosshairRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showCrosshair]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[80vh] bg-[var(--color-bg)] relative p-4 md:p-8 overflow-hidden ${showCrosshair ? 'cursor-none' : 'cursor-default'}`}
    >
      {showCrosshair && (
        <div
          ref={crosshairRef}
          className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 pointer-events-none z-[100] transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          {/* Custom Crosshair UI matching hotspots */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-full h-px bg-garage-orange/40"></div>
            <div className="absolute h-full w-px bg-garage-orange/40"></div>
            <div className="w-1.5 h-1.5 bg-white border border-garage-orange"></div>
          </div>
        </div>
      )}

      <ViewerUI
        showUI={showUI}
        showControls={showControls}
        scale={scale} setScale={setScale}
        zoom={zoom} setZoom={setZoom}
      />

      <Canvas shadows camera={{ position: [2, 2, 5], fov: 50, zoom }}>
        <CameraZoom zoom={zoom} />
        <ambientLight intensity={0.5} />

        <rectAreaLight
          position={[0, 5, 0]} width={6} height={6}
          intensity={8} color="#fff" lookAt={[0, 0, 0]}
        />

        <directionalLight
          position={[2, 5, 2]} intensity={1.2}
          castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        />

        <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
          <Rc390Model scale={scale} onSceneReady={(obj) => setScene(obj)} />
          {showControls && <BikeController scene={scene} />}
        </Suspense>

        {sceneElements}
        <OrbitControls enablePan={enableRightClick} enableZoom enableRotate />
        <Environment preset={environmentPreset} />
        {children}
      </Canvas>
    </div>
  );
}

// Keep the old Rc390 export for compatibility if needed elsewhere
export { Rc390Model as Rc390 };
