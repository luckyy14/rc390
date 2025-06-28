import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Shop from "./pages/Shop";
import Showroom from "./pages/Showroom";
import Exhaust from "./pages/Exhaust";
import Garage from "./pages/Garage";
import Manual from "./pages/Manual";
import { Navbar } from "./ui/Navbar";
import TireSkidTrail from "./ui/TireSkidTrail";
import HamburgerMenu from "./ui/HamburgerMenu";
import usePhone from "./hooks/usephone";

const App = () => {
  const { isPhone } = usePhone();
  return (
    <>
      <TireSkidTrail />
      <Router>
        {isPhone && <HamburgerMenu />}
        {!isPhone && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/showroom" replace />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/exhaust" element={<Exhaust />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/manual" element={<Manual />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
