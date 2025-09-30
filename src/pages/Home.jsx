import React from "react";
import { Helmet } from "react-helmet-async";
import R3FBase from "../3d/r3fBase";
import { OrbitControls } from "@react-three/drei";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
      <Helmet>
        <title>KTM RC 390 | MidnightTorque</title>
        <meta name="description" content="Welcome to the KTM RC 390 3D experience. Explore, interact, and enjoy the superbike in a modern web interface." />
        <meta name="keywords" content="KTM RC 390, home, 3D, motorcycle, superbike, MidnightTorque" />
        <meta property="og:title" content="KTM RC 390 | MidnightTorque" />
        <meta property="og:description" content="Welcome to the KTM RC 390 3D experience. Explore, interact, and enjoy the superbike in a modern web interface." />
      </Helmet>
      {/* <h1 className="text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">
        Welcome to RC390
      </h1>
      {/* <div className="flex items-center justify-center w-full h-[50vh]">
        <R3FBase camera={{ position: [2, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <OrbitControls />
        </R3FBase>
      </div> */}
      {/* <div className="shadcn-card mt-8 mx-auto max-w-xl text-center text-lg">
        Explore the KTM RC 390 in 3D. Use the navigation above to view Garage, Manual, Shop, Display, and Exhaust pages.
      </div>  */}
    </div>
  );
}
