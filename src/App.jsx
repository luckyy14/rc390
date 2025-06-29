import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Shop from "./pages/Shop";
import Display from "./pages/Display";
import Exhaust from "./pages/Exhaust";
import Garage from "./pages/Garage";
import Manual from "./pages/Manual";
import { Navbar } from "./ui/Navbar";
import TireSkidTrail from "./ui/TireSkidTrail";
import HamburgerMenu from "./ui/HamburgerMenu";
import usePhone from "./hooks/usephone";
import NFSNavbar from "./ui/NFSNavbar";

const App = () => {
  const { isPhone } = usePhone();
  return (
    <>
      <TireSkidTrail />
      <Router>
        {isPhone && <HamburgerMenu />}
        {!isPhone && <NFSNavbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/display" replace />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/display" element={<Display />} />
          <Route path="/exhaust" element={<Exhaust />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/manual" element={<Manual />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
