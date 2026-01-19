import React from "react";

export default function LandingNav() {
    return (
        <nav className="fixed top-1/2 right-12 -translate-y-1/2 z-50 flex flex-col items-end gap-6">
            <a className="group flex items-center gap-4" href="#">
                <span className="font-bebas text-xl opacity-0 group-hover:opacity-100 snap-transition text-white">
                    AERO
                </span>
                <div className="w-3 h-3 border-2 border-primary-new group-hover:bg-primary-new snap-transition"></div>
            </a>
            <a className="group flex items-center gap-4" href="#">
                <span className="font-bebas text-xl opacity-0 group-hover:opacity-100 snap-transition text-white">
                    DYNAMICS
                </span>
                <div className="w-3 h-3 border-2 border-primary-new group-hover:bg-primary-new snap-transition"></div>
            </a>
            <a className="group flex items-center gap-4" href="#">
                <span className="font-bebas text-xl text-primary-new snap-transition">
                    CORE
                </span>
                <div className="w-8 h-3 bg-primary-new snap-transition"></div>
            </a>
        </nav>
    );
}
