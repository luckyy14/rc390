import React, { useRef, useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import gsap from "gsap";

// AudioVisualizer: Circular waveform visualizer with play/pause button in the center
export default function AudioVisualizer({
  src = "/assets/audio/mixkit-motorcycle-engine-doing-gearshift-2725.wav",
  size = 400, // Increased canvas size
  barCount = 128,
  color = "#fff",
  accent = "var(--color-accent)",
  ...props
}) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioKey, setAudioKey] = useState(0); // force remount
  const audioRef = useRef(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [srcNode, setSrcNode] = useState(null);

  // Safari/legacy browser compatibility helpers
  const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Helper to clean up audio context and source node
  const cleanupAudio = () => {
    if (srcNode) {
      try { srcNode.disconnect(); } catch {}
      setSrcNode(null);
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch {}
      setAudioCtx(null);
    }
    setAnalyser(null);
    setDataArray(null);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // Safari requires AudioContext to be created in response to a user gesture
      let ctx;
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        ctx = window.webkitAudioContext ? new window.webkitAudioContext() : null;
      }
      if (!ctx) return;
      const analyserNode = ctx.createAnalyser();
      // Safari: analyserNode.fftSize must be power of 2 and <= 2048
      analyserNode.fftSize = 256;
      const dataArr = new Uint8Array(analyserNode.frequencyBinCount);
      // Safari: createMediaElementSource can only be used once per audio element, so force remount
      let sourceNode;
      try {
        sourceNode = ctx.createMediaElementSource(audioRef.current);
      } catch (e) {
        // fallback: force remount audio element
        setAudioKey((k) => k + 1);
        setIsPlaying(false);
        return;
      }
      setSrcNode(sourceNode);
      sourceNode.connect(analyserNode);
      analyserNode.connect(ctx.destination);
      setAudioCtx(ctx);
      setAnalyser(analyserNode);
      setDataArray(dataArr);
      // Safari: must call play() in a user gesture, and resume context if suspended
      const playAudio = async () => {
        try {
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          await audioRef.current.play();
        } catch (err) {
          // Optionally handle error
        }
      };
      playAudio();
    }
    return () => {
      cleanupAudio();
    };
    // eslint-disable-next-line
  }, [isPlaying, audioKey]);

  // --- Particle/Bar Inertia State ---
  // One particle per bar, each with radial inertia
  const particleRadiiRef = useRef([]);
  const particleRadialVelsRef = useRef([]);
  const GRAVITY = 0.5; // inward gravity (radial)
  const PUSH = 2.5; // outward push strength

  // Add a frame counter to slow down waveform updates
  const frameRef = useRef(0);
  useEffect(() => {
    if (!analyser || !canvasRef.current || !dataArray) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let accentColor = '#FF6F00';
    try {
      accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent') || '#FF6F00';
    } catch (e) {}
    ctx.clearRect(0, 0, responsiveSize, responsiveSize);
    let lastDataArray = new Uint8Array(dataArray.length);
    const SKIP_FRAMES = 22;
    // --- Top bar/particle state ---
    const draw = () => {
      const effectiveBarCount = Math.floor(barCount * 0.7);
      frameRef.current = (frameRef.current + 1) % SKIP_FRAMES;
      if (frameRef.current === 0) {
        analyser.getByteTimeDomainData(dataArray);
        lastDataArray.set(dataArray);
      }
      ctx.clearRect(0, 0, responsiveSize, responsiveSize);
      const minBarLength = 0.5;
      const maxBarLength = Math.max(10, responsiveSize / 20);
      const expansionMultiplier = 3;
      const radius = responsiveSize / 2 - (maxBarLength * expansionMultiplier) - 16;
      // Draw waveform bars and particles
      let maxBarLengthVal = 0;
      let barTipRadius = radius;
      // Ensure particle arrays are correct length
      if (particleRadiiRef.current.length !== effectiveBarCount) {
        particleRadiiRef.current = Array(effectiveBarCount).fill(null);
        particleRadialVelsRef.current = Array(effectiveBarCount).fill(0);
      }
      const centerX = responsiveSize / 2;
      const centerY = responsiveSize / 2;
      for (let i = 0; i < effectiveBarCount; i++) {
        const angle = (i / effectiveBarCount) * 2 * Math.PI - Math.PI / 2;
        const v = lastDataArray[i] / 255.0;
        const barLength = v < 0.05 ? minBarLength : minBarLength + v * maxBarLength * expansionMultiplier;
        if (i === 0) {
          maxBarLengthVal = barLength;
          barTipRadius = radius + barLength;
        }
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);
        // Draw bar
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 1;
        ctx.shadowColor = accentColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
        // --- Particle inertia logic for this bar ---
        const particleRadiusMin = radius + 10;
        const particleRadiusBar = radius + barLength + 10;
        let particleRadius = particleRadiiRef.current[i] === null ? particleRadiusBar - 40 : particleRadiiRef.current[i];
        let radialVel = particleRadialVelsRef.current[i];
        // If bar pushes outward, push particle outward
        if (particleRadius < particleRadiusBar) {
          particleRadius = particleRadiusBar;
          if (radialVel < PUSH) radialVel = PUSH;
        } else {
          // Gravity pulls inward
          radialVel -= (GRAVITY) * (1 - v); // less gravity for lower volume
          particleRadius += radialVel;
          // If particle falls inside bar, stick to bar
          if (particleRadius < particleRadiusBar) {
            particleRadius = particleRadiusBar;
            radialVel = 0;
          }
          // Prevent particle from going inside minimum radius
          if (particleRadius < particleRadiusMin) {
            particleRadius = particleRadiusMin;
            radialVel = 0;
          }
        }
        particleRadiiRef.current[i] = particleRadius;
        particleRadialVelsRef.current[i] = radialVel;
        // Draw the particle as a flat plate (rectangle) perpendicular to the bar
        ctx.save();
        const px = centerX + Math.cos(angle) * particleRadius;
        const py = centerY + Math.sin(angle) * particleRadius;
        const plateWidth = 8; // slightly wider than bar
        const plateHeight = 1; // flat
        const perpAngle = angle + Math.PI / 2;
        ctx.translate(px, py);
        ctx.rotate(perpAngle);
        ctx.beginPath();
        ctx.rect(-plateWidth / 2, -plateHeight / 2, plateWidth, plateHeight);
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [analyser, dataArray, size, barCount]);

  // Play/pause logic
  const handlePlayPause = () => {
    if (!isPlaying) {
      setAudioKey((k) => k + 1); // force remount audio
      setIsPlaying(true);
    } else {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Responsive canvas and hex size
  const containerRef = useRef(null);
  const [responsiveSize, setResponsiveSize] = useState(size);
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const w = containerRef.current.offsetWidth;
      setResponsiveSize(Math.max(180, Math.min(w, size)));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [size]);

  const hexSize = Math.max(40, responsiveSize / 5);

  // Center hexagon at (hexSize, hexSize) in SVG, so center play icon at same
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [
      hexSize + Math.cos(angle) * hexSize,
      hexSize + Math.sin(angle) * hexSize,
    ];
  });
  const hexPath = hexPoints.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ") + " Z";
  const accentColor = typeof window !== 'undefined' ? (getComputedStyle(document.documentElement).getPropertyValue('--color-accent') || '#FF6F00') : '#FF6F00';
  const hexFillColor = '#111';

  // Calculate ring center and radius for button placement
  const maxBarLength = Math.max(10, responsiveSize / 20);
  const expansionMultiplier = 3;
  const ringRadius = responsiveSize / 2 - (maxBarLength * expansionMultiplier) - 16;
  const ringCenter = responsiveSize / 2;
  const buttonSize = Math.max(40, ringRadius * 1.1);

  // Center the canvas and button relative to the ring
  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: size, height: responsiveSize }} {...props}>
      <canvas
        ref={canvasRef}
        width={responsiveSize}
        height={responsiveSize}
        style={{
          display: "block",
          width: responsiveSize,
          height: responsiveSize,
          background: "transparent",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-45%, -47.5%)",
          zIndex: 1
        }}
      />
      <button
        onClick={handlePlayPause}
        className="button button-tertiary"
        style={{
          boxShadow: "none",
          position: "absolute",
          left: "50%",
          top: "50%",
          width: buttonSize,
          height: buttonSize,
          background: "none",
          border: "none",
          cursor: "pointer",
          outline: "none",
          zIndex: 2,
          padding: 0,
          transform: "translate(-50%, -50%)",
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <svg
          id="audio-hex-icon"
          width={buttonSize}
          height={buttonSize}
          viewBox={`0 0 ${buttonSize} ${buttonSize}`}
          style={{ display: "block", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))" }}
        >
          {/* Recalculate hexPoints and hexPath for new buttonSize */}
          {(() => {
            const hex = buttonSize / 2;
            const points = Array.from({ length: 6 }, (_, i) => {
              const angle = (Math.PI / 3) * i - Math.PI / 6;
              return [
                hex + Math.cos(angle) * hex,
                hex + Math.sin(angle) * hex,
              ];
            });
            const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ") + " Z";
            return (
              <>
                <path d={path} fill={hexFillColor} />
                {isPlaying ? (
                  <g id="pause-group">
                    <rect x={hex - 6} y={hex - 16} width="8" height="32" rx="2" fill={accentColor} />
                    <rect x={hex + 6} y={hex - 16} width="8" height="32" rx="2" fill={accentColor} />
                  </g>
                ) : (
                  <polygon id="play-icon" points={`${hex - 8},${hex - 12} ${hex + 16},${hex} ${hex - 8},${hex + 12}`} fill={accentColor} />
                )}
              </>
            );
          })()}
        </svg>
      </button>
      <audio
        key={audioKey}
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
