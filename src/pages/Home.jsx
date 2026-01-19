import React from "react";
import { Helmet } from "react-helmet-async";
import LandingBackground from "../components/landing/LandingBackground";
import LandingHeader from "../components/landing/LandingHeader";
import LandingSystemStatus from "../components/landing/LandingSystemStatus";
import LandingMain from "../components/landing/LandingMain";
import LandingFooter from "../components/landing/LandingFooter";
import LandingNav from "../components/landing/LandingNav";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background-dark text-white selection:bg-primary-new selection:text-black">
      <Helmet>
        <title>KTM RC 390 - Blacklist Explore</title>
        <meta
          name="description"
          content="KTM RC 390 Blacklist Explore Edition. Engage system for underground race network access."
        />
        <meta name="theme-color" content="#FF6B00" />
      </Helmet>

      <LandingBackground />
      <LandingHeader />
      <LandingSystemStatus />
      <LandingMain />
      <LandingFooter />
      <LandingNav />
    </div>
  );
}
