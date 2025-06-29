import React, { useState, useRef } from "react";
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

  // Inertia scroll state
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const animationRef = useRef();
  const inertiaActive = useRef(false);
  const audioRef = useRef(null);
  const lastTickTime = useRef(0);

  // Track if user interacted (for autoplay policy)
  const userInteracted = useRef(false);

  // Play tick sound, speed up if fast
  const playTick = (rate = 1) => {
    if (!userInteracted.current) return;
    // Use a new Audio instance for each tick to allow overlap
    const tick = new window.Audio("/assets/audio/tick.mp3");
    tick.playbackRate = rate;
    tick.volume = 1;
    tick.play().catch(() => {});
  };

  // Inertia animation
  const animateInertia = (vel) => {
    if (inertiaActive.current) return;
    inertiaActive.current = true;
    let v = vel;
    let idx = selected;
    const friction = 0.95;
    const minVel = 0.15;
    const baseTickRate = 1;
    const maxTickRate = 2.2;
    const tickInterval = 60; // ms, minimum time between ticks

    const step = () => {
      if (Math.abs(v) < minVel) {
        inertiaActive.current = false;
        return;
      }
      let nextIdx = Math.round(idx + v);
      let steps = Math.abs(nextIdx - idx);
      let dir = v > 0 ? 1 : -1;
      let tickRate = Math.min(maxTickRate, baseTickRate + Math.abs(v) * 0.7);

      while (steps > 0) {
        idx = (idx + dir + len) % len;
        setSelected(idx);
        playTick(tickRate);
        steps--;
      }
      v *= friction;
      animationRef.current = requestAnimationFrame(step);
    };
    step();
  };

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
    playTick(1);
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

  React.useEffect(() => {
    // Debug: log when navbar renders
    console.log("NFSNavbar rendered, selected:", selected);
  }, [selected]);

  return (
    <nav className="nfs-menu" style={{ border: "2px solid red", overflow:"hidden" }}>
      <div className="nfs-header">Midnight Torque</div>
      <audio ref={audioRef} src="/assets/audio/tick.mp3" preload="auto" />
      <div
        className="nfs-menu-options nfs-menu-3d"
        style={{
          touchAction: "pan-y",
          display: "flex",
          justifyContent: "center",
          transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
          ...(window.innerWidth < 800
            ? { transform: `translateX(calc(50vw - ${(selected + 0.5) * 88}px))` }
            : { transform: "none" })
        }}
        ref={el => {
          // Attach wheel event with passive: false to guarantee preventDefault works
          if (el) {
            el._wheelHandler && el.removeEventListener("wheel", el._wheelHandler);
            el._wheelHandler = function(e) {
              userInteracted.current = true;
              e.preventDefault();
              e.stopPropagation();
              let ticks = Math.round(e.deltaY / 40);
              if (Math.abs(e.deltaY) < 60) ticks = e.deltaY > 0 ? 1 : -1;
              if (ticks === 0) ticks = e.deltaY > 0 ? 1 : -1;
              let steps = Math.abs(ticks);
              let dir = Math.sign(ticks);
              let tickRate = Math.min(2.5, 1 + Math.abs(e.deltaY) / 120);
              if (steps === 1) {
                let next = (selected + dir + len) % len;
                setSelected(next);
                playTick(tickRate);
                navigate(nfsnavitems[next].path);
              } else {
                let animateTicks = (step = 0, curr = selected) => {
                  let next = (curr + dir + len) % len;
                  setSelected(next);
                  playTick(tickRate);
                  navigate(nfsnavitems[next].path);
                  if (step + 1 < steps) {
                    setTimeout(() => animateTicks(step + 1, next), 60 / tickRate);
                  }
                };
                animateTicks();
              }
            };
            el.addEventListener("wheel", el._wheelHandler, { passive: false });
          }
        }}
        onPointerDown={e => {
          userInteracted.current = true;
          dragging.current = true;
          lastX.current = e.clientX;
          velocity.current = 0;
          dragging.currentTime = Date.now();
          dragging.accum = 0;
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }}
        onPointerMove={e => {
          if (!dragging.current) return;
          const dx = e.clientX - lastX.current;
          dragging.accum += dx;
          lastX.current = e.clientX;
          // Animate through each item, speed up tick for fast drags
          let ticks = 0;
          while (Math.abs(dragging.accum) > 40) {
            let dir = dragging.accum > 0 ? -1 : 1;
            ticks += dir;
            dragging.accum -= 40 * Math.sign(dragging.accum);
          }
          if (ticks !== 0) {
            let steps = Math.abs(ticks);
            let dir = Math.sign(ticks);
            let tickRate = Math.min(2.5, 1 + Math.abs(dx) / 30);
            let animateTicks = (step = 0) => {
              setSelected(s => {
                let next = (s + dir + len) % len;
                playTick(tickRate);
                navigate(nfsnavitems[next].path);
                return next;
              });
              if (step + 1 < steps) {
                setTimeout(() => animateTicks(step + 1), 60 / tickRate);
              }
            };
            animateTicks();
          }
          // Velocity for inertia
          velocity.current = dx / (Date.now() - (dragging.lastMoveTime || Date.now()) + 1) * 10;
          dragging.lastMoveTime = Date.now();
        }}
        onPointerUp={e => {
          if (!dragging.current) return;
          dragging.current = false;
          if (Math.abs(velocity.current) > 0.2) {
            animateInertia(velocity.current);
          }
          velocity.current = 0;
        }}
        onPointerLeave={e => {
          if (dragging.current) {
            dragging.current = false;
            if (Math.abs(velocity.current) > 0.2) {
              animateInertia(velocity.current);
            }
            velocity.current = 0;
          }
        }}
      >
        {nfsnavitems.map((opt, idx) => (
          <div
            className={`menu-option menu-3d-item${idx === selected ? " selected" : ""}`}
            key={opt.label}
            tabIndex={0}
            data-idx={idx}
            style={getTransform(idx)}
            onClick={() => {
              userInteracted.current = true;
              handleSelect(idx);
            }}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter")) {
                userInteracted.current = true;
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
