import React from "react";

export default function LandingMain() {
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
                        <h1 className="font-bebas text-[120px] tall-text uppercase italic leading-none snap-transition group-hover:text-primary-new text-white">
                            THE RIDE
                        </h1>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-24 h-[2px] bg-primary-new"></div>
                            <span className="font-landing-mono text-xs uppercase tracking-[0.4em] opacity-60 text-white">
                                KTM RC 390 GEN.3
                            </span>
                        </div>
                        <div className="mt-12 bg-black/60 backdrop-blur-md p-6 border-l-2 border-primary-new nfs-slant-reverse max-w-xs">
                            <p className="font-landing-mono text-[11px] leading-relaxed uppercase opacity-80 text-white">
                                High-contrast surveillance mode active. Xerographic noise
                                processing initialized. Concrete impact resistance: 100%.
                            </p>
                        </div>
                    </div>

                    {/* Right Image Block */}
                    <div className="relative flex-1 -ml-24 mt-12 group-hover:scale-[1.03] snap-transition z-10">
                        <div className="xerox-noise relative w-full aspect-[16/9] bg-zinc-900 border-8 border-white/5 overflow-hidden -rotate-2 transform-gpu">
                            <img
                                alt="The Ride"
                                className="w-full h-full object-cover grayscale brightness-75 contrast-125"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS0Yan6yTjq4ncDAPNByWnwRbSUCOng4g5uAQhF0UNotBU9urNxrccYeHVvVCv0Oj4UPrDeuSxSPlKpCQXx-YVZnhMu5ImjFx8jtGc_0EwXgpskGZf2KQUiLUythTx7xbYxq89eYzZ_X4JHKdH7k1bPYKsx2q1KDx3bxlwinM7Fz75nmJeDQFA8kBBLkPXkcEwUXxVvZgGT6gw_Imm9YgUM3hIk5kLFwb3rnxSDCNTtqECtBGABqDkK_ZVjRB6-RYIvsbzxeqw0UGU"
                            />
                            <div className="absolute top-4 left-4 border border-primary-new/40 px-2 py-1">
                                <span className="font-landing-mono text-[8px] text-primary-new">
                                    REC ● 60FPS
                                </span>
                            </div>
                            <div className="absolute bottom-4 right-4 text-primary-new opacity-50">
                                <span className="material-symbols-outlined text-4xl">
                                    filter_center_focus
                                </span>
                            </div>
                        </div>

                        {/* Floating Manual Card */}
                        <div className="absolute -bottom-24 -right-12 w-64 xerox-noise bg-black/90 p-1 border border-white/10 rotate-3 snap-transition group-hover:rotate-0">
                            <img
                                alt="Technical"
                                className="w-full grayscale opacity-40 brightness-50"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzOOgRQmlh7PGMnM4KOOfzN5G61dv_6Iy6LNHDIV9vB9vwO2OImtzygUnDy_nqBIgT3ej_5Efms6aY8j2tbM-0LMhu0xlM3LOiKa_NfK75shFuV5BzsFt28pF4KNsebjdXc0TblktNJTHPfJvbqu3fCs1bGF_6iFYdo2EarA35X3VEPjHgNbozxNJ_SQ1D00OknlHLOa2V14PPIPU80c6xGBn-s5uI5o7NfeiPjoMVR6pslhE2yy1Mpgk7lcjRvRGzxWS_GsBC2Crq"
                            />
                            <div className="p-4">
                                <span className="font-bebas text-xl text-primary-new uppercase">
                                    THE MANUAL
                                </span>
                                <p className="font-landing-mono text-[9px] opacity-40 uppercase text-white">
                                    DECRYPTED_SCHEMATICS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
