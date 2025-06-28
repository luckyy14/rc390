import React from "react";
import AudioVisualizer from "../ui/AudioVisualizer";

const Exhaust = () => (
  <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
    <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">
      Exhaust
    </h1>
    <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
      <div className="p-4 md:p-8">Exhaust Page</div>
      <div className="flex justify-center w-full mt-8">
        <AudioVisualizer
          src="/assets/audio/mixkit-motorcycle-engine-doing-gearshift-2725.wav"
          color="var(--color-accent)"
          accent="var(--color-accent)"
          data-testid="audio-visualizer"
        />
      </div>
    </div>
  </div>
);

export default Exhaust;
