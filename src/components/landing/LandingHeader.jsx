import React from "react";

export default function LandingHeader() {
    return (
        <div className="fixed top-12 left-12 z-50 flex flex-col gap-0 pointer-events-none">
            <div className="bg-primary-new px-4 py-1 nfs-slant">
                <span className="font-bebas text-2xl text-black uppercase italic">
                    BLACKLIST // 15
                </span>
            </div>
            <div className="bg-black/80 backdrop-blur-sm border-l-4 border-primary-new px-4 py-2 mt-2">
                <div className="flex flex-col">
                    <span className="font-landing-mono text-[10px] text-primary-new">
                        STATUS: MOST WANTED
                    </span>
                    <span className="font-landing-mono text-[9px] opacity-50 tracking-widest uppercase text-white">
                        ID_USER: KTM_PILOT_01
                    </span>
                </div>
            </div>
        </div>
    );
}
