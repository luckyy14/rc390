import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import outline from "../assets/outline.png";
import background from "../assets/gifs/sky.png";
import terrain from "../assets/gifs/mountain.png";
import { BikeCard } from "../ui/FolderCard";
import { Parallax } from 'react-scroll-parallax';
import { useSpring, animated } from '@react-spring/web';
import ParallaxCardsContainer from '../components/ParallaxCardsContainer';

function ParallaxCard({ children, width = 350, height = 400 }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 }); // screen coords
  const [cardCenter, setCardCenter] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update card center on mount and resize
  useEffect(() => {
    const updateCenter = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setCardCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  // Calculate normalized mouse position relative to card center
  const dx = mouse.x - cardCenter.x;
  const dy = mouse.y - cardCenter.y;
  const normX = Math.max(-1, Math.min(1, dx / (width / 2)));
  const normY = Math.max(-1, Math.min(1, dy / (height / 2)));

  // Perspective: compress the edge/corner furthest from the mouse
  const maxPerspective = 0.18; // how much to compress furthest edge/corner
  // For each edge: 1 means closest, (1-maxPerspective) means furthest
  const leftScale = 1 - maxPerspective * Math.max(0, normX);
  const rightScale = 1 - maxPerspective * Math.max(0, -normX);
  const topScale = 1 - maxPerspective * Math.max(0, normY);
  const bottomScale = 1 - maxPerspective * Math.max(0, -normY);
  // For corners, combine both axes (multiply)
  const scaleX = leftScale * rightScale;
  const scaleY = topScale * bottomScale;

  // Skew for extra perspective exaggeration
  const maxSkew = 10;
  const skewY = -normX * maxSkew;
  const skewX = normY * maxSkew;

  // Subtle rotate for 3D feel
  const maxTilt = 10;
  const tiltX = normY * maxTilt;
  const tiltY = normX * maxTilt;

  // Shadow
  const maxShadow = 32;
  const shadowX = normX * maxShadow;
  const shadowY = normY * maxShadow;

  return (
    <div
      ref={cardRef}
      className="parallax-card relative rounded-xl overflow-hidden mb-8 mt-8"
      style={{
        width, height,
        boxShadow: `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 40px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.18)`,
        border: "2px solid rgba(255,255,255,0.18)",
        overflow: "hidden",
        transform:
          `perspective(900px) ` +
          `scaleX(${scaleX}) ` +
          `scaleY(${scaleY}) ` +
          `skewY(${skewY}deg) ` +
          `skewX(${skewX}deg) ` +
          `rotateX(${tiltX}deg) ` +
          `rotateY(${tiltY}deg) `,
        transition: "transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1)"
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [scale, setScale] = useState(1);
  const cardRef = useRef(null);
  const padRef = useRef(null);

  // Mouse move handler (relative to padded area)
  const handleMouseMove = (e) => {
    const rect = padRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const clamped = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    setMouse(clamped);
  };

  // Mouse leave handler (center the effect)
  const handleMouseLeave = () => {
    setMouse({ x: 0.5, y: 0.5 });
  };

  // React Spring for image tilt
  const [{ imgTiltX, imgTiltY }, api] = useSpring(() => ({
    imgTiltX: 0,
    imgTiltY: 0,
    config: { mass: 2, tension: 200, friction: 30 }
  }));

  useEffect(() => {
    // Map mouse position to tilt angles for images (stronger than card tilt)
    api.start({
      imgTiltX: -(mouse.y - 0.5) * 18,
      imgTiltY: (mouse.x - 0.5) * 18
    });
  }, [mouse, api]);

  // Scroll-based scale effect
  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Calculate how much of the card is visible in the viewport
      const visible = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const percentVisible = visible / rect.height;
      // Scale from 1 to 1.3 as the card becomes more visible
      setScale(1 + 0.3 * percentVisible);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)] ">
      <Helmet>
        <title>KTM RC 390 | MidnightTorque</title>
        <meta name="description" content="KTM RC 390 homepage: specs, highlights, 3D viewer, manual, and more." />
        <meta name="keywords" content="KTM RC 390, homepage, specs, motorcycle, superbike, MidnightTorque" />
        <meta property="og:title" content="KTM RC 390 | MidnightTorque" />
        <meta property="og:description" content="KTM RC 390 homepage: specs, highlights, 3D viewer, manual, and more." />
      </Helmet>
      {/* Background image */}
      <img
        src={outline}
        alt="KTM RC390 Outline"
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      {/* Parallax Cards Row */}
      <ParallaxCardsContainer />
      {/* <BikeCard modelUrl="/src/3d/glb/cards.glb" /> */}
    </div>
  );
}
