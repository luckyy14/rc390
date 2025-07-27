import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import outline from "../assets/outline.png";
import { useSpring } from '@react-spring/web';
import ParallaxCardsContainer from '../components/ParallaxCardsContainer';
import { Rc390Viewer } from "../3d/models/rc390";


export default function Home() {
  const [mouse] = useState({ x: 0.5, y: 0.5 });

  // React Spring for image tilt
  const [, api] = useSpring(() => ({
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
      {/* RC390 3D Model - Top Layer */}
      {/* <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-196 h-196 ">
            <Rc390Viewer camera={{ position: [0, 0, 120], fov: 50 }} />
          </div>
        </div>
      </div> */}
      
      {/* Parallax Cards Row */}
      <ParallaxCardsContainer />
      
      {/* <BikeCard modelUrl="/src/3d/glb/cards.glb" /> */}
    </div>
  );
}
