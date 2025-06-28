import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Bouncing tyre loader with burnout effect using SVG and GSAP
export const Loader = () => {
  const svgRef = useRef(null);
  const smoke1Ref = useRef(null);
  const smoke2Ref = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        y: -18,
        duration: 0.55,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    }
    if (smoke1Ref.current) {
      gsap.to(smoke1Ref.current, {
        opacity: 0.7,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
    if (smoke2Ref.current) {
      gsap.to(smoke2Ref.current, {
        opacity: 0.7,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        delay: 0.3,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 md:px-8">
      <div className="relative">
        <svg
          ref={svgRef}
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          style={{ filter: "drop-shadow(0 4px 12px #FF6F00AA)" }}
        >
          <ellipse cx="32" cy="56" rx="16" ry="4" fill="#333" opacity="0.3" />
          <circle cx="32" cy="32" r="24" fill="#1A1A1A" stroke="#FF6F00" strokeWidth="6" />
          <circle cx="32" cy="32" r="12" fill="#FF6F00" />
          {/* Tyre treads */}
          <g stroke="#FFF" strokeWidth="2" strokeLinecap="round">
            <line x1="32" y1="10" x2="32" y2="18" />
            <line x1="32" y1="46" x2="32" y2="54" />
            <line x1="10" y1="32" x2="18" y2="32" />
            <line x1="46" y1="32" x2="54" y2="32" />
          </g>
          {/* Burnout smoke */}
          <ellipse ref={smoke1Ref} cx="48" cy="58" rx="6" ry="2" fill="#BBBBBB" opacity="0.5" />
          <ellipse ref={smoke2Ref} cx="54" cy="62" rx="3" ry="1" fill="#E0E0E0" opacity="0.3" />
        </svg>
        {/* Burnout effect */}
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-24 h-4 rounded-full blur-md bg-gradient-to-r from-[#FF6F00] via-[#FF8C1A] to-transparent opacity-60"></div>
      </div>
      <span className="mt-4 text-[var(--color-accent)] font-heading text-lg tracking-widest">
        Loading...
      </span>
    </div>
  );
};
