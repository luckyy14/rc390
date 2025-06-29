import React from "react";
import { Helmet } from "react-helmet-async";
import { Rc390Viewer } from "../modules/rc390";

// Safari/legacy browser compatibility helpers
const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function Display() {
  return (
    <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
      <Helmet>
        <title>KTM RC 390 Display | MidnightTorque</title>
        <meta name="description" content="View the KTM RC 390 in a 3D interactive display. Rotate, zoom, and explore every detail of the superbike." />
        <meta name="keywords" content="KTM RC 390, display, 3D, motorcycle, superbike, MidnightTorque" />
        <meta property="og:title" content="KTM RC 390 Display | MidnightTorque" />
        <meta property="og:description" content="View the KTM RC 390 in a 3D interactive display. Rotate, zoom, and explore every detail of the superbike." />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">
        Display
      </h1>
      <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
        <div className="w-full p-4 md:p-8">
          <Rc390Viewer />
        </div>
      </div>
    </div>
  );
}
