import React from "react";

export default function LandingBackground() {
    return (
        <>
            <div className="fixed inset-0 micro-shake pointer-events-none -z-10">
                <div className="absolute inset-0 z-0 bg-asphalt">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')]"></div>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#FF6B00_1px,transparent_1px)] [background-size:60px_60px]"></div>
                    <div className="scanline-vertical"></div>
                </div>
            </div>

            <div className="fixed left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none opacity-20 z-0">
                <span className="font-bebas text-6xl tracking-widest text-white whitespace-nowrap uppercase">
                    UNDERGROUND_RACE_NETWORK
                </span>
            </div>

            <div className="fixed inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </>
    );
}
