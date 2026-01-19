import React from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import ParallaxCard from './ParallaxCard';
import sky1 from '../assets/gifs/sky.png';
import mountain1 from '../assets/gifs/mountain.png';
import { Rc390, Rc390Viewer } from '../3d/models/rc390';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Custom 3D component with OrbitControls for testing
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Rc390WithControls({ camera, rotX = 0, rotY = 0 }) {
  // This function returns r3f primitives to be rendered inside a parent <Canvas>
  return (
    <TiltedGroup rotX={rotX} rotY={rotY} />
  );
}

// Must be defined outside Rc390WithControls to avoid hooks error
function TiltedGroup({ rotX = 0, rotY = 0 }) {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = rotX;
      groupRef.current.rotation.y = rotY;
    }
  });
  return (
    <group ref={groupRef}>
      <ambientLight intensity={2} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#fff" castShadow />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#fff" />
      <pointLight position={[-5, 5, -5]} intensity={1.5} color="#fff" />
      <directionalLight position={[2, 5, 2]} intensity={1.2} />
      <Rc390 scale={2.7} position={[0, -3, 0]} />
    </group>
  );
}

// Custom filters for "warm and petrol" look
// Sky: Warm orange/gold shift
// Mountain: Darker, cooler petrol/asphalt shift with contrast
const cards = [
  {
    title: '',
    layers: [
      { type: '3d', component: Rc390WithControls, speed: 0, zIndex: -2, centerYOffset: 150, a: { position: [0, 0, 8], fov: 50 } },
      { 
        src: mountain1, 
        speed: -1, 
        zIndex: -3, 
        centerYOffset: -100,
        filter: 'sepia(0.5) hue-rotate(180deg) brightness(0.6) contrast(1.4)' // Petrol/Dark Asphalt look
      },
      { 
        src: sky1, 
        speed: -3, 
        zIndex: -4, 
        centerYOffset: -150, 
        opacity: 0.6,
        filter: 'sepia(1) hue-rotate(-30deg) saturate(2) brightness(0.8)' // Warm Golden/Petrol sky
      },
    ],
    zoomOnScroll: false, // Disable default full-screen zoom since it's an embedded component now
  }]

export default function ParallaxCardsContainer({ className, style }) {
  const containerRef = React.useRef(null);

  // Wheel event logic removed; Lenis handles scroll

  return (
    <ParallaxProvider>
      <div
        ref={containerRef}
        className={`flex flex-row justify-center items-center gap-8 ${className || ''}`}
        style={{
          position: 'relative', // Changed from fixed
          width: '100%',        // Changed from 100vw
          height: '100%',
          perspective: '1000px',
          pointerEvents: 'auto',
          cursor: 'default',
          ...style
        }}
      >
        {cards.map((card, i) => (
          <ParallaxCard
            key={i}
            layers={card.layers}
            title={card.title}
            zoomOnScroll={card.zoomOnScroll}
            width={450}  // Base width, but CSS will control container
            height={300} // Base height
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    </ParallaxProvider>
  );
}
