import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Rc390 } from "../3d/models/rc390";
import R3FBase from "../3d/r3fBase";
import { OrbitControls } from "@react-three/drei";
import PageLayout from "../layouts/PageLayout";
import { FoamOverlay3D } from "../components/FoamOverlay3D";
import { FumeOverlay } from "../components/3d/fumes/FumeOverlay";
import { FaHandSparkles, FaSoap, FaBroom } from "react-icons/fa";

const Garage = () => {
  const [foamLayers, setFoamLayers] = useState([]);
  const [wipeRadius, setWipeRadius] = useState(0.25);
  const [ragMode, setRagMode] = useState(false);

  const handleFoamIt = () => {
    if (foamLayers.length >= 8) {
      const audio = new Audio("/assets/audio/tick.mp3");
      audio.volume = 0.5;
      audio.play();
      return;
    }
    setFoamLayers((layers) => [
      ...layers,
      { key: `${Date.now()}-${layers.length}`, scale: 2 + layers.length * 0.015 } // offset scales more for visibility
    ]);
  };

  const handleWipeFoam = () => {
    setFoamLayers([]);
  };

  return (
    <PageLayout>
      <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
        <Helmet>
          <title>KTM RC 390 Garage | MidnightTorque</title>
          <meta name="description" content="Interact with the KTM RC 390 in the virtual garage. Add foam, wipe, and explore the 3D model in detail." />
          <meta name="keywords" content="KTM RC 390, garage, 3D, foam, wipe, motorcycle, superbike, MidnightTorque" />
          <meta property="og:title" content="KTM RC 390 Garage | MidnightTorque" />
          <meta property="og:description" content="Interact with the KTM RC 390 in the virtual garage. Add foam, wipe, and explore the 3D model in detail." />
        </Helmet>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">Garage</h1>
        <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
          <div className="flex-1 flex items-center justify-center min-w-[320px] min-h-[320px] md:min-w-[480px] md:min-h-[480px]" style={{ height: '60vh' }}>
            <div className="w-full h-full border border-[var(--color-border)] rounded-lg overflow-hidden relative">
              <R3FBase camera={{ position: [2, 2, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 5, 2]} intensity={1.2} />
                <FumeOverlay position={[0, 0, -2]} scale={[15, 10, 1]} />
                <Rc390 scale={2} position={[0, -0.6, 0]} />
                {foamLayers.map((layer) => (
                  <FoamOverlay3D
                    key={layer.key}
                    scale={layer.scale}
                    position={[0, -0.6, 0]}
                    wipeRadius={wipeRadius}
                    ragMode={ragMode}
                  />
                ))}
                <OrbitControls enabled={!ragMode} enableZoom />
              </R3FBase>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center" style={{ gap: 32, marginTop: 16 }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              margin: "0 8px",
              cursor: "pointer",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setRagMode((v) => !v)}
            aria-pressed={ragMode}
            title={ragMode ? "Wipe Mode: ON" : "Wipe Mode"}
            aria-label={ragMode ? "Wipe Mode: ON" : "Wipe Mode"}
          >
            <FaHandSparkles style={{ width: 48, height: 48 }} aria-hidden="true" />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              margin: "0 8px",
              cursor: "pointer",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={handleFoamIt}
            title="Add Foam"
            aria-label="Add Foam"
          >
            <FaSoap style={{ width: 48, height: 48 }} aria-hidden="true" />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              margin: "0 8px",
              cursor: "pointer",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={handleWipeFoam}
            title="Wipe All Foam"
            aria-label="Wipe All Foam"
          >
            <FaBroom style={{ width: 48, height: 48 }} aria-hidden="true" />
          </button>
        </div>
        <div className="p-1 mt-6 bg-[rgba(26,26,26,0.85)] text-[var(--color-white)] px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-lg font-heading text-xl tracking-widest border border-[var(--color-border)] w-fit max-w-full mx-auto">
          3D Bike Overview — Foam & Wipe!<br />
          <span className="text-[var(--color-accent)] text-base">
            Each "Foam It!" adds a new layer.<br />
            Wipe radius: <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={wipeRadius}
              onChange={e => setWipeRadius(Number(e.target.value))}
              style={{ width: 100, verticalAlign: "middle" }}
            /> {wipeRadius.toFixed(2)}
          </span>
        </div>
      </div>
    </PageLayout>
  );
};

export default Garage;
