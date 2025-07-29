import React, { useRef, useState, useEffect } from 'react';
import { useLenis } from '../layouts/LenisProvider';
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
  width = 160,
  height = 120,
  style = {},
  parallaxStrength = 0.5,
}) {
  const cardRef = useRef();
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  // Remove scrollProgress state, use Lenis scroll instead
  const { scroll } = useLenis();

  // Only tilt, never zoom, with mouse movement
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 2, tension: 300, friction: 30 },
  }));

  // Use Lenis scroll position to drive zoom/fullscreen
  // Assume the card's zoom progress is based on scroll position relative to the card
  // For demo: map scroll from 0 to window.innerHeight to progress 0-1
  const [cardTop, setCardTop] = useState(0);
  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardTop(rect.top + window.scrollY);
    }
  }, []);
  // Always interpolate size based on Lenis scroll position, with more size per scroll
  // Increase the effect by reducing the denominator (e.g., 0.4 * window.innerHeight)
  let scrollProgress = 0;
  if (cardTop > 0) {
    const scrollStart = cardTop - window.innerHeight / 2;
    const scrollEnd = cardTop + 0.4 * window.innerHeight;
    scrollProgress = (scroll - scrollStart) / (scrollEnd - scrollStart);
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));
    // If page is at the top, force scrollProgress to 0
    if (typeof window !== "undefined" && window.scrollY < 10) scrollProgress = 0;
  }
  if (zoomOnScroll && scrollProgress > 0.8) onZoomed();
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

  // Store current size for tilt reference
  const [currentSize, setCurrentSize] = useState({ width, height });

  // Tilt effect only
  function getTiltMultiplier(mouse) {
    const dx = mouse.x - 0.5;
    const dy = mouse.y - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return 28 * Math.exp(-2.2 * dist);
  }

  useEffect(() => {
    // Disable tilt when card width >70% of viewport width
    const tooLarge = currentSize.width > 0.7 * window.innerWidth;
    if (tooLarge) {
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
  }, [mouse, api, scrollProgress, currentSize]);

  // (moved up)

  // Calculate position interpolation for fullscreen transition
  const [originRect, setOriginRect] = useState(null);


  // Interpolate position and size for zoom
  const [animatedStyle, setAnimatedStyle] = useState({backgroundColor:"red"});
  let tiltStyle = {};

  useEffect(() => {
    if (scrollProgress > 0) {
      // Accelerate scroll progress for faster zoom/size increase
      console.log("scrollProgress", scrollProgress);
      const fastProgress = Math.min(Math.pow(scrollProgress, 0.4), 5);
      const rect = cardRef.current ? cardRef.current.getBoundingClientRect() : { left: 0, top: 0, width, height };
      const originCenterX = rect.left + rect.width / 2;
      const originCenterY = rect.top + rect.height / 2;
      const targetCenterX = window.innerWidth / 2;
      const targetCenterY = window.innerHeight / 2;

      const centerX = originCenterX + (targetCenterX - originCenterX) * fastProgress;
      const centerY = originCenterY + (targetCenterY - originCenterY) * fastProgress;

      const widthVal = rect.width + (window.innerWidth - rect.width) * fastProgress;
      const heightVal = rect.height + (window.innerHeight - rect.height) * fastProgress;
      setCurrentSize({ width: widthVal, height: heightVal });
      setAnimatedStyle({
        position: "fixed",
        touchAction: 'none',
        ...style,
        transition: `box-shadow 0.2s, left 0.3s cubic-bezier(0.4,0,0.2,1), top 0.3s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1)`,
      });
    } else {
      // On initial load or scrollProgress === 0, reset to initial size
      setCurrentSize({ width, height });
      setAnimatedStyle({
        touchAction: 'none',
        ...style,
        transition: 'box-shadow 0.2s',
      });
    }
  }, [scrollProgress, width, height]);
  // Tilt transform is now applied to the parent card, not the child
  const tiltParent = {
    transform: to([x, y], (rx, ry) => {
      // Clamp tilt to [-15, 15] degrees
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const crx = clamp(rx, -15, 15);
      const cry = clamp(ry, -15, 15);
      return `perspective(400px) rotateX(${crx}deg) rotateY(${cry}deg)`;
    }),
    willChange: "transform"
  };

  // Ensure tilt (parallax) only affects inner content, not card size/position.
  return (
    <animated.div
      ref={cardRef}
      className="parallax-card overflow-hidden shadow-lg"
      style={{
        ...animatedStyle,
        ...tiltParent,
        width: currentSize.width,
        height: currentSize.height,
        overflow: 'hidden',
        cursor: 'pointer',
        touchAction: 'none',
        borderRadius: 24
      }}
    >
      <div className="w-full h-full">
        <div className="w-full h-full pointer-events-none">
          {/* Render 3D layers as background */}
          {layers.filter(layer => layer.type === '3d' && typeof layer.component === 'function').map((layer, i) => {
            // Camera offset based on tilt (x, y)
            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
            const crx = clamp(x.get(), -15, 15);
            const cry = clamp(y.get(), -15, 15);
            const rotX = -crx * Math.PI / 180 * 3;
            const rotY = cry * Math.PI / 180 * 8;
            // Render the 3D layer as a function inside Canvas context
            return (
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
                {layer.component({ camera: layer.camera, rotX, rotY })}
              </div>
            );
          })}
          {/* Render image layers above */}
          {layers.filter(layer => layer.type !== '3d').map((layer, i) => {
            // Ensure image is always large enough to cover card during parallax
            // Use a larger multiplier to guarantee no edge exposure
            const imgScale = 2.6;
            const imgWidth = Math.min(width * imgScale, window.innerWidth);
            const imgHeight = Math.min(height * imgScale, window.innerHeight);
            
            return (
              <animated.img
                key={i}
                src={layer.src}
                alt={`Layer ${i}`}
                style={{
                  width: `${window.innerWidth}px`,
                  height: `${window.innerHeight}px`,
                  objectFit: 'cover',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: to([x, y], (rx, ry) => {
                    // Parallax offset based on mouse position, speed, and parallaxStrength
                    const speed = typeof layer.speed === 'number' ? layer.speed : 1;
                    const maxOffset = 0.12;
                    const px = (rx / 15) * speed * parallaxStrength * maxOffset * width;
                    const py = (ry / 15) * speed * parallaxStrength * maxOffset * height;
                    const yOffset = layer.centerYOffset || 0;
                    return `translate(-50%, -50%) translate3d(${px}px, ${py + yOffset}px, 0)`;
                  }),
                  zIndex: (layer.zIndex || i + 2),
                  opacity: layer.opacity || 1,
                  pointerEvents: 'none',
                  filter: 'none',
                  boxShadow: 'none',
                  mixBlendMode: 'normal',
                  borderRadius: 24,
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
        </div>
      </div>
    </animated.div>
  );
}
