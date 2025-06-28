import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";

// SVG icons for each tab
const icons = {
  Shop: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <rect x="2" y="6" width="16" height="10" rx="2" fill="#FF6F00"/>
      <rect x="5" y="9" width="10" height="4" rx="1" fill="#1A1A1A"/>
    </svg>
  ),
  Showroom: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <rect x="3" y="7" width="14" height="8" rx="2" fill="#FF6F00"/>
      <circle cx="7" cy="15" r="2" fill="#1A1A1A"/>
      <circle cx="13" cy="15" r="2" fill="#1A1A1A"/>
    </svg>
  ),
  Exhaust: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <rect x="4" y="9" width="8" height="4" rx="1" fill="#FF6F00"/>
      <rect x="12" y="10" width="4" height="2" rx="1" fill="#1A1A1A"/>
      <rect x="2" y="10" width="2" height="2" rx="1" fill="#1A1A1A"/>
    </svg>
  ),
  Garage: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <rect x="3" y="8" width="14" height="7" rx="2" fill="#FF6F00"/>
      <rect x="7" y="11" width="6" height="4" rx="1" fill="#1A1A1A"/>
    </svg>
  ),
};

const navItems = [
  { to: "/shop", label: "Shop" },
  { to: "/showroom", label: "Showroom" },
  { to: "/exhaust", label: "Exhaust" },
  { to: "/garage", label: "Garage" },
];

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
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-lg bg-[rgba(26,26,26,0.85)] border-b border-[var(--color-border)] shadow-lg"
      style={{
        fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
        letterSpacing: "1px",
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
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative font-semibold px-2 py-1 flex items-center gap-2 text-[var(--color-white)] transition
              hover:text-[var(--color-accent)]
              ${isActive ? "text-[var(--color-accent)]" : ""}
              group`
            }
          >
            <span className="flex items-center gap-2">
              {icons[item.label]}
              <span className="relative">
                {item.label}
                <span
                  className="absolute left-0 -bottom-1 w-full h-0.5 rounded bg-[var(--color-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  aria-hidden="true"
                ></span>
              </span>
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
