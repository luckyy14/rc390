import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";

// Unified nav items
// Unified nav items
import { NAV_ITEMS } from "./nav-items.jsx";

// SVG gear icon for the hamburger button
const GearIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="14"
      r="10"
      stroke="#FF6F00"
      strokeWidth="3"
      fill="#1A1A1A"
    />
    <g stroke="#FF6F00" strokeWidth="2" strokeLinecap="round">
      <line x1="14" y1="2" x2="14" y2="7" />
      <line x1="14" y1="21" x2="14" y2="26" />
      <line x1="2" y1="14" x2="7" y2="14" />
      <line x1="21" y1="14" x2="26" y2="14" />
      <line x1="5.2" y1="5.2" x2="8.7" y2="8.7" />
      <line x1="19.3" y1="19.3" x2="22.8" y2="22.8" />
      <line x1="5.2" y1="22.8" x2="8.7" y2="19.3" />
      <line x1="19.3" y1="8.7" x2="22.8" y2="5.2" />
    </g>
  </svg>
);

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (open && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { y: "-100%", opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [open]);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-[100] flex items-center gap-2 p-3 rounded-full bg-[var(--color-accent)] shadow-lg md:hidden"
        aria-label="Open navigation menu"
        onClick={() => setOpen((o) => !o)}
        style={{ border: "2px solid #FF6F00" }}
      >
        <GearIcon />
      </button>
      {open && (
        <nav
          ref={menuRef}
          className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-8 z-[99] md:hidden"
          style={{
            background: "transparent",
            boxShadow: "0 0 80px 10px #ff6600cc, 0 0 0 100vmax rgba(26,26,26,0.97) inset"
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-2xl font-bold px-6 py-3 rounded nav-link text-[var(--color-white)] hover:text-[var(--color-accent)] transition ${
                  isActive ? "text-[var(--color-accent)]" : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
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
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
