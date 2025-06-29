// Unified navbar items for all navbars (dweb/mweb), with both small and large SVGs

export const NAV_ITEMS = [
  {
    label: "Shop",
    to: "/shop",
    iconSmall: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="6" width="16" height="10" rx="2" fill="#FF6F00"/>
        <rect x="5" y="9" width="10" height="4" rx="1" fill="#1A1A1A"/>
      </svg>
    ),
    iconLarge: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="24" width="32" height="12" rx="4" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="14" y="16" width="20" height="10" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="18" y="10" width="12" height="8" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <path d="M12 36 Q16 44 24 44 Q32 44 36 36" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    label: "Exhaust",
    to: "/exhaust",
    iconSmall: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="4" y="9" width="8" height="4" rx="1" fill="#FF6F00"/>
        <rect x="12" y="10" width="4" height="2" rx="1" fill="#1A1A1A"/>
        <rect x="2" y="10" width="2" height="2" rx="1" fill="#1A1A1A"/>
      </svg>
    ),
    iconLarge: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="22" width="20" height="8" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="30" y="24" width="8" height="4" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <ellipse cx="40" cy="26" rx="3" ry="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <path d="M12 30 Q14 36 24 36 Q34 36 36 30" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    label: "Display",
    to: "/display",
    iconSmall: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="7" width="14" height="8" rx="2" fill="#FF6F00"/>
        <circle cx="7" cy="15" r="2" fill="#1A1A1A"/>
        <circle cx="13" cy="15" r="2" fill="#1A1A1A"/>
      </svg>
    ),
    iconLarge: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="32" rx="14" ry="8" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="16" y="16" width="16" height="12" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="20" y="10" width="8" height="6" rx="1.5" fill="#fff" stroke="#111" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: "Garage",
    to: "/garage",
    iconSmall: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="8" width="14" height="7" rx="2" fill="#FF6F00"/>
        <rect x="7" y="11" width="6" height="4" rx="1" fill="#1A1A1A"/>
      </svg>
    ),
    iconLarge: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="20" width="24" height="16" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="18" y="28" width="12" height="8" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="22" y="24" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
        <rect x="14" y="36" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
        <rect x="30" y="36" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    label: "Manual",
    to: "/manual",
    iconSmall: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="4" width="14" height="12" rx="2" fill="#FF6F00"/>
        <rect x="6" y="7" width="8" height="2" rx="1" fill="#1A1A1A"/>
        <rect x="6" y="11" width="5" height="2" rx="1" fill="#1A1A1A"/>
      </svg>
    ),
    iconLarge: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="28" width="28" height="8" rx="3" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="16" y="20" width="16" height="8" rx="2" fill="#fff" stroke="#111" strokeWidth="2"/>
        <rect x="20" y="14" width="8" height="6" rx="1.5" fill="#fff" stroke="#111" strokeWidth="2"/>
        <path d="M14 36 Q18 42 24 42 Q30 42 34 36" stroke="#111" strokeWidth="2" fill="none"/>
        <g>
          <rect x="36" y="12" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
          <rect x="40" y="16" width="4" height="4" fill="#fff" stroke="#111" strokeWidth="1"/>
        </g>
      </svg>
    ),
  },
];
