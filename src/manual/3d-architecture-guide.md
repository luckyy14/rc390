# Intuitive 3D Website Architecture Guide

This guide provides a practical implementation plan for the 3D website takeaways, using components, hooks, routes, and HOCs for a scalable, maintainable codebase.

---

## 1. Layered Architecture

### ThreeDLayout Component
- Provides a background 3D canvas and a foreground HTML/UI layer.
- Usage: Wrap your app or page content.

```jsx
// src/layouts/ThreeDLayout.jsx
export default function ThreeDLayout({ canvas, children }) {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: -10, pointerEvents: "none" }}>{canvas}</div>
      <div style={{ position: "relative", zIndex: 0 }}>{children}</div>
    </div>
  );
}
```

---

## 2. Dynamic 3D Scene Routing

### CanvasSelector Component
- Maps routes to 3D scenes using an object.
- Usage: Pass as `canvas` prop to `ThreeDLayout`.

```jsx
import { useLocation } from "react-router-dom";
import ParallaxCardsContainer from "../components/ParallaxCardsContainer";
import { Rc390Viewer } from "../3d/models/rc390";

const canvasMap = {
  "/": <ParallaxCardsContainer />,
  "/display": <Rc390Viewer />,
  // Add more routes as needed
};

export function CanvasSelector() {
  const location = useLocation();
  return canvasMap[location.pathname] || null;
}
```

---

## 3. Sectioned Content & Scroll Anchors

### Section Component & useScrollAnchor Hook

```jsx
// src/components/Section.jsx
export default function Section({ id, children }) {
  return <section id={id} tabIndex={-1}>{children}</section>;
}

// src/hooks/useScrollAnchor.js
import { useEffect } from "react";
export function useScrollAnchor(id) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [id]);
}
```

---

## 4. Animated & Dynamic UI

### useAnimatedEntrance Hook

```jsx
// src/hooks/useAnimatedEntrance.js
import { useEffect, useRef } from "react";
export function useAnimatedEntrance(className = "fade-in") {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) ref.current.classList.add(className);
  }, []);
  return ref;
}
```

---

## 5. Accessibility & Semantics

- Use semantic HTML tags (`section`, `nav`, `button`).
- Add `aria-label` and `role` attributes where needed.
- Use visually hidden text for screen readers.

---

## 6. Theming & Branding

### ThemeProvider Component

```jsx
// src/layouts/ThemeProvider.jsx
import { createContext, useContext } from "react";
const ThemeContext = createContext();
export function ThemeProvider({ children, theme }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
```

---

## 7. Border & Visual Framing

### AnimatedBorder Component

```jsx
// src/components/AnimatedBorder.jsx
export default function AnimatedBorder() {
  return (
    <>
      <div className="border-top" />
      <div className="border-bottom" />
      <div className="border-left" />
      <div className="border-right" />
    </>
  );
}
```
Add CSS for animation and positioning.

---

## 8. HOC for Overlay Panels

### withOverlay HOC

```jsx
// src/hocs/withOverlay.jsx
import React from "react";
export function withOverlay(Component, Overlay) {
  return function Wrapped(props) {
    return (
      <>
        <Component {...props} />
        <Overlay />
      </>
    );
  };
}
```

---

## 9. Example App Integration

```jsx
import ThreeDLayout from "./layouts/ThreeDLayout";
import { CanvasSelector } from "./layouts/CanvasSelector";
import AnimatedBorder from "./components/AnimatedBorder";
import Navbar from "./ui/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThreeDLayout canvas={<CanvasSelector />}>
      <AnimatedBorder />
      <Navbar />
      <Routes>
        {/* ...routes */}
      </Routes>
    </ThreeDLayout>
  );
}
```

---

This modular approach enables you to implement all major 3D website takeaways using reusable components, hooks, HOCs, and route-based logic.
