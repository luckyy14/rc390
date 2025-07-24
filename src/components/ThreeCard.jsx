import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import skyImg from '../assets/gifs/sky.png';
import mountainImg from '../assets/gifs/mountain.png';

function ParallaxPlane({ image, width, height, mouse, offset = 0 }) {
  const mesh = useRef();
  const [texture, setTexture] = useState();

  useEffect(() => {
    if (!image) return;
    new THREE.TextureLoader().load(image, setTexture);
  }, [image]);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.rotation.x = -mouse.y * 0.35;
    mesh.current.rotation.y = -mouse.x * 0.35;
    // mesh.current.position.y = offset; // handled by Parallax
  });

  return (
    <mesh ref={mesh} position={[0, offset, 0]}>
      <planeGeometry args={[width, height]} />
      {texture && <meshBasicMaterial map={texture} toneMapped={false} transparent />}
    </mesh>
  );
}

export default function ThreeCard({ width = 350, height = 400 }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const y = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      setMouse({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Convert px to world units (arbitrary: 100px = 1 unit)
  const w = width / 100;
  const h = height / 100;

  return (
    <div ref={containerRef} style={{ width, height, margin: '2rem auto', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.18)' }}>
      <ParallaxProvider>
        <Canvas camera={{ position: [0, 0, 7], fov: 40 }} style={{ background: 'transparent', borderRadius: 16 }}>
          {/* Sky background with parallax */}
          <Parallax speed={-10}>
            <ParallaxPlane image={skyImg} width={w} height={h} mouse={mouse} offset={0.1} />
          </Parallax>
          {/* Mountains foreground with parallax */}
          <Parallax speed={-20}>
            <ParallaxPlane image={mountainImg} width={w} height={h} mouse={mouse} offset={-0.1} />
          </Parallax>
        </Canvas>
      </ParallaxProvider>
    </div>
  );
} 