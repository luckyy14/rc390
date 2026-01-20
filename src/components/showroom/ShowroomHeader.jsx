import React from "react";
import { HUD_COLORS, SYSTEM_STRINGS } from "../../constants/hud";

/**
 * Top header for the Showroom page.
 */
export default function ShowroomHeader() {
    return (
        <header className="flex items-center justify-between px-10 py-8 pointer-events-auto">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center border-2 border-garage-orange bg-garage-orange/10 gritty-panel">
                    <svg className="w-8 h-8 text-garage-orange" fill="currentColor" viewBox="0 0 48 48"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path></svg>
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none font-sans italic">RC_390_SHOWROOM</h1>
                    <div className="flex items-center gap-3 mt-1 font-mono">
                        <span className="text-[10px] font-bold text-garage-orange bg-garage-orange/10 px-2 py-0.5 border border-garage-orange/20">UNAUTHORIZED ACCESS</span>
                        <span className="text-[10px] font-bold text-white/40">{SYSTEM_STRINGS.BUILD}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 font-mono">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-white/30 uppercase">Garage Location</p>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Rockport District 09</p>
                </div>
                <button className="px-8 py-4 bg-garage-orange text-black text-xs font-black uppercase tracking-tighter hover:bg-garage-yellow transition-colors hard-edge">
                    INIT_RACE_PROTOCOL
                </button>
            </div>
        </header>
    );
}
