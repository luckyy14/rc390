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
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1

  // Only tilt, never zoom, with mouse movement
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 2, tension: 300, friction: 30 },
  }));

  // Mouse move for tilt only
  useEffect(() => {
    let frame = null;
    function handleGlobalMouseMove(e) {
      if (!cardRef.current) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = cardRef.current.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width;
        let y = (e.clientY - rect.top) / rect.height;
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

  // Tilt effect only
  function getTiltMultiplier(mouse) {
    const dx = mouse.x - 0.5;
    const dy = mouse.y - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return 28 * Math.exp(-2.2 * dist);
  }

  useEffect(() => {
    // Disable tilt when zoomed in >80%
    console.log('scrollProgress', scrollProgress);
    if (scrollProgress > 0.5) {
      api.start({ x: 0, y: 0, immediate: true });
      return;
    }
    const multiplier = getTiltMultiplier(mouse);
    const tiltX = -(mouse.y - 0.5) * multiplier;
    const tiltY = (mouse.x - 0.5) * multiplier;
    api.start({
      x: tiltX,
      y: tiltY,
      immediate: false
    });
  }, [mouse, api, scrollProgress]);

  // Scroll to zoom only (no mouse effect)
  useEffect(() => {
    if (!zoomOnScroll) return;
    function onWheel(e) {
      setScrollProgress(prev => {
        let next = prev + e.deltaY * 0.002;
        next = Math.max(0, Math.min(1, next));
        return next;
      });
      if (scrollProgress > 0.8) onZoomed();
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, [zoomOnScroll, onZoomed, scrollProgress]);

  // Calculate position interpolation for fullscreen transition
  const [originRect, setOriginRect] = useState(null);

  useEffect(() => {
    if (isHovered && cardRef.current && scrollProgress > 0 && !originRect) {
      setOriginRect(cardRef.current.getBoundingClientRect());
    }
    if (!isHovered || scrollProgress === 0) {
      setOriginRect(null);
    }
  }, [isHovered, scrollProgress]);

  // Store current size for tilt reference
  const [currentSize, setCurrentSize] = useState({ width, height });

  useEffect(() => {
    // Update current size on zoom
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCurrentSize({ width: rect.width, height: rect.height });
    }
  }, [scrollProgress]);

  // Interpolate position and size for zoom
  let animatedStyle = {};
  if (scrollProgress > 0) {
    const rect = cardRef.current ? cardRef.current.getBoundingClientRect() : { left: 0, top: 0, width, height };
    const originCenterX = rect.left + rect.width / 2;
    const originCenterY = rect.top + rect.height / 2;
    const targetCenterX = window.innerWidth / 2;
    const targetCenterY = window.innerHeight / 2;

    const centerX = originCenterX + (targetCenterX - originCenterX) * scrollProgress;
    const centerY = originCenterY + (targetCenterY - originCenterY) * scrollProgress;

    const widthVal = rect.width + (window.innerWidth - rect.width) * scrollProgress;
    const heightVal = rect.height + (window.innerHeight - rect.height) * scrollProgress;

    const left = centerX - widthVal / 2;
    const top = centerY - heightVal / 2;

    animatedStyle = {
      position: "fixed",
      left: `calc(50vw - ${widthVal / 2}px)`,
      top: `calc(50vh - ${heightVal / 2}px)`,
      width: widthVal,
      height: heightVal,
      borderRadius: scrollProgress > 0.8 ? 0 : 24,
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.18)',
      background: '#18181b',
      cursor: 'pointer',
      touchAction: 'none',
      ...style,
      transform: to([x, y], (rx, ry) =>
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
      ),
      transition: `box-shadow 0.2s, left 0.3s cubic-bezier(0.4,0,0.2,1), top 0.3s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1)`,
      zIndex: 30,
    };
  } else {
    animatedStyle = {
      width: currentSize.width,
      height: currentSize.height,
      borderRadius: 24,
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.18)',
      background: '#18181b',
      cursor: 'pointer',
      touchAction: 'none',
      ...style,
      transform: to([x, y], (rx, ry) =>
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
      ),
      transition: 'box-shadow 0.2s',
      zIndex: scrollProgress > 0.98 ? 20 : 1,
    };
  }

  return (
    <animated.div
      ref={cardRef}
      className="parallax-card overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={animatedStyle}
    >
      {/* Render 3D layers as background */}
      {layers.filter(layer => layer.type === '3d' && typeof layer.component === 'function').map((layer, i) =>
        <div
          key={`3d-${i}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
