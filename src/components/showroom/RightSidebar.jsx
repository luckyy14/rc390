import React, { useRef, useState } from "react";

/**
 * Sidebar component for performance metrics and visual filters.
 */
export function PerformanceAnalysis() {
    return (
        <div className="gritty-panel p-8 border-t-4 border-garage-orange overflow-hidden relative pointer-events-auto">
            <div className="absolute -right-8 -top-8 opacity-5">
                <span className="material-symbols-outlined text-9xl">engineering</span>
            </div>
            <h3 className="text-sm font-black uppercase text-garage-orange mb-8 border-b border-garage-orange/20 pb-2 italic font-mono">Performance_Analysis</h3>
            <div className="space-y-8 font-mono">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[9px] text-white/40 uppercase font-bold mb-1">Compression_Ratio</p>
                        <p className="text-2xl font-black italic">12.6:1</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-white/40 uppercase font-bold mb-1">Torque_Output</p>
                        <p className="text-2xl font-black italic">37.0 <span className="text-xs text-garage-orange">Nm</span></p>
                    </div>
                </div>
                <div className="bg-black/40 p-4 border border-white/5 text-[10px] text-white/60 leading-relaxed font-bold">
                    // REAL-TIME FLUID SIMULATION ACTIVE<br />
                    // ANALYZING CRANKSHAFT ADVECTION VECTORS<br />
                    // PRESSURE GRADIENT: NOMINAL
                </div>
            </div>
        </div>
    );
}

export function VisualFilters({ showUI, setShowUI, showControls, setShowControls }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const filters = [
        { icon: "noise_aware", label: "Exhaust" },
    ];

    const playExhaust = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio("/assets/audio/mixkit-motorcycle-starts-the-ride-2731.wav");
            audioRef.current.onended = () => setIsPlaying(false);
        }

        // Reset and play
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
        setIsPlaying(true);
    };

    return (
        <div className="mt-auto gritty-panel p-4 flex flex-col gap-4 pointer-events-auto">
            <div className="flex justify-between items-center text-[10px] font-black uppercase font-mono">
                <span className="text-white/40">Visual_Filters</span>
                <span className="text-green-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full"></span> SYSTEM_STABLE
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {filters.map((f) => (
                    <button
                        key={f.icon}
                        onClick={playExhaust}
                        className={`aspect-square gritty-panel flex items-center justify-center transition-none ${isPlaying ? 'text-garage-orange border-garage-orange bg-garage-orange/10' : 'text-white/40 hover:text-garage-yellow hover:border-garage-yellow'}`}
                        title={f.label}
                    >
                        <span className="material-symbols-outlined text-sm">{f.icon}</span>
                    </button>
                ))}

                {/* HUD Toggle */}
                <button
                    onClick={() => setShowUI(!showUI)}
                    className={`aspect-square gritty-panel flex items-center justify-center transition-none ${showUI ? 'text-garage-orange border-garage-orange bg-garage-orange/10' : 'text-white/40 border-white/10'}`}
                    title="Toggle HUD UI"
                >
                    <span className="material-symbols-outlined text-sm">{showUI ? 'visibility' : 'visibility_off'}</span>
                </button>

                {/* Controls Toggle */}
                <button
                    onClick={() => setShowControls(!showControls)}
                    className={`aspect-square gritty-panel flex items-center justify-center transition-none ${showControls ? 'text-garage-orange border-garage-orange bg-garage-orange/10' : 'text-white/40 border-white/10'}`}
                    title="Toggle Bike Controls"
                >
                    <span className="material-symbols-outlined text-sm">{showControls ? 'sports_esports' : 'videogame_asset_off'}</span>
                </button>
            </div>
        </div>
    );
}
