import React from "react";
import { Helmet } from "react-helmet-async";
import { Rc390Viewer } from "../modules/rc390";

// Safari/legacy browser compatibility helpers
const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function Showroom() {
  return (
    <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
      <Helmet>
        <title>KTM RC 390 Showroom | DarkRide</title>
        <meta name="description" content="View the KTM RC 390 in a 3D interactive showroom. Rotate, zoom, and explore every detail of the superbike." />
        <meta name="keywords" content="KTM RC 390, showroom, 3D, motorcycle, superbike, DarkRide" />
        <meta property="og:title" content="KTM RC 390 Showroom | DarkRide" />
        <meta property="og:description" content="View the KTM RC 390 in a 3D interactive showroom. Rotate, zoom, and explore every detail of the superbike." />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">
        Showroom
      </h1>
      <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
        <div className="w-full p-4 md:p-8">
          <Rc390Viewer />
        </div>
      </div>
    </div>
  );
}
