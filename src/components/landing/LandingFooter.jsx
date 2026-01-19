import React from "react";

export default function LandingFooter() {
    return (
        <>
            {/* Bottom Left - Coordinates */}
            <div className="fixed bottom-12 left-12 z-50 flex items-center gap-12 text-white">
                <div className="flex flex-col">
                    <span className="font-landing-mono text-[10px] opacity-40">
                        COORDINATES
                    </span>
                    <span className="font-bebas text-2xl italic">
                        48.2082° N / 16.3738° E
                    </span>
                </div>
                <div className="h-8 w-[1px] bg-primary-new/30"></div>
                <div className="flex flex-col">
                    <span className="font-landing-mono text-[10px] opacity-40">
                        THREAT LEVEL
                    </span>
                    <div className="flex gap-1 mt-1">
                        <div className="w-4 h-2 bg-primary-new"></div>
                        <div className="w-4 h-2 bg-primary-new"></div>
                        <div className="w-4 h-2 bg-primary-new"></div>
                        <div className="w-4 h-2 bg-white/20"></div>
                        <div className="w-4 h-2 bg-white/20"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Right - Engage Button */}
            <div className="fixed bottom-12 right-12 z-50">
                <button
                    className="group relative flex items-center bg-primary-new px-12 py-4 nfs-slant hover:bg-white transition-colors cursor-pointer"
                    onClick={() => console.log("System Engaged")}
                >
                    <span className="font-bebas text-3xl text-black uppercase italic tracking-tighter">
                        ENGAGE_SYSTEM
                    </span>
                    <span className="material-symbols-outlined text-black ml-4 animate-pulse">
                        double_arrow
                    </span>
                </button>
            </div>
        </>
    );
}
