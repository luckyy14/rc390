import React, { useEffect } from "react";

const SKID_IMAGE = "/icons/skid_mark.png"; // Add this PNG to your public/icons/

const TireSkidTrail = () => {
  useEffect(() => {
    const handleMove = (e) => {
      const mark = document.createElement("img");
      mark.src = SKID_IMAGE;
      mark.style.position = "fixed";
      mark.style.left = `${e.clientX - 8}px`;
      mark.style.top = `${e.clientY - 8}px`;
      mark.style.width = "16px";
      mark.style.height = "16px";
      mark.style.opacity = "0.7";
      mark.style.pointerEvents = "none";
      mark.style.zIndex = "9999";
      mark.style.transition = "opacity 0.7s linear";
      document.body.appendChild(mark);
      setTimeout(() => {
        mark.style.opacity = "0";
        setTimeout(() => mark.remove(), 700);
      }, 10);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return null;
};

export default TireSkidTrail;
