import React, { useRef, useState, useEffect } from 'react';
import { useSpring, animated, to } from '@react-spring/web';

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

  // Scroll-to-zoom logic (center card only)
  useEffect(() => {
    if (!zoomOnScroll) return;
    const onScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // If card is near center of viewport, zoom
      if (rect.top < vh * 0.25 && rect.bottom > vh * 0.75) {
        setIsZoomed(true);
        onZoomed();
      } else {
        setIsZoomed(false);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [zoomOnScroll, onZoomed]);

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
      scale: isZoomed ? 1.15 : 1,
      borderRadius: isZoomed ? 0 : 24,
    });
  }, [mouse, isZoomed, api
  ]);

  return (
    <animated.div
      ref={cardRef}
      className="parallax-card relative overflow-hidden shadow-lg"
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
      {layers.map((layer, i) => {
        const speed = (layer.speed || 0) * parallaxStrength;
        // If speed is 0, skip extra translation for performance
        const animatedTransform = speed
          ? to([y, x], (ry, rx) =>
              `translate(-50%, -50%) translate3d(${ry * speed}px, ${rx * speed}px, 0)`
            )
          : 'translate(-50%, -50%)';
        return (
          <animated.img
            key={i}
            src={layer.src}
            alt={layer.alt || ''}
            style={{
              width: '150%',
              height: '150%',
              objectFit: 'cover',
              position: 'absolute',
              left: '50%',
              top: `calc(50% + ${(layer.centerYOffset || 0)}px)`,
              zIndex: layer.zIndex || i + 1,
              pointerEvents: 'none',
              userSelect: 'none',
              transform: animatedTransform,
            }}
            draggable={false}
          />
        );
      })}
      {title && (
        <div className="absolute bottom-4 left-0 w-full text-center text-white text-xl font-bold drop-shadow-lg z-20 select-none pointer-events-none">
          {title}
        </div>
      )}
    </animated.div>
  );
} 