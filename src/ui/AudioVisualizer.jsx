import React, { useRef, useEffect, useState } from "react";

// AudioVisualizer: Circular waveform visualizer with play/pause button in the center
export default function AudioVisualizer({
  src = "/assets/audio/mixkit-motorcycle-engine-doing-gearshift-2725.wav",
  size = 320,
  barCount = 64,
  color = "#fff",
  accent = "#FFB300",
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
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;
      const dataArr = new Uint8Array(analyserNode.frequencyBinCount);
      const sourceNode = ctx.createMediaElementSource(audioRef.current);
      setSrcNode(sourceNode);
      sourceNode.connect(analyserNode);
      analyserNode.connect(ctx.destination);
      setAudioCtx(ctx);
      setAnalyser(analyserNode);
      setDataArray(dataArr);
      audioRef.current.play();
    }
    return () => {
      cleanupAudio();
    };
    // eslint-disable-next-line
  }, [isPlaying, audioKey]);

  useEffect(() => {
    if (!analyser || !canvasRef.current || !dataArray) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, size, size);
      // Draw outer circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 8, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
      // Draw waveform bars
      const radius = size / 2 - 18;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * 2 * Math.PI;
        const v = dataArray[i] / 128.0;
        const barLength = 18 + (v - 1) * 32;
        const x1 = size / 2 + Math.cos(angle) * radius;
        const y1 = size / 2 + Math.sin(angle) * radius;
        const x2 = size / 2 + Math.cos(angle) * (radius + barLength);
        const y2 = size / 2 + Math.sin(angle) * (radius + barLength);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // Draw inner circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 38, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [analyser, dataArray, color, accent, size, barCount]);

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

  // Center hexagon button
  const hexSize = 48;
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [
      size / 2 + Math.cos(angle) * hexSize,
      size / 2 + Math.sin(angle) * hexSize,
    ];
  });
  const hexPath = hexPoints.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ") + " Z";

  return (
    <div style={{ position: "relative", width: size, height: size }} {...props}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ display: "block", width: size, height: size }}
      />
      <button
        onClick={handlePlayPause}
        style={{
          position: "absolute",
          left: size / 2 - hexSize,
          top: size / 2 - hexSize,
          width: hexSize * 2,
          height: hexSize * 2,
          background: "none",
          border: "none",
          cursor: "pointer",
          outline: "none",
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <svg width={hexSize * 2} height={hexSize * 2} viewBox={`0 0 ${hexSize * 2} ${hexSize * 2}`}>
          <path d={hexPath} fill={accent} stroke="#fff" strokeWidth="3" />
          {isPlaying ? (
            <g>
              <rect x={hexSize - 10} y={hexSize - 16} width="8" height="32" rx="2" fill="#222" />
              <rect x={hexSize + 2} y={hexSize - 16} width="8" height="32" rx="2" fill="#222" />
            </g>
          ) : (
            <polygon points={`${hexSize - 8},${hexSize - 16} ${hexSize + 16},${hexSize} ${hexSize - 8},${hexSize + 16}`} fill="#222" />
          )}
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
