import React from "react";

/**
 * Bottom status footer for the Showroom page.
 */
export default function ShowroomFooter() {
    return (
        <footer className="px-10 py-6 flex items-center justify-between border-t border-white/10 bg-black/80 pointer-events-auto">
            <div className="flex items-center gap-10 font-mono">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-garage-orange">Subsystem_Worker</span>
                    <span className="text-xs font-bold text-white uppercase italic">GPU_INSTANCING_ENABLED</span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/40">Encrypted_Link</span>
                    <span className="text-xs font-bold text-white">0x4F_SECURE_TUNNEL</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-black text-white/40 uppercase font-mono">Resource_Drain</span>
                    <div className="w-48 h-2 bg-white/5 border border-white/10">
                        <div className="h-full bg-garage-yellow w-[42%] shadow-[0_0_10px_#ffea00]"></div>
                    </div>
                </div>
                <button className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-garage-orange text-white/40 hover:text-garage-orange transition-none gritty-panel">
                    <span className="material-symbols-outlined">terminal</span>
                </button>
            </div>
        </footer>
    );
}
