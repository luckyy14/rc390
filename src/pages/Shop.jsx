import React from "react";
import { Helmet } from "react-helmet-async";

// Safari/legacy browser compatibility helpers
const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

const Shop = () => {
  const isIOSDevice = typeof window !== 'undefined' && isIOS();
  // Safari: model-viewer AR Quick Look only works on iOS, fallback for other browsers
  const arModes = isSafari && !isIOSDevice ? 'scene-viewer' : 'scene-viewer webxr quick-look';

  return (
    <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
      <Helmet>
        <title>KTM RC 390 Shop | DarkRide</title>
        <meta name="description" content="Shop for KTM RC 390 parts, accessories, and official merchandise. Find everything you need for your superbike." />
        <meta name="keywords" content="KTM RC 390, shop, parts, accessories, merchandise, motorcycle, DarkRide" />
        <meta property="og:title" content="KTM RC 390 Shop | DarkRide" />
        <meta property="og:description" content="Shop for KTM RC 390 parts, accessories, and official merchandise. Find everything you need for your superbike." />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">
        Shop
      </h1>
      <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
        {isIOSDevice ? (
          <a
            href="/assets/ktm.usdz"
            rel="ar"
            className="mt-4 px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold shadow hover:bg-orange-700 transition"
          >
            View in AR (iOS)
          </a>
        ) : (
          <model-viewer
            src="/assets/ktm.glb"
            ar
            ar-modes={arModes}
            camera-controls
            auto-rotate
            style={{ width: '100%', maxWidth: '400px', height: '400px', background: '#222', borderRadius: '16px', margin: '2rem auto' }}
            ios-src="/assets/ktm.usdz"
          >
          </model-viewer>
        )}
      </div>
    </div>
  );
};

export default Shop;
