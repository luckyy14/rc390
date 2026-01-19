import React from "react";
import { Helmet } from "react-helmet-async";

export default function Display() {
  return (
    <>
      <Helmet>
        <title>Showroom - Gritty Garage HUD</title>
      </Helmet>

      <div className="fixed inset-0 z-0 bg-black font-mono overflow-hidden select-none text-white">
        <div className="absolute inset-0 spotlight"></div>
        <div className="absolute inset-0 industrial-glow"></div>
        <div className="scanline"></div>
        <div className="flex items-center justify-center w-full h-full relative">
          <div className="absolute top-10 left-10 flex flex-col gap-1 opacity-40">
            <span className="text-[10px] font-bold">LIT_ENVIRONMENT: GARAGE_04</span>
            <span className="text-[10px] font-bold">SOURCE: INDUSTRIAL_SPOT_X4</span>
            <span className="text-[10px] font-bold">POST_FX: GRIT_OVERLAY_ON</span>
          </div>
          <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
            <div className="absolute bottom-12 w-[80%] h-12 bg-zinc-900 border-t border-zinc-700 skew-x-[-20deg] opacity-50"></div>
            <div className="w-full h-full bg-center bg-contain bg-no-repeat relative z-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8WQPY5rcR0fX5I7cuTP5JLYYNoFILfPsKQ7-O_sW3tnOmcWcGhl9u9I9dZhFFnypt1-IpZ4cVtmaaBJhSQZAT4QFWaOyZOeOlCPQDmdMGVmj6ZjDGbdx87mgZx0Lq7pqNw118x_46fv_f3R6v9rSIMLcDO5ExNYRYZounEwjTLI4E2z84QtryFdmXeBt2izynFcp-C-pBjDbqxxsfBGrtenzfEWqiT-Vm7YnabBb5UA1vsSRtljISu68L7w7_0DTJUpATWKhMmOJ3')" }}>
              <div className="absolute top-[52%] left-[45%] group cursor-crosshair">
                <div className="size-4 bg-primary/40 border-2 border-primary hotspot-glitch flex items-center justify-center">
                  <div className="size-1 bg-white"></div>
                </div>
                <div className="absolute left-8 top-0 opacity-0 group-hover:opacity-100 transition-none">
                  <div className="gritty-panel hard-edge px-4 py-2 border-l-4 border-accent-yellow">
                    <span className="text-xs font-black uppercase text-accent-yellow">CORE_ENGINE</span>
                    <div className="h-px bg-accent-yellow/30 my-1"></div>
                    <p className="text-[9px] text-white/70 leading-tight">V-SINGLE / 373cc<br />STATUS: CALIBRATED</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-[72%] left-[62%] group cursor-crosshair">
                <div className="size-4 bg-primary/40 border-2 border-primary hotspot-glitch flex items-center justify-center">
                  <div className="size-1 bg-white"></div>
                </div>
                <div className="absolute left-8 top-0 opacity-0 group-hover:opacity-100 transition-none">
                  <div className="gritty-panel hard-edge px-4 py-2 border-l-4 border-accent-yellow">
                    <span className="text-xs font-black uppercase text-accent-yellow">EXHAUST_SYS</span>
                    <div className="h-px bg-accent-yellow/30 my-1"></div>
                    <p className="text-[9px] text-white/70 leading-tight">STAINLESS_STEEL<br />FLOW: OPTIMAL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col h-screen w-full pointer-events-none">
          <header className="flex items-center justify-between px-10 py-8 pointer-events-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center border-2 border-primary bg-primary/10 gritty-panel">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 48 48"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path></svg>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none font-display italic italic">RC_390_SHOWROOM</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 border border-primary/20">UNAUTHORIZED ACCESS</span>
                  <span className="text-[10px] font-bold text-white/40">BUILD: NFSMW_UG_77</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/30 uppercase">Garage Location</p>
                <p className="text-xs font-bold text-white uppercase tracking-widest">Rockport District 09</p>
              </div>
              <button className="px-8 py-4 bg-primary text-black text-xs font-black uppercase tracking-tighter hover:bg-accent-yellow transition-colors hard-edge">
                INIT_RACE_PROTOCOL
              </button>
            </div>
          </header>
          <main className="flex-1 flex overflow-hidden">
            <aside className="w-80 p-10 flex flex-col gap-6 pointer-events-auto">
              <div className="gritty-panel p-6 border-b-4 border-primary">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">Parts_Manifest</span>
                  <span className="material-symbols-outlined text-sm">settings_input_composite</span>
                </div>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 hover:border-accent-yellow hover:bg-accent-yellow/5 group flex justify-between items-center transition-none">
                    <span className="text-xs font-bold uppercase group-hover:text-accent-yellow">01_Drive_Train</span>
                    <span className="text-[9px] opacity-40">INSTALLED</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 hover:border-accent-yellow hover:bg-accent-yellow/5 group flex justify-between items-center transition-none">
                    <span className="text-xs font-bold uppercase group-hover:text-accent-yellow">02_Aero_Kit</span>
                    <span className="text-[9px] opacity-40">CUSTOM</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 hover:border-accent-yellow hover:bg-accent-yellow/5 group flex justify-between items-center transition-none">
                    <span className="text-xs font-bold uppercase group-hover:text-accent-yellow">03_ECU_Remap</span>
                    <span className="text-[9px] text-primary">STAGE_2</span>
                  </button>
                </div>
              </div>
              <div className="gritty-panel p-6 border-l-4 border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-1.5 bg-accent-yellow animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase text-accent-yellow">Diagnostic_Stream</span>
                </div>
                <div className="space-y-3">
                  <div className="text-[9px] font-mono text-white/50 leading-tight">
                    &gt; ACCESSING_VECTORS...<br />
                    &gt; ADVECTION_SIM_PASS_01<br />
                    &gt; LOAD_SHADERS: GRITTY_METAL
                  </div>
                  <div className="h-1 bg-white/5 relative">
                    <div className="absolute inset-y-0 left-0 bg-primary w-[78%]"></div>
                  </div>
                </div>
              </div>
            </aside>
            <div className="flex-1 flex items-end justify-center pb-12">
              <div className="gritty-panel px-12 py-5 flex gap-12 items-center border-b-2 border-primary pointer-events-auto">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-white/30">Architecture</span>
                  <span className="text-xs font-black uppercase text-primary">Hybrid_Raymarch_v4</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="grid grid-cols-3 gap-10">
                  <div>
                    <p className="text-xl font-black leading-none italic">144.0</p>
                    <p className="text-[8px] text-white/40 uppercase font-black">Frame_Rate</p>
                  </div>
                  <div>
                    <p className="text-xl font-black leading-none italic">0.4ms</p>
                    <p className="text-[8px] text-white/40 uppercase font-black">Sync_Rate</p>
                  </div>
                  <div>
                    <p className="text-xl font-black leading-none italic">12.1G</p>
                    <p className="text-[8px] text-white/40 uppercase font-black">VRAM_Usage</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <button className="material-symbols-outlined text-primary hover:text-accent-yellow transition-none">refresh</button>
              </div>
            </div>
            <aside className="w-96 p-10 flex flex-col gap-6 pointer-events-auto">
              <div className="gritty-panel p-8 border-t-4 border-primary overflow-hidden">
                <div className="absolute -right-8 -top-8 opacity-5">
                  <span className="material-symbols-outlined text-9xl">engineering</span>
                </div>
                <h3 className="text-sm font-black uppercase text-primary mb-8 border-b border-primary/20 pb-2 italic">Performance_Analysis</h3>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-bold mb-1">Compression_Ratio</p>
                      <p className="text-2xl font-black italic">12.6:1</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-bold mb-1">Torque_Output</p>
                      <p className="text-2xl font-black italic">37.0 <span className="text-xs text-primary">Nm</span></p>
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 border border-white/5 text-[10px] text-white/60 leading-relaxed font-bold">
                    // REAL-TIME FLUID SIMULATION ACTIVE<br />
                    // ANALYZING CRANKSHAFT ADVECTION VECTORS<br />
                    // PRESSURE GRADIENT: NOMINAL
                  </div>
                </div>
              </div>
              <div className="mt-auto gritty-panel p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-white/40">Visual_Filters</span>
                  <span className="text-green-500 flex items-center gap-1">
                    <span className="size-1 bg-green-500 rounded-full"></span> SYSTEM_STABLE
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button className="aspect-square gritty-panel flex items-center justify-center text-white/40 hover:text-accent-yellow hover:border-accent-yellow transition-none">
                    <span className="material-symbols-outlined">filter_b_and_w</span>
                  </button>
                  <button className="aspect-square gritty-panel flex items-center justify-center text-white/40 hover:text-accent-yellow hover:border-accent-yellow transition-none">
                    <span className="material-symbols-outlined">texture</span>
                  </button>
                  <button className="aspect-square gritty-panel flex items-center justify-center text-white/40 hover:text-accent-yellow hover:border-accent-yellow transition-none">
                    <span className="material-symbols-outlined">grain</span>
                  </button>
                  <button className="aspect-square gritty-panel flex items-center justify-center text-white/40 hover:text-accent-yellow hover:border-accent-yellow transition-none">
                    <span className="material-symbols-outlined">noise_aware</span>
                  </button>
                </div>
              </div>
            </aside>
          </main>
          <footer className="px-10 py-6 flex items-center justify-between border-t border-white/10 bg-black/80 pointer-events-auto">
            <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-primary">Subsystem_Worker</span>
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
                <span className="text-[9px] font-black text-white/40 uppercase">Resource_Drain</span>
                <div className="w-48 h-2 bg-white/5 border border-white/10">
                  <div className="h-full bg-accent-yellow w-[42%] shadow-[0_0_10px_#ffea00]"></div>
                </div>
              </div>
              <button className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-primary text-white/40 hover:text-primary transition-none gritty-panel">
                <span className="material-symbols-outlined">terminal</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
