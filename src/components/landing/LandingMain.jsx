import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export default function LandingMain() {
    const navigate = useNavigate();
    const containerRef = useRef();
    const bikeCardRef = useRef();
    const engineCardRef = useRef();

    // Progress for each card expansion
    const [progress, setProgress] = useState({ bike: 0, engine: 0 });
    const [hovered, setHovered] = useState(null); // 'bike' or 'engine'

    useEffect(() => {
        const handleWheel = (e) => {
            if (!hovered) return;

            // If we are hovering a card, we hijack the wheel to expand
            e.preventDefault();

            const delta = e.deltaY * 0.001;
            setProgress(prev => {
                const nextVal = Math.min(1.1, Math.max(0, prev[hovered] + delta));

                // Navigation Trigger
                if (nextVal > 0.95) {
                    const path = hovered === 'bike' ? "/showroom" : "/references";
                    navigate(path);
                }

                return { ...prev, [hovered]: nextVal };
            });
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [hovered, navigate]);

    // Animate cards based on progress
    useEffect(() => {
        if (bikeCardRef.current) {
            gsap.to(bikeCardRef.current, {
                scale: 1 + progress.bike * 1.5,
                opacity: 1 - progress.engine * 0.5, // Dim other card
                zIndex: progress.bike > 0 ? 50 : 1,
                rotateX: progress.bike * -5,
                duration: 0.1,
                overwrite: 'auto'
            });
            gsap.to(bikeCardRef.current.querySelector("img"), {
                scale: 1 + progress.bike * 0.5,
                y: progress.bike * -50,
                duration: 0.1,
                overwrite: 'auto'
            });
        }
    }, [progress.bike, progress.engine]);

    useEffect(() => {
        if (engineCardRef.current) {
            gsap.to(engineCardRef.current, {
                scale: 1 + progress.engine * 1.5,
                opacity: 1 - progress.bike * 0.5, // Dim other card
                zIndex: progress.engine > 0 ? 50 : 1,
                rotateX: progress.engine * -5,
                duration: 0.1,
                overwrite: 'auto'
            });
            gsap.to(engineCardRef.current.querySelector("img"), {
                scale: 1 + progress.engine * 0.5,
                y: progress.engine * -50,
                duration: 0.1,
                overwrite: 'auto'
            });
        }
    }, [progress.engine, progress.bike]);

    const Card = ({ id, refObj, title, unit, tags, img, progressVal }) => (
        <div
            ref={refObj}
            className={`group relative shrink-0 w-full max-w-4xl aspect-[21/9] bg-zinc-900 border-4 ${hovered === id ? 'border-primary-new' : 'border-white/5'} overflow-hidden snap-start cursor-pointer xerox-noise transition-colors duration-300 ${id % 2 === 0 ? 'nfs-slant-reverse' : 'nfs-slant'}`}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => {
                setHovered(null);
                // Optional: Recovers expansion on leave? User might want it to stick or reset.
                // For now, let's keep it sticking so they can "scroll back" or finish.
            }}
        >
            <img
                alt={title}
                className="w-full h-full object-cover grayscale brightness-75 contrast-125"
                src={img}
            />
            {/* Parallax Overlay Mock/Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            {/* Info */}
            <div className="absolute bottom-10 left-10">
                <span className="font-landing-mono text-[10px] text-primary-new block mb-2">{unit}</span>
                <h2 className="font-bebas text-6xl text-white tracking-widest uppercase italic">{title}</h2>
                <p className="font-landing-mono text-[10px] text-white/40 uppercase mt-2">{tags}</p>
            </div>

            {/* Expansion Indicator */}
            {progressVal > 0 && (
                <div className="absolute top-0 left-0 h-1 bg-primary-new transition-all duration-100" style={{ width: `${progressVal * 100}%` }} />
            )}
        </div>
    );

    return (
        <main className="relative h-screen w-full flex items-center px-24 overflow-hidden">
            <div className="flex flex-col items-start w-full max-w-5xl gap-12 snap-transition hover:translate-x-2">
                <div className="group relative flex items-start gap-8 w-full">
                    {/* Left Text Block */}
                    <div className="flex flex-col items-start z-20">
                        <div className="bg-black/40 p-2 -ml-2 mb-2">
                            <span className="font-landing-mono text-[10px] text-primary-new/70">
                        // SURVEILLANCE_FILE_09F
                            </span>
                        </div>
                        <h1 className="font-bebas text-[80px] tall-text uppercase italic leading-none text-white">
                            NETWORK <span className="text-primary-new">NODES</span>
                        </h1>
                    </div>

                    {/* Vertical Scroll Navbar */}
                    <div ref={containerRef} className="flex-1 flex flex-col gap-12 overflow-y-auto pb-24 no-scrollbar snap-y snap-mandatory pr-4">

                        <Card
                            id="bike"
                            refObj={bikeCardRef}
                            title="THE RIDE"
                            unit="// UNIT_01"
                            tags="DYNAMICS // AERODYNAMICS // STYLING"
                            img="https://lh3.googleusercontent.com/aida-public/AB6AXuBS0Yan6yTjq4ncDAPNByWnwRbSUCOng4g5uAQhF0UNotBU9urNxrccYeHVvVCv0Oj4UPrDeuSxSPlKpCQXx-YVZnhMu5ImjFx8jtGc_0EwXgpskGZf2KQUiLUythTx7xbYxq89eYzZ_X4JHKdH7k1bPYKsx2q1KDx3bxlwinM7Fz75nmJeDQFA8kBBLkPXkcEwUXxVvZgGT6gw_Imm9YgUM3hIk5kLFwb3rnxSDCNTtqECtBGABqDkK_ZVjRB6-RYIvsbzxeqw0UGU"
                            progressVal={progress.bike}
                        />

                        <Card
                            id="engine"
                            refObj={engineCardRef}
                            title="THE ENGINE"
                            unit="// CORE_02"
                            tags="MORPHOLOGY // DISRUPTION // PARTICLES"
                            img="https://lh3.googleusercontent.com/aida-public/AB6AXuCzOOgRQmlh7PGMnM4KOOfzN5G61dv_6Iy6LNHDIV9vB9vwO2OImtzygUnDy_nqBIgT3ej_5Efms6aY8j2tbM-0LMhu0xlM3LOiKa_NfK75shFuV5BzsFt28pF4KNsebjdXc0TblktNJTHPfJvbqu3fCs1bGF_6iFYdo2EarA35X3VEPjHgNbozxNJ_SQ1D00OknlHLOa2V14PPIPU80c6xGBn-s5uI5o7NfeiPjoMVR6pslhE2yy1Mpgk7lcjRvRGzxWS_GsBC2Crq"
                            progressVal={progress.engine}
                        />

                        {/* Placeholder for future cards */}
                        <div className="shrink-0 w-full max-w-4xl aspect-[21/9] flex items-center justify-center border-4 border-dashed border-white/10 opacity-30 snap-start">
                            <span className="font-landing-mono text-xs uppercase tracking-[0.5em]">[ NODE_LOCKED ]</span>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
