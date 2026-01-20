import React from "react";

/**
 * A reusable button with the HUD aesthetic and hover effects.
 */
export default function HudButton({ children, onClick, className = "", variant = "primary" }) {
    const baseStyles = "px-8 py-4 text-xs font-black uppercase tracking-tighter transition-colors hard-edge pointer-events-auto";
    const variants = {
        primary: "bg-garage-orange text-black hover:bg-garage-yellow",
        outline: "bg-white/5 border border-white/10 hover:border-garage-yellow hover:bg-garage-yellow/5 text-white/70",
        ghost: "bg-transparent text-white/40 hover:text-garage-orange",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
