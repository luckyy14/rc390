import React from "react";

/**
 * Performance statistics bar for the Showroom page.
 */
export default function ShowroomStats() {
    return (
        <div className="flex-1 flex items-end justify-center pb-12">
            <div className="gritty-panel px-12 py-5 flex gap-12 items-center border-b-2 border-garage-orange pointer-events-auto">
                <div className="flex flex-col font-mono">
                    <span className="text-[9px] font-black uppercase text-white/30">Architecture</span>
                    <span className="text-xs font-black uppercase text-garage-orange">Hybrid_Raymarch_v4</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="grid grid-cols-3 gap-10 font-mono">
                    <div>
                        <p className="text-xl font-black leading-none italic">144.0</p>
                        <p className="text-[8px] text-white/40 uppercase font-black">Frame_Rate</p>
                    </div>
                    <div>
                        <p className="text-xl font-black leading-none italic">0.4ms</p>
                        <p className="text-[8px] text-white/40 uppercase font-black">Sync_Rate</p>
                    </div>
                    <div>
                        <p className="text-xl font-black leading-none italic">12.1G</p>
                        <p className="text-[8px] text-white/40 uppercase font-black">VRAM_Usage</p>
                    </div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <button className="material-symbols-outlined text-garage-orange hover:text-garage-yellow transition-none">refresh</button>
            </div>
        </div>
    );
}
