import React from "react";
import { useLocation } from "react-router-dom";
import ParallaxCardsContainer from "../components/ParallaxCardsContainer";
import { Rc390Viewer } from "../3d/models/rc390";

// Map routes to 3D/visual background components
const canvasMap = {
  "/": <div style={{ position: "relative", width: "100vw", height: "1500px"}}><ParallaxCardsContainer /></div>,
  // "/display": <Rc390Viewer />,
  // Add more routes and backgrounds as needed
};

export default function CanvasSelector() {
  const location = useLocation();
  return canvasMap[location.pathname] || null;
}
