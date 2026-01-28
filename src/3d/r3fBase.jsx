// src/3d/r3fBase.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

export default function R3FBase({ children, ...props }) {
  return (
    <Canvas {...props}>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      {children}
    </Canvas>
  );
}
