import React from "react";
import { HUD_COLORS } from "../../../constants/hud";

/**
 * UI Overlay for the Rc390Viewer.
 * Includes scale/zoom sliders and controls documentation.
 */
export default function ViewerUI({ showUI, showControls, scale, setScale, zoom, setZoom }) {
    if (!showUI && !showControls) return null;

    return (
        <>
            {/* Range Controls */}
            {showUI && (
                <div
                    className="absolute top-6 left-6 z-10 bg-[rgba(26,26,26,0.85)] p-4 md:p-6 rounded-lg shadow-lg border border-white/10 min-w-[260px]"
                    style={{
                        fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
                        color: HUD_COLORS.TEXT_MAIN,
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <ControlSlider
                        label="Scale"
                        value={scale}
                        min={0.2} max={3}
                        onChange={setScale}
                        icon={<rect x="2" y="8" width="16" height="4" rx="2" fill={HUD_COLORS.PRIMARY} />}
                    />
                    <ControlSlider
                        label="Zoom"
                        value={zoom}
                        min={0.5} max={3}
                        onChange={setZoom}
                        icon={<circle cx="10" cy="10" r="8" stroke={HUD_COLORS.PRIMARY} strokeWidth="2" fill="#1A1A1A" />}
                    />
                </div>
            )}

            {/* Bike Controls Documentation */}
            {showControls && (
                <div
                    className="absolute top-6 right-6 z-10 bg-[rgba(26,26,26,0.85)] p-4 md:p-6 rounded-lg shadow-lg border border-white/10"
                    style={{
                        fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
                        color: HUD_COLORS.TEXT_MAIN,
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" stroke={HUD_COLORS.PRIMARY} strokeWidth="2" fill="none" />
                            <path d="M10 2 L10 18 M2 10 L18 10" stroke={HUD_COLORS.PRIMARY} strokeWidth="2" />
                        </svg>
                        <span className="font-bold tracking-wide">Bike Controls</span>
                    </div>
                    <div className="text-sm space-y-1">
                        <ControlKey keyName="W" label="Forward (X-axis)" />
                        <ControlKey keyName="S" label="Backward (X-axis)" />
                        <ControlKey keyName="A" label="Turn Left (Z-axis)" />
                        <ControlKey keyName="D" label="Turn Right (Z-axis)" />
                        <ControlKey keyName="R" label="Reset (ALL)" />
                    </div>
                </div>
            )}
        </>
    );
}

function ControlSlider({ label, value, min, max, onChange, icon }) {
    return (
        <div className={`flex items-center gap-3 ${label === "Scale" ? "mb-4" : ""}`}>
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                {icon}
                {label === "Scale" && <rect x="7" y="6" width="6" height="8" rx="2" fill="#1A1A1A" />}
            </svg>
            <label className="font-bold tracking-wide min-w-[60px]">{label}</label>
            <input
                type="range"
                min={min} max={max} step="0.01"
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="viewer-slider"
                style={{
                    width: 120,
                    accentColor: HUD_COLORS.PRIMARY,
                }}
            />
            <span className="ml-3 font-bold">{value.toFixed(2)}</span>
        </div>
    );
}

function ControlKey({ keyName, label }) {
    return (
        <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#333] rounded text-xs font-mono">{keyName}</kbd>
            <span>{label}</span>
        </div>
    );
}
