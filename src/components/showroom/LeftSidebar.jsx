import React from "react";

/**
 * Sidebar component for high-level manifests and diagnostics.
 */
export function PartsManifest() {
    return (
        <div className="gritty-panel p-6 border-b-4 border-garage-orange pointer-events-auto">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-garage-orange font-mono">Parts_Manifest</span>
                <span className="material-symbols-outlined text-sm">settings_input_composite</span>
            </div>
            <div className="space-y-2 font-mono">
                {["01_Drive_Train", "02_Aero_Kit", "03_ECU_Remap"].map((part, i) => (
                    <button key={part} className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 hover:border-garage-yellow hover:bg-garage-yellow/5 group flex justify-between items-center transition-none">
                        <span className="text-xs font-bold uppercase group-hover:text-garage-yellow">{part}</span>
                        <span className="text-[9px] opacity-40">{i === 2 ? "STAGE_2" : "INSTALLED"}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function Diagnostics() {
    return (
        <div className="gritty-panel p-6 border-l-4 border-white/20 pointer-events-auto">
            <div className="flex items-center gap-2 mb-4 font-mono">
                <div className="w-1.5 h-1.5 bg-garage-yellow animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase text-garage-yellow">Diagnostic_Stream</span>
            </div>
            <div className="space-y-3">
                <div className="text-[9px] font-mono text-white/50 leading-tight">
                    &gt; ACCESSING_VECTORS...<br />
                    &gt; ADVECTION_SIM_PASS_01<br />
                    &gt; LOAD_SHADERS: GRITTY_METAL
                </div>
                <div className="h-1 bg-white/5 relative">
                    <div className="absolute inset-y-0 left-0 bg-garage-orange w-[78%]"></div>
                </div>
            </div>
        </div>
    );
}
