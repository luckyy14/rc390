import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./nfs-navbar.css";

const menuOptions = [
  {
    label: "SHOP",
    path: "/shop",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="24" width="32" height="12" rx="4" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="14" y="16" width="20" height="10" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="18" y="10" width="12" height="8" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <path d="M12 36 Q16 44 24 44 Q32 44 36 36" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    label: "MANUAL",
    path: "/manual",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="28" width="28" height="8" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="16" y="20" width="16" height="8" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="20" y="14" width="8" height="6" rx="1.5" fill="#fff" stroke="#111" strokeWidth="2"/>
        <path d="M14 36 Q18 42 24 42 Q30 42 34 36" stroke="#111" strokeWidth="2" fill="none"/>
        <g>
          <rect x="36" y="12" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
          <rect x="40" y="16" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
        </g>
      </svg>
    ),
  },
  {
    label: "GARAGE",
    path: "/garage",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="20" width="24" height="16" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="18" y="28" width="12" height="8" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="22" y="24" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
        <rect x="14" y="36" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
        <rect x="30" y="36" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    label: "DISPLAY",
    path: "/display",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="32" rx="14" ry="8" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="16" y="16" width="16" height="12" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="20" y="10" width="8" height="6" rx="1.5" fill="#fff" stroke="#111" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: "EXHAUST",
    path: "/exhaust",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="22" width="20" height="8" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="30" y="24" width="8" height="4" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <ellipse cx="40" cy="26" rx="3" ry="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <path d="M12 30 Q14 36 24 36 Q34 36 36 30" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
];

export default function NFSNavbar() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const len = menuOptions.length;

  // Circular navigation helpers
  const getIdx = (offset) => (selected + offset + len) % len;
  const leftIdx = getIdx(-1);
  const rightIdx = getIdx(1);

  // Keyboard navigation (circular, no scroll on up/down)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setSelected((s) => (s + 1) % len);
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") {
        setSelected((s) => (s - 1 + len) % len);
        e.preventDefault();
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault(); // Prevent scroll
      }
      if ((e.key === " " || e.key === "Enter") && document.activeElement.classList.contains("menu-option")) {
        const idx = Number(document.activeElement.getAttribute("data-idx"));
        if (!isNaN(idx)) {
          navigate(menuOptions[idx].path);
        }
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, len]);

  // Simulate selection (replace with navigation as needed)
  const handleSelect = (idx) => {
    setSelected(idx);
    navigate(menuOptions[idx].path);
  };

  // Render all items in a row, with 3D effect only for selected and neighbors
  const getTransform = (idx) => {
    const len = menuOptions.length;
    let rel = idx - selected;
    if (rel > len / 2) rel -= len;
    if (rel < -len / 2) rel += len;

    if (idx === selected) {
      return {
        transform: "scale(1.15) translateY(-10px)",
        zIndex: 3,
        opacity: 1,
        filter: "none",
        transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.3s, filter 0.3s",
      };
    }
    if (rel === -1) {
      return {
        transform: "rotateY(25deg) scale(0.95) translateY(0px)",
        zIndex: 2,
        opacity: 0.85,
        filter: "grayscale(40%) blur(0.2px)",
        transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.3s, filter 0.3s",
      };
    }
    if (rel === 1) {
      return {
        transform: "rotateY(-25deg) scale(0.95) translateY(0px)",
        zIndex: 2,
        opacity: 0.85,
        filter: "grayscale(40%) blur(0.2px)",
        transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.3s, filter 0.3s",
      };
    }
    // Farther items
    return {
      transform: "scale(0.8)",
      zIndex: 1,
      opacity: 0.5,
      filter: "grayscale(80%) blur(0.5px)",
      transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.3s, filter 0.3s",
    };
  };

  return (
    <nav className="nfs-menu">
      <div className="nfs-header">MAIN MENU</div>
      <div className="nfs-menu-options nfs-menu-3d">
        {menuOptions.map((opt, idx) => (
          <div
            className={`menu-option menu-3d-item${idx === selected ? " selected" : ""}`}
            key={opt.label}
            tabIndex={0}
            data-idx={idx}
            style={getTransform(idx)}
            onClick={() => handleSelect(idx)}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter")) {
                handleSelect(idx);
                e.preventDefault();
              }
            }}
          >
            {opt.icon}
            <span>{opt.label}</span>
            {idx === selected && <div className="reticle" />}
          </div>
        ))}
      </div>
    </nav>
  );
}
