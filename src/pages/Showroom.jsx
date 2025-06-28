import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

function BikeModel({ onCenter }) {
  const { scene } = useGLTF("/assets/ktm.glb");
  useEffect(() => {
    if (scene && onCenter) {
      scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      onCenter(center);
    }
  }, [scene, onCenter]);
  return <primitive object={scene} position={[0, 0, 0]} />;
}

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
}

function Walls() {
  return (
    <>
      <mesh position={[0, 3, -5]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[5, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </>
  );
}

function SpotlightsWithBulbs() {
  // Three spotlights with visible "bulbs" on the ceiling
  const lights = [
    { pos: [-2, 5.8, 2] },
    { pos: [0, 5.8, 0] },
    { pos: [2, 5.8, -2] },
  ];
  return (
    <>
      {lights.map((light, i) => (
        <group key={i}>
          <spotLight
            position={light.pos}
            angle={0.5}
            intensity={3}
            penumbra={0.5}
            castShadow
            color="#fff"
          />
          <mesh position={light.pos}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial emissive="#fff" emissiveIntensity={2} color="#fff" />
          </mesh>
        </group>
      ))}
    </>
  );
}

function CenteredOrbitControls({ target }) {
  const controls = useRef();
  const { camera } = useThree();
  useEffect(() => {
    if (controls.current && target) {
      controls.current.target.set(target.x, target.y, target.z);
      controls.current.update();
      camera.lookAt(target.x, target.y, target.z);
    }
  }, [target, camera]);
  return <OrbitControls ref={controls} enablePan enableZoom enableRotate />;
}

const Showroom = () => {
  const [center, setCenter] = React.useState(null);

  return (
    <div className="w-full h-[80vh] bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 2, 7], fov: 50 }}
        style={{ background: "#000" }}
      >
        <ambientLight intensity={0.2} />
        <Walls />
        <SpotlightsWithBulbs />
        <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
          <BikeModel onCenter={setCenter} />
        </Suspense>
        <Floor />
        <CenteredOrbitControls target={center} />
      </Canvas>
    </div>
  );
};

export default Showroom;
