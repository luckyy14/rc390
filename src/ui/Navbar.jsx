import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";

import { NAV_ITEMS } from "./nav-items.jsx";

export const Navbar = () => {
  const logoRef = useRef(null);
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "linear",
      });
    }
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 navbar backdrop-blur-lg border-b border-[var(--color-border)]"
      style={{
        fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
        letterSpacing: "1px",
        background: "transparent",
        boxShadow: "0 0 80px 10px #ff6600cc, 0 0 0 100vmax rgba(26,26,26,0.85) inset"
      }}
    >
      <div className="flex items-center gap-3">
        {/* Bouncing tyre SVG logo */}
        <svg ref={logoRef} width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="14" fill="#1A1A1A" stroke="#FF6F00" strokeWidth="4"/>
          <circle cx="18" cy="18" r="7" fill="#FF6F00"/>
          <ellipse cx="18" cy="28" rx="7" ry="2" fill="#333" opacity="0.4"/>
        </svg>
        <span
          className="text-[var(--color-white)] text-2xl font-bold tracking-widest"
          style={{ fontFamily: "Oswald, Rajdhani, Inter, sans-serif" }}
        >
          DARKRIDE
        </span>
      </div>
      <div className="flex gap-12">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative font-semibold px-4 py-2 nav-link flex items-center gap-2 text-[var(--color-white)] transition
              hover:text-[var(--color-accent)]
              ${isActive ? "text-[var(--color-accent)]" : ""}
              group`
            }
          >
            <span className="flex items-center gap-2">
              {item.iconSmall}
              <span className="relative">
                {item.label}
                <span
                  className="absolute left-0 -bottom-1 w-full h-0.5 rounded bg-[var(--color-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  aria-hidden="true"
                ></span>
                {({ isActive }) => (
                  <div
                    className="reticle"
                    style={{
                      position: "absolute",
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      pointerEvents: "none",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.2s"
                    }}
                  >
                    <div className="corner tl"></div>
                    <div className="corner tr"></div>
                    <div className="corner bl"></div>
                    <div className="corner br"></div>
                  </div>
                )}
              </span>
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
