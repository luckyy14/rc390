// src/layouts/LenisProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext({ scroll: 0, lenis: null });

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }) {
  const [scroll, setScroll] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.35,
      smooth: true,
      direction: "vertical",
      gestureOrientation: "vertical",
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      setScroll(lenis.scroll);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ scroll, lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}
