import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./nfs-navbar.css";

// Unified nav items
import { NAV_ITEMS } from "./nav-items.jsx";
const nfsnavitems = NAV_ITEMS.map(item => ({
  label: item.label.toUpperCase(),
  path: item.to,
  icon: item.iconLarge,
}));

export default function NFSNavbar() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const len = nfsnavitems.length;

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
          navigate(nfsnavitems[idx].path);
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
    navigate(nfsnavitems[idx].path);
  };

  // Render all items in a row, with 3D effect only for selected and neighbors
  const getTransform = (idx) => {
    const len = nfsnavitems.length;
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
      <div className="nfs-header">Midnight Torque</div>
      <div className="nfs-menu-options nfs-menu-3d">
        {nfsnavitems.map((opt, idx) => (
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
