import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Shop from "./pages/Shop";
import Showroom from "./pages/Showroom";
import Exhaust from "./pages/Exhaust";
import Garage from "./pages/Garage";
import { Navbar } from "./ui/Navbar";
import TireSkidTrail from "./ui/TireSkidTrail";

const App = () => (
  <>
    <TireSkidTrail />
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/exhaust" element={<Exhaust />} />
        <Route path="/garage" element={<Garage />} />
      </Routes>
    </Router>
  </>
);

export default App;
