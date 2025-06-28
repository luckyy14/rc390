import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/shop", label: "Shop" },
  { to: "/showroom", label: "Showroom" },
  { to: "/exhaust", label: "Exhaust" },
  { to: "/garage", label: "Garage" },
];

export const Navbar = () => (
  <nav className="flex gap-6 px-6 py-4 bg-[var(--color-bg)] text-[var(--color-text)] shadow">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `font-semibold hover:text-[var(--color-primary)] transition ${
            isActive ? "text-[var(--color-primary)]" : ""
          }`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);
