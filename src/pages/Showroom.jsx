import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";

function BikeModel() {
  const { scene } = useGLTF("/assets/ktm.glb");
  return <primitive object={scene} position={[0, 0, 0]} />;
}

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#e5e7eb" />
    </mesh>
  );
}

const Showroom = () => (
  <div className="w-full h-[80vh] bg-[var(--color-bg)]">
    <Canvas shadows camera={{ position: [2, 2, 5], fov: 50 }}>
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
        <BikeModel />
      </Suspense>
      <Floor />
      <OrbitControls enablePan enableZoom enableRotate />
      <Environment preset="warehouse" />
    </Canvas>
  </div>
);

export default Showroom;
