import React, { useState, useEffect } from "react";

export function WaterSprayCursor({ show, radius }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!show) return;
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [show]);

  if (!show) return null;
  return (
    <div style={{
      position: "fixed",
      left: pos.x - radius,
      top: pos.y - radius,
      pointerEvents: "none",
      zIndex: 9999,
      width: radius * 2,
      height: radius * 2,
    }}>
      {/* Water spray SVG */}
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <ellipse
          cx={radius}
          cy={radius}
          rx={radius * 0.7}
          ry={radius * 0.3}
          fill="#6EC6FF"
          opacity="0.5"
        />
        <ellipse
          cx={radius}
          cy={radius * 1.2}
          rx={radius * 0.3}
          ry={radius * 0.12}
          fill="#B3E5FC"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
