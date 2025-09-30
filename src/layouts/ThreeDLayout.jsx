import React from "react";

/**
 * ThreeDLayout
 * Renders a 3D canvas layer absolutely at z-index 0, and a 2D HTML layer at z-index 1.
 * Usage:
 * <ThreeDLayout canvas={<CanvasSelector />}>{children}</ThreeDLayout>
 */
export default function ThreeDLayout({ canvas, children }) {
  return (
    <div style={{ position: "relative" }}>
      {/* 3D Canvas Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "auto"
        }}
      >
        {canvas}
      </div>
      {/* 2D HTML/UI Layer */}
      <div style={{ position: "relative", zIndex: 1, width: "100vw", height: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
