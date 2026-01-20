import React from "react";

/**
 * Interactive 3D hotspot for the Showroom viewer.
 */
export default function ShowroomHotspot({ top, left, label, specs, status }) {
    return (
        <div className="absolute group cursor-crosshair pointer-events-auto" style={{ top, left }}>
            <div className="w-4 h-4 bg-garage-orange/40 border-2 border-garage-orange hotspot-glitch flex items-center justify-center">
                <div className="w-1 h-1 bg-white"></div>
            </div>
            <div className="absolute left-8 top-0 opacity-0 group-hover:opacity-100 transition-none z-50">
                <div className="gritty-panel hard-edge px-4 py-2 border-l-4 border-garage-yellow bg-[#0a0a0a]">
                    <span className="text-xs font-black uppercase text-garage-yellow font-mono">{label}</span>
                    <div className="h-px bg-garage-yellow/30 my-1"></div>
                    <p className="text-[9px] text-white/70 leading-tight font-mono">
                        {specs}<br />STATUS: {status}
                    </p>
                </div>
            </div>
        </div>
    );
}
