import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PetrolLogo from '../components/3d/PetrolLogo';

const References = () => {

    const [shapeIndex, setShapeIndex] = React.useState(0);
    const shapes = [
        { id: 'twitter', text: 'X', label: 'X / Twitter' },
        { id: 'portfolio', text: 'LB', label: 'Portfolio' },
        { id: 'ktm', text: 'KTM', label: 'KTM Ready' }
    ];

    const currentShape = shapes[shapeIndex];

    const handleNext = () => {
        setShapeIndex((prev) => (prev + 1) % shapes.length);
    };

    const handlePrev = () => {
        setShapeIndex((prev) => (prev - 1 + shapes.length) % shapes.length);
    };

    useEffect(() => {
        const scrambleElements = document.querySelectorAll('.scramble');
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        scrambleElements.forEach(el => {
            const originalText = el.innerText;
            let iterations = 0;
            const interval = setInterval(() => {
                el.innerText = originalText.split('')
                    .map((char, index) => {
                        if (index < iterations) return originalText[index];
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join('');
                if (iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    }, [shapeIndex]); // Re-scramble on change

    return (
        <>
            <Helmet>
                <title>Fuel Core - Volatile Engine Morph | KTM RC 390</title>
                <meta name="theme-color" content="#0a0a0a" />
            </Helmet>

            <div className="bg-asphalt text-white font-mono overflow-hidden h-screen w-full relative">
                {/* Grain & Scanlines */}
                <div className="grain fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.15] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="scanline w-full h-[100px] z-10 absolute bottom-full animate-[scanline_8s_linear_infinite] bg-gradient-to-t from-transparent via-primary/5 to-transparent opacity-10"></div>

                <style>{`
                    @keyframes scanline {
                        0% { bottom: 100%; }
                        100% { bottom: -100px; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-20px) scale(1.02); }
                    }
                    @keyframes pulse-slow {
                         0%, 100% { opacity: 0.2; }
                         50% { opacity: 0.5; }
                    }
                `}</style>

                <main className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 radial-glow pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.15)_0%,transparent_70%)]"></div>

                    {/* Top Right Status */}
                    <div className="absolute top-24 right-10 flex flex-col items-end space-y-4 pointer-events-none z-20">
                        <div className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                            <span className="text-primary mr-2">SYS_STATUS:</span>
                            <span className="animate-pulse">STABLE</span>
                        </div>
                        <div className="text-[10px] tracking-[0.1em] text-right">
                            <div className="flex justify-end items-baseline space-x-2">
                                <span className="text-gray-500">PARTICLES</span>
                                <span className="text-xl font-bold font-mono scramble">2,491,032</span>
                            </div>
                            <div className="flex justify-end items-baseline space-x-2">
                                <span className="text-gray-500">ADVECTION</span>
                                <span className="text-xl font-bold font-mono">0.842ms</span>
                            </div>
                        </div>
                        <div className="w-48 h-px bg-white/10 relative">
                            <div className="absolute top-0 right-0 h-full w-2/3 bg-primary/40"></div>
                        </div>
                    </div>

                    {/* Left Side Vertical Text */}
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col space-y-12 pointer-events-none z-20">
                        <div className="rotate-90 origin-left text-[10px] tracking-[0.5em] text-white/20 whitespace-nowrap">
                            KTM PERFORMANCE CORE // VOLATILE ENGINE MORPH
                        </div>
                        <div className="space-y-2">
                            <div className="w-1 h-8 bg-primary"></div>
                            <div className="w-1 h-2 bg-white/20"></div>
                            <div className="w-1 h-2 bg-white/20"></div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="relative w-full max-w-5xl h-[80vh] flex flex-col items-center justify-center">
                        {/* Navigation Arrows */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-4 text-white/30 hover:text-primary transition-all active:scale-95 hover:bg-white/5 rounded-full"
                        >
                            <span className="material-symbols-outlined text-4xl">chevron_left</span>
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-4 text-white/30 hover:text-primary transition-all active:scale-95 hover:bg-white/5 rounded-full"
                        >
                            <span className="material-symbols-outlined text-4xl">chevron_right</span>
                        </button>

                        {/* Background Geometric Elements */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <div className="w-[500px] h-[500px] border border-white/10 rounded-full flex items-center justify-center">
                                <div className="w-[400px] h-[400px] border border-white/5 rounded-full"></div>
                            </div>
                            <div className="absolute top-1/4 left-1/4 w-12 h-12 border-t-2 border-l-2 border-primary/40"></div>
                            <div className="absolute top-1/4 right-1/4 w-12 h-12 border-t-2 border-r-2 border-primary/40"></div>
                            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-b-2 border-l-2 border-primary/40"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border-b-2 border-r-2 border-primary/40"></div>
                        </div>

                        {/* 3D Particle Container */}
                        <div className="relative z-10 w-full max-w-[70vh] aspect-square animate-[float_6s_ease-in-out_infinite]">
                            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                {/* Directional Light for rim highlights */}
                                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                                <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#ff6600" />
                                <PetrolLogo text={currentShape.text} />
                                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                            </Canvas>
                            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10 animate-[pulse-slow_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                        </div>

                        <div className="mt-12 text-center max-w-lg z-10">
                            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">
                                FUEL <span className="text-primary">MORPH</span> 01
                            </h1>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row justify-between items-center z-20 space-y-6 md:space-y-0 text-[10px] tracking-widest uppercase">
                        <button className="flex items-center space-x-3 hover:text-primary transition-colors group">
                            <span className="material-symbols-outlined text-sm">volume_up</span>
                            <span className="border-b border-transparent group-hover:border-primary pb-0.5">Sound: On</span>
                        </button>

                        <div className="relative flex items-center justify-center group">
                            <div className="absolute -inset-x-8 -inset-y-4 border-t border-b border-white/10 flex justify-between pointer-events-none">
                                <div className="w-px h-full bg-white/10"></div>
                                <div className="w-px h-full bg-white/10"></div>
                            </div>
                            <div className="flex items-center space-x-12 text-white/40">
                                <a className="hover:text-white transition-colors" href="#">LinkedIn</a>
                                <div className="relative px-6 py-2">
                                    <span key={currentShape.label} className="text-white font-bold tracking-[0.3em] scramble animate-pulse">
                                        {currentShape.label}
                                    </span>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
                                </div>
                                <a className="hover:text-white transition-colors" href="#">Medium</a>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex flex-col items-end space-y-1">
                                <div className="text-[8px] text-gray-500 uppercase">Engine Health</div>
                                <div className="flex space-x-1">
                                    <div className="w-4 h-1 bg-primary"></div>
                                    <div className="w-4 h-1 bg-primary"></div>
                                    <div className="w-4 h-1 bg-primary"></div>
                                    <div className="w-4 h-1 bg-white/10"></div>
                                </div>
                            </div>
                            <button className="bg-primary text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all active:scale-95">
                                Enter Core
                            </button>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
};

export default References;
