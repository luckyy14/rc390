import React from "react";

/**
 * A reusable panel with the "gritty-panel" aesthetic.
 */
export default function HudPanel({ children, className = "", borderSide = "" }) {
    // borderSide can be "border-t-4", "border-l-4", etc.
    const borderStyle = borderSide ? `${borderSide} border-garage-orange` : "border border-white/10";

    return (
        <div className={`gritty-panel p-6 ${borderStyle} relative overflow-hidden ${className}`}>
            {children}
        </div>
    );
}
