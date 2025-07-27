import React from "react";

/**
 * TwoDLayout
 * Simple layout for 2D-only pages.
 * Usage:
 * <TwoDLayout><Your2DContent /></TwoDLayout>
 */
export default function TwoDLayout({ children }) {
  return (
    <div style={{ position: "relative", width: "100vw", minHeight: "100vh", zIndex: 0 }}>
      {children}
    </div>
  );
}
