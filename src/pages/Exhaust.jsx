import React from "react";
import { Helmet } from "react-helmet-async";
import AudioVisualizer from "../ui/AudioVisualizer";

// Safari/legacy browser compatibility helpers
const isSafari =
  typeof window !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const Exhaust = () => (
  <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
    <Helmet>
      <title>KTM RC 390 Exhaust | DarkRide</title>
      <meta
        name="description"
        content="Experience the sound of the KTM RC 390 exhaust. Listen to audio samples and visualize the engine's roar."
      />
      <meta
        name="keywords"
        content="KTM RC 390, exhaust, sound, audio, motorcycle, superbike, DarkRide"
      />
      <meta property="og:title" content="KTM RC 390 Exhaust | DarkRide" />
      <meta
        property="og:description"
        content="Experience the sound of the KTM RC 390 exhaust. Listen to audio samples and visualize the engine's roar."
      />
    </Helmet>
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
