import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import outline from "../assets/outline.png";
import { BikeCard } from "../ui/FolderCard";

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]">
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
      {/* Camera Slider Demo */}
      <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-4 text-center uppercase tracking-wide">
        Camera Slider Demo
      </h2>
      <BikeCard modelUrl="/assets/cards.glb" />
    </div>
  );
}
