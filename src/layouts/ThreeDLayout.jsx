import React from "react";

/**
 * ThreeDLayout
 * Renders a 3D canvas layer absolutely at z-index -1, and a 2D HTML layer at z-index 0.
 * Usage:
 * <ThreeDLayout canvas={<Canvas3D />}><Your2DContent /></ThreeDLayout>
 */
export default function ThreeDLayout({ canvas, children }) {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 3D Canvas Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "auto"
        }}
        onWheel={e => {
          console.log("[ThreeDLayout] onWheel event", e.deltaY, e);
        }}
        onScroll={e => {
          console.log("[ThreeDLayout] onScroll event", e);
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
