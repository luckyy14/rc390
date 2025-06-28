import React from "react";
import { Helmet } from "react-helmet-async";
const Shop = () => (
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
      <div className="p-4 md:p-8">Shop Page</div>
    </div>
  </div>
);
export default Shop;
