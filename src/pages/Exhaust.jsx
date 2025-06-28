import React from "react";
import AudioVisualizer from "../ui/AudioVisualizer";

const Exhaust = () => (
  <div className="flex flex-row flex-wrap mweb-flex-col p-4 md:p-8">
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
);

export default Exhaust;
