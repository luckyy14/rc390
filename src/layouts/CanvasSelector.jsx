import React from "react";
import { useLocation } from "react-router-dom";
import ParallaxCardsContainer, { Rc390WithControls } from "../components/ParallaxCardsContainer";
import { Rc390Viewer } from "../3d/models/rc390";
import Showroom from "../pages/Showroom";

// Map routes to 3D/visual background components
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const canvasMap = {
  "/": (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* <Canvas style={{ width: "100vw", height: "100vh" }}>
        <ambientLight intensity={0.5} />
        <OrbitControls />
        <Rc390WithControls rotX={0} rotY={0} />
      </Canvas> */}
      <ParallaxCardsContainer />
    </div>
  ),
  // "/display": (
  //   <Canvas style={{ width: "100vw", height: "100vh" }}>
  //     <ambientLight intensity={0.5} />
  //     <OrbitControls />
  //     <Rc390Viewer />
  //   </Canvas>
  // ), 
  // "/showroom": <Showroom />,
  // Add more routes and backgrounds as needed
};

export default function CanvasSelector() {
  const location = useLocation();
  return canvasMap[location.pathname] || null;
}
