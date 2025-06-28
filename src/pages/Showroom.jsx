import React from "react";
import { Rc390Viewer } from "../modules/rc390";

export default function Showroom() {
  return (
    <div className="flex flex-row flex-wrap mweb-flex-col">
      <Rc390Viewer />
    </div>
  );
}
