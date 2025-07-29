import React from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import ParallaxCard from './ParallaxCard';
import sky1 from '../assets/gifs/sky.png';
import mountain1 from '../assets/gifs/mountain.png';
import { Rc390, Rc390Viewer } from '../3d/models/rc390';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Custom 3D component with OrbitControls for testing
function Rc390WithControls({ camera }) {
  return (
    <Canvas camera={camera} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={2} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#fff" castShadow />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#fff" />
      <pointLight position={[-5, 5, -5]} intensity={1.5} color="#fff" />
      <directionalLight position={[2, 5, 2]} intensity={1.2} />
      {/* Render the RC390 model directly, not Rc390Viewer */}
      <Rc390 scale={2.7} position={[0, -3, 0]} />
      {/* OrbitControls disabled for parallax card */}
      {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
    </Canvas>
  );
}

const cards = [
  {
    title: '',
    layers: [
      { type: '3d', component: Rc390WithControls, speed: 0, zIndex: -2, centerYOffset: 150, camera: { position: [0, 0, 8], fov: 50 } },
      { src: mountain1, speed: -1, zIndex: -3, centerYOffset: -150 },
      { src: sky1, speed: -3, zIndex: -4, centerYOffset: -150, opacity: 0.3 },
    ],
    zoomOnScroll: true,
  }]
export default function ParallaxCardsContainer() {
  const containerRef = React.useRef(null);

  // Wheel event logic removed; Lenis handles scroll

  return (
    <ParallaxProvider>
      <div
        ref={containerRef}
        className="flex flex-row justify-center items-center gap-8 py-16"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          perspective: '1000px',
          width: '100vw',
          height: '100vh'
        }}
      >
        {cards.map((card, i) => (
          <ParallaxCard
            key={i}
            layers={card.layers}
            title={card.title}
            zoomOnScroll={card.zoomOnScroll}
            width={450}
            height={300}
          />
        ))}
      </div>
    </ParallaxProvider>
  );
}
