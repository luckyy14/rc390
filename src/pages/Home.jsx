import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import outline from "../assets/outline.png";
import background from "../assets/gifs/sky.png";
import terrain from "../assets/gifs/mountain.png";
import { BikeCard } from "../ui/FolderCard";
import { Parallax } from 'react-scroll-parallax';

export default function Home() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  // Mouse move handler
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouse({ x, y });
  };

  // Mouse leave handler (center the effect)
  const handleMouseLeave = () => {
    setMouse({ x: 0.5, y: 0.5 });
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]">
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
      {/* Mountains & Sky Card */}
      <div
        ref={cardRef}
        className="relative w-[350px] h-[400px] rounded-xl overflow-hidden shadow-lg mb-8 mt-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "800px" }}
      >
        {/* Sky background with parallax */}
        <Parallax speed={-10} className="absolute inset-0 w-full h-full z-0">
          <img
            src={background}
            alt="Sky"
            className="w-full h-full object-cover"
            style={{
              transform: `translate3d(${(mouse.x - 0.5) * 30}px, ${(mouse.y - 0.5) * 20}px, 0)`
            }}
          />
        </Parallax>
        {/* Mountains foreground with parallax */}
        <Parallax speed={-20} className="absolute bottom-0 left-0 w-full z-10">
          <img
            src={terrain}
            alt="Mountains"
            className="w-full h-auto object-cover"
            style={{
              maxHeight: "70%",
              transform: `translate3d(${(mouse.x - 0.5) * 60}px, ${(mouse.y - 0.5) * 40}px, 0)`
            }}
          />
        </Parallax>
      </div>
      {/* <BikeCard modelUrl="/src/3d/glb/cards.glb" /> */}
    </div>
  );
}
