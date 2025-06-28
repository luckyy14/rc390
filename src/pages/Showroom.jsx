import React from "react";
import { Rc390Viewer } from "../modules/rc390";

export default function Showroom() {
  return (
    <div className="flex flex-row flex-wrap mweb-flex-col p-4 md:p-8">
      <div className="w-full p-4 md:p-8">
        <Rc390Viewer />
      </div>
    </div>
  );
}
