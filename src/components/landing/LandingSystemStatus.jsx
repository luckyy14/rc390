import React from "react";

export default function LandingSystemStatus() {
    return (
        <div className="fixed top-12 right-12 z-50 text-right pointer-events-none">
            <div className="flex flex-col gap-1">
                <span className="font-bebas text-4xl italic text-white/90">
                    00:44:28
                </span>
                <span className="font-landing-mono text-[10px] text-primary-new">
                    SYSTEM_UPTIME_STABLE
                </span>
                <div className="flex gap-2 justify-end mt-4">
                    <div className="w-12 h-1 bg-primary-new"></div>
                    <div className="w-8 h-1 bg-white/20"></div>
                    <div className="w-4 h-1 bg-white/20"></div>
                </div>
            </div>
        </div>
    );
}
