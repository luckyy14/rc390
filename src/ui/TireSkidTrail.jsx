// src/ui/TireSkidTrail.jsx
import React, { useRef, useEffect } from "react";

export default function TireSkidTrail() {
  const canvasRef = useRef(null);
  const skids = useRef([]);
  const lastPos = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Resize canvas to fill window
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Create tread pattern
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 16;
    patternCanvas.height = 16;
    const pctx = patternCanvas.getContext("2d");
    pctx.fillStyle = "#bbb";
    pctx.fillRect(0, 0, 4, 4);
    pctx.fillRect(12, 12, 4, 4);
    pctx.clearRect(4, 0, 8, 4);
    pctx.clearRect(0, 4, 4, 8);
    pctx.clearRect(12, 4, 4, 8);
    pctx.clearRect(4, 12, 8, 4);
    const treadPattern = ctx.createPattern(patternCanvas, "repeat");

    const baseWidth = 32;
    const maxLength = 120;
    const fadeSpeed = 0.018;
    const lengthScale = 2.5;

    function addSkid(x, y, dx, dy) {
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag < 0.5) return;
      const angle = Math.atan2(dy, dx);
      skids.current.push({
        x,
        y,
        angle,
        age: 0,
        length: Math.min(maxLength, mag * lengthScale),
        width: baseWidth,
      });
    }

    function updateAndDraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = skids.current.length - 1; i >= 0; i--) {
        const skid = skids.current[i];
        skid.age += fadeSpeed;
        skid.width = baseWidth * (1 - skid.age);
        if (skid.age >= 1) {
          skids.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(skid.x, skid.y);
        ctx.rotate(skid.angle);
        ctx.fillStyle = treadPattern;
        ctx.globalAlpha = 1 - skid.age;
        ctx.fillRect(
          -skid.length / 2,
          -skid.width / 2,
          skid.length,
          skid.width
        );
        ctx.restore();
        ctx.globalAlpha = 1;
      }
      animationFrameId = requestAnimationFrame(updateAndDraw);
    }

    function onMouseMove(e) {
      if (lastPos.current.x !== null && lastPos.current.y !== null) {
        const dx = e.clientX - lastPos.current.x;
        const dy = (e.clientY ) - lastPos.current.y;
        addSkid(e.clientX +30, e.clientY + 20, dx, dy);
      }
      lastPos.current.x = e.clientX;
      lastPos.current.y = e.clientY - 10;
    }

    window.addEventListener("mousemove", onMouseMove);
    updateAndDraw();

    // Set custom wheel cursor
    document.body.style.cursor = 'url("/assets/wheel1.png") 16 16, auto';

    // Fallback: inject global CSS cursor style with hotspot
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `html, body, *, canvas { cursor: url("/assets/wheel1.png") 16 16, auto; }`;
    document.head.appendChild(styleTag);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = "";
      // Remove injected style tag
      if (styleTag && styleTag.parentNode) styleTag.parentNode.removeChild(styleTag);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
      }}
      width={window.innerWidth}
      height={window.innerHeight}
      aria-hidden="true"
    />
  );
}
