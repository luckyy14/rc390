import React from "react";
import { Rc390Viewer } from "../modules/rc390";

export default function Showroom() {
  return (
    <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
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
