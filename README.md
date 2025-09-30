# RC390 Migration: React Three Fiber, Drei, and shadcn/tailwind

## Overview

This codebase has been migrated to use [React Three Fiber (r3f)](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei), and [shadcn/tailwind](https://ui.shadcn.com/) for all 3D, UI, and CSS logic.  
Legacy Three.js and CSS have been replaced for maintainability, modern patterns, and feature parity.

## Key Changes

- **3D Architecture:** All 3D logic uses r3f and Drei. See `src/3d/r3fBase.jsx` and `src/3d/dreiHelpers.js`.
- **UI Components:** All UI uses shadcn/tailwind classes. See `src/theme/shadcn.css` and `src/ui/shadcnComponents/`.
- **Pages:** Garage, Manual, Shop, Display, and Exhaust pages are migrated to r3f/Drei/shadcn/tailwind.
- **Removed:** Legacy Three.js helpers and CSS.

## Usage

- **3D Scenes:** Wrap with `<R3FBase>...</R3FBase>` for Canvas, controls, and environment.
- **GLTF Models:** Use `useDreiGLTF(url)` from `src/3d/dreiHelpers.js`.
- **UI:** Use shadcn/tailwind classes for all buttons, cards, and forms.

## Migration Notes

- See `src/3d/r3fREADME.md` for r3f/Drei usage patterns.
- See `src/manual/3d-architecture-guide.md` for migration details.

## Development

- **Install dependencies:**  
  `yarn install`
- **Run dev server:**  
  `yarn dev`

## Directory Structure

- `src/3d/` — r3f/Drei base, helpers, and models
- `src/ui/` — shadcn/tailwind UI components
- `src/theme/` — CSS variables and overrides
- `src/pages/` — Main pages (Garage, Manual, Shop, Display, Exhaust)

## License

MIT
