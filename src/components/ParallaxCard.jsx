import React, { useRef, useState, useEffect } from 'react';
import { useSpring, to } from '@react-spring/web';
import { Rc390Viewer } from '../3d/models/rc390';
import { animated } from '@react-spring/web';
/**
 * ParallaxCard component
 * @param {Array} layers - Array of layer objects: { src, speed, centerYOffset, zIndex }
 * @param {string} title - Card title
 * @param {boolean} zoomOnScroll - Enable zoom on scroll
 * @param {function} onZoomed - Callback when zoomed
 * @param {number} width - Card width
 * @param {number} height - Card height
 * @param {object} style - Additional styles
 * @param {number} parallaxStrength - Multiplier for parallax effect (default 0.5)
 */
export default function ParallaxCard({
  layers = [],
  title = '',
  zoomOnScroll = false,
  onZoomed = () => {},
  width = 350,
  height = 400,
  style = {},
  parallaxStrength = 0.5,
}) {
  const cardRef = useRef();
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const zoomTimeout = useRef(null);

  // Scroll-to-zoom logic: only zoom when hovered and zoomOnScroll is enabled
  useEffect(() => {
    if (!zoomOnScroll || !isHovered) return;
    function onScrollOrWheel() {
      setIsZoomed(true);
      onZoomed();
      if (zoomTimeout.current) clearTimeout(zoomTimeout.current);
      zoomTimeout.current = setTimeout(() => setIsZoomed(false), 400);
    }
    window.addEventListener('scroll', onScrollOrWheel, { passive: true });
    window.addEventListener('wheel', onScrollOrWheel, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollOrWheel);
      window.removeEventListener('wheel', onScrollOrWheel);
      if (zoomTimeout.current) clearTimeout(zoomTimeout.current);
    };
  }, [zoomOnScroll, isHovered, onZoomed]);

  // Spring for tilt and zoom
  const [{ x, y, scale, borderRadius }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    borderRadius: 24,
    config: { mass: 2, tension: 300, friction: 30 },
  }));

  // Throttled global mouse tracking using requestAnimationFrame
  useEffect(() => {
    let frame = null;
    function handleGlobalMouseMove(e) {
      if (!cardRef.current) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = cardRef.current.getBoundingClientRect();
        // Mouse position relative to card center (0.5, 0.5 is center)
        let x = (e.clientX - rect.left) / rect.width;
        let y = (e.clientY - rect.top) / rect.height;
        // Clamp x and y to [0, 1]
        x = Math.max(0, Math.min(1, x));
        y = Math.max(0, Math.min(1, y));
        setMouse((prev) => (prev.x !== x || prev.y !== y ? { x, y } : prev));
      });
    }
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Calculate tilt multiplier based on hover and distance from card center
  function getTiltMultiplier(mouse) {
    // Calculate distance from card center (0.5, 0.5)
    const dx = mouse.x - 0.5;
    const dy = mouse.y - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Exponential decay: multiplier = 18 * exp(-2.5 * dist)
    return 28 * Math.exp(-2.2 * dist);
  }

  useEffect(() => {
    // Mouse tilt: -1 to 1, with dynamic multiplier
    const multiplier = getTiltMultiplier(mouse);
    const tiltX = -(mouse.y - 0.5) * multiplier;
    const tiltY = (mouse.x - 0.5) * multiplier;
    api.start({
      x: tiltX,
      y: tiltY,
      scale: isZoomed ? 1.2 : 1,
      borderRadius: isZoomed ? 0 : 24,
    });
  }, [mouse, isZoomed, api
  ]);

  return (
    <animated.div
      ref={cardRef}
      className="parallax-card relative overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsZoomed(false);
      }}
      style={{
        width,
        height,
        borderRadius,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.18)',
        background: '#18181b',
        cursor: 'pointer',
        touchAction: 'none',
        ...style,
        transform: to([x, y, scale], (rx, ry, s) =>
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
        ),
        transition: 'box-shadow 0.2s',
        zIndex: isZoomed ? 10 : 1,
      }}
    >
      {/* Render 3D layers as background */}
      {layers.filter(layer => layer.type === '3d' && typeof layer.component === 'function').map((layer, i) =>
        <div key={`3d-${i}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {React.createElement(layer.component, { camera: layer.camera })}
        </div>
      )}
      {/* Render image layers above */}
      {layers.filter(layer => layer.type !== '3d').map((layer, i) => (
        <animated.img
          key={i}
          src={layer.src}
          alt={`Layer ${i}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: (layer.zIndex || i + 2),
            opacity: layer.opacity || 1,
            pointerEvents: 'none',
            filter: 'none',
            boxShadow: 'none',
            mixBlendMode: 'normal',
          }}
          draggable={false}
        />
      ))}
      {title && (
        <div className="absolute bottom-4 left-0 w-full text-center text-white text-xl font-bold drop-shadow-lg z-20 select-none pointer-events-none">
          {title}
        </div>
      )}
    </animated.div>
  );
}
