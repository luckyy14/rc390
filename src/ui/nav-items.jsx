import { AiOutlineHome, AiFillHome, AiOutlineShop, AiFillShop } from "react-icons/ai";
import { GiCarWheel } from "react-icons/gi";
import {  MdOutlineGarage, MdGarage, MdOutlineMenuBook, MdMenuBook } from "react-icons/md";
import { PiPresentationBold,PiPresentationFill  } from "react-icons/pi";
export const NAV_ITEMS = [
  {
    label: "Home",
    to: "/",
    iconOutline: AiOutlineHome,
    iconFilled: AiFillHome,
  },
  {
    label: "Shop",
    to: "/shop",
    iconOutline: AiOutlineShop,
    iconFilled: AiFillShop,
  },
  {
    label: "Exhaust",
    to: "/exhaust",
    iconOutline: function ExhaustOutlineIcon(props) {
      return (
        <svg width="24" height="24" fill="none" viewBox="0 0 14 14" {...props}>
          <g transform="rotate(160 9 8)">
            <rect x="4" y="9" width="8" height="4" rx="1" fill="none" stroke="#FF6F00" strokeWidth="1.5"/>
            <rect x="12" y="10" width="4" height="2" rx="1" fill="none" stroke="#FF6F00" strokeWidth="1.5"/>
            <rect x="2" y="10" width="2" height="2" rx="1" fill="none" stroke="#FF6F00" strokeWidth="1.5"/>
          </g>
        </svg>
      );
    },
    iconFilled: function ExhaustFilledIcon(props) {
      return (
        <svg width="24" height="24" fill="none" viewBox="0 0 12 12" {...props}>
          <g transform="rotate(160 8 8)">
            <rect x="4" y="9" width="8" height="4" rx="1" fill="#000000"/>
            <rect x="12" y="10" width="4" height="2" rx="1" fill="#201308"/>
            <rect x="2" y="10" width="2" height="2" rx="1" fill="#24160b"/>
          </g>
        </svg>
      );
    },
  },
  {
    label: "Display",
    to: "/display",
    iconOutline: PiPresentationBold,
    iconFilled: PiPresentationFill,
  },
  {
    label: "Garage",
    to: "/garage",
    iconOutline: MdOutlineGarage,
    iconFilled: MdGarage,
  },
  {
    label: "Manual",
    to: "/manual",
    iconOutline: MdOutlineMenuBook,
    iconFilled: MdMenuBook,
  },
];
