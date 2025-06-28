import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Rc390 } from "../modules/rc390";
import * as THREE from "three";

/**
 * FoamOverlay3D - 3D foam mesh overlay that wipes off on hover.
 * Uses the same geometry as the bike, slightly inflated.
 */
function FoamOverlay3D({ modelUrl = "/assets/ktm.glb" }) {
  const { scene } = useGLTF(modelUrl);
  const [hiddenVertices, setHiddenVertices] = useState(new Set());
  const meshRefs = useRef([]);

  // Inflate geometry slightly for foam overlay
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#fff",
          transparent: true,
          opacity: 0.7,
          roughness: 0.9,
        });
        // Inflate geometry
        child.geometry = child.geometry.clone();
        child.geometry.computeVertexNormals();
        const pos = child.geometry.attributes.position;
        const norm = child.geometry.attributes.normal;
        for (let i = 0; i < pos.count; i++) {
          pos.setX(i, pos.getX(i) + norm.getX(i) * 0.01);
          pos.setY(i, pos.getY(i) + norm.getY(i) * 0.01);
          pos.setZ(i, pos.getZ(i) + norm.getZ(i) * 0.01);
        }
        pos.needsUpdate = true;
      }
    });
  }, [scene]);

  // On pointer move, hide foam at hit face
  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (!e.face || !e.object) return;
    const idx = e.face.a; // Use one vertex per face for simplicity
    setHiddenVertices((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    // Update vertex alpha (simulate wipe)
    const mesh = e.object;
    if (!mesh.geometry.attributes.color) {
      const count = mesh.geometry.attributes.position.count;
      const colors = new Float32Array(count * 4);
      colors.fill(1); // RGBA all white
      mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    }
    const colorAttr = mesh.geometry.attributes.color;
    colorAttr.setW(idx * 4 + 3, 0); // Set alpha to 0
    colorAttr.needsUpdate = true;
    mesh.material.vertexColors = true;
    mesh.material.needsUpdate = true;
  };

  // Render all meshes in scene as foam overlays
  const overlays = [];
  scene.traverse((child) => {
    if (child.isMesh) {
      // Ensure vertex colors (RGBA) are initialized
      const geom = child.geometry;
      if (!geom.attributes.color || geom.attributes.color.itemSize !== 4) {
        const count = geom.attributes.position.count;
        const colors = new Float32Array(count * 4);
        for (let i = 0; i < count; i++) {
          colors[i * 4 + 0] = 1; // R
          colors[i * 4 + 1] = 1; // G
          colors[i * 4 + 2] = 1; // B
          colors[i * 4 + 3] = 0.7; // A (match foam opacity)
        }
        geom.setAttribute("color", new THREE.BufferAttribute(colors, 4));
      }
      overlays.push(
        <mesh
          key={child.uuid}
          geometry={geom}
          position={child.position}
          rotation={child.rotation}
          scale={child.scale}
          material={new THREE.MeshStandardMaterial({
            color: "#fff",
            transparent: true,
            opacity: 1,
            roughness: 0.9,
            vertexColors: true,
          })}
          onPointerMove={handlePointerMove}
          pointerEvents="all"
        />
      );
    }
  });

  return <group>{overlays}</group>;
}

const Garage = () => {
  return (
    <div className="w-full h-[80vh] bg-[var(--color-bg)] relative">
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} />
        <Rc390 scale={2} />
        {/* <FoamOverlay3D /> */}
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      <div className="absolute top-8 left-8 bg-[rgba(26,26,26,0.85)] text-[var(--color-white)] px-6 py-3 rounded-lg shadow-lg font-heading text-xl tracking-widest border border-[var(--color-border)]">
        3D Bike Overview — Wipe the foam!
      </div>
    </div>
  );
};

export default Garage;
