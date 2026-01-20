import React, { useState, useMemo } from "react";
import { Rc390Viewer } from "../3d/models/rc390";
import DisplayPlinth from "../components/3d/rc390/DisplayPlinth";
import { Helmet } from "react-helmet-async";
import ShowroomHeader from "../components/showroom/ShowroomHeader";
import ShowroomFooter from "../components/showroom/ShowroomFooter";
import ShowroomStats from "../components/showroom/ShowroomStats";
import ShowroomHotspot from "../components/showroom/ShowroomHotspot";
import { PartsManifest, Diagnostics } from "../components/showroom/LeftSidebar";
import { PerformanceAnalysis, VisualFilters } from "../components/showroom/RightSidebar";

/**
 * Refactored Showroom Page.
 * Modular and focused components with 3D hotspots and HUD UI.
 */
export default function Showroom() {
    const [showUI, setShowUI] = useState(false);
    const [showControls, setShowControls] = useState(false);

    // Memoize scene elements to prevent jittering on HUD state changes
    const plinth = useMemo(() => <DisplayPlinth />, []);

    return (
        <div className="fixed inset-0 z-0 bg-background-dark font-mono select-none text-white overflow-hidden">
            <Helmet>
                <title>Showroom - Gritty Garage HUD</title>
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Helmet>

            {/* Background FX Layer */}
            <div className="absolute inset-0 spotlight"></div>
            <div className="absolute inset-0 industrial-glow"></div>
            <div className="scanline"></div>

            {/* 3D Scene Layer */}
            <div className="flex items-center justify-center w-full h-full relative">
                {/* HUD Environment Labels */}
                <div className="absolute top-10 left-10 flex flex-col gap-1 opacity-40 pointer-events-none z-10">
                    <span className="text-[10px] font-bold uppercase">Lit_Environment: Garage_04</span>
                    <span className="text-[10px] font-bold uppercase">Source: Industrial_Spot_X4</span>
                    <span className="text-[10px] font-bold uppercase">Post_FX: Grit_Overlay_On</span>
                </div>

                <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
                    {/* interactive 3D Model */}
                    <div className="w-full h-full relative z-10">
                        <Rc390Viewer
                            showCrosshair
                            showUI={showUI}
                            showControls={showControls}
                            sceneElements={plinth}
                            enableRightClick={false}
                        />

                        {/* Interactive Hotspots */}
                        <ShowroomHotspot
                            top="62%" left="50%"
                            label="CORE_ENGINE"
                            specs="SINGLE CYLINDER / 373cc"
                            status="CALIBRATED"
                        />
                        <ShowroomHotspot
                            top="62%" left="36%"
                            label="EXHAUST_SYS"
                            specs="STAINLESS_STEEL"
                            status="OPTIMAL"
                        />
                    </div>
                </div>
            </div>

            {/* UI Overlay Layer */}
            <div className="absolute inset-0 z-20 flex flex-col h-screen w-full pointer-events-none">
                <ShowroomHeader />

                <main className="flex-1 flex overflow-hidden w-full px-10">
                    {/* Navigation/Manifest Sidebar */}
                    <aside className="w-80 flex flex-col gap-6">
                        <PartsManifest />
                        <Diagnostics />
                    </aside>

                    {/* Central HUD Stats */}
                    <ShowroomStats />

                    {/* Performance/Filters Sidebar */}
                    <aside className="w-75 flex flex-col gap-6">
                        <PerformanceAnalysis />
                        <VisualFilters
                            showUI={showUI}
                            setShowUI={setShowUI}
                            showControls={showControls}
                            setShowControls={setShowControls}
                        />
                    </aside>
                </main>

                <ShowroomFooter />
            </div>
        </div>
    );
}
