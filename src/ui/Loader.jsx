import React from "react";

// Bouncing tyre loader with burnout effect using SVG and CSS
export const Loader = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="relative">
      <svg
        className="animate-bounce"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        style={{ filter: "drop-shadow(0 4px 12px #FF6F00AA)" }}
      >
        <ellipse
          cx="32"
          cy="56"
          rx="16"
          ry="4"
          fill="#333"
          opacity="0.3"
        />
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="#1A1A1A"
          stroke="#FF6F00"
          strokeWidth="6"
        />
        <circle cx="32" cy="32" r="12" fill="#FF6F00" />
        {/* Tyre treads */}
        <g stroke="#FFF" strokeWidth="2" strokeLinecap="round">
          <line x1="32" y1="10" x2="32" y2="18" />
          <line x1="32" y1="46" x2="32" y2="54" />
          <line x1="10" y1="32" x2="18" y2="32" />
          <line x1="46" y1="32" x2="54" y2="32" />
        </g>
        {/* Burnout smoke */}
        <ellipse
          className="animate-pulse"
          cx="48"
          cy="58"
          rx="6"
          ry="2"
          fill="#BBBBBB"
          opacity="0.5"
        />
        <ellipse
          className="animate-pulse"
          cx="54"
          cy="62"
          rx="3"
          ry="1"
          fill="#E0E0E0"
          opacity="0.3"
        />
      </svg>
      {/* Burnout effect */}
      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-24 h-4 rounded-full blur-md bg-gradient-to-r from-[#FF6F00] via-[#FF8C1A] to-transparent opacity-60"></div>
    </div>
    <span className="mt-4 text-[var(--color-accent)] font-heading text-lg tracking-widest">
      Loading...
    </span>
    <style>
      {`
        .animate-bounce {
          animation: bounce 1.1s infinite cubic-bezier(.5,0.2,.5,1);
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-18px);}
        }
        .animate-pulse {
          animation: pulse 1.2s infinite alternate;
        }
        @keyframes pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
      `}
    </style>
  </div>
);
