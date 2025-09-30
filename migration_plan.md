# Implementation Plan

[Overview]
Migrate the rc390 codebase to use React Three Fiber (r3f), Drei, and shadcn/tailwind for all 3D, UI, and CSS logic.  
This migration will refactor the base architecture and then update each page to leverage r3f, Drei components, and shadcn/tailwind for styling, ensuring maintainability and feature parity.

The rc390 project currently uses a mix of Three.js, custom logic, and basic CSS for 3D rendering and UI. Migrating to r3f, Drei, and shadcn/tailwind will modernize the codebase, simplify 3D scene management, improve styling consistency, and enhance developer experience. The migration will be performed in two phases: first, refactor the base 3D architecture and shared modules; second, update each page (Garage, Manual, Shop, Display, Exhaust) to use r3f/Drei/shadcn/tailwind patterns.

[Types]
Type system will be updated to use r3f and Drei component props and hooks.  
All custom Three.js types will be replaced with r3f equivalents, and props will be typed according to r3f/Drei conventions.

- Replace direct Three.js types with r3f hooks and component props.
- Use Drei helpers for GLTF, OrbitControls, Environment, etc.
- Update any custom hooks to use r3f context and types.

[Files]
Files will be modified and created to support migration from Three.js to r3f/Drei/shadcn/tailwind.

- New files:
  - src/3d/r3fBase.jsx: Base r3f scene setup and context provider.
  - src/3d/dreiHelpers.js: Utility functions for Drei integration.
  - src/3d/r3fREADME.md: Documentation for r3f/Drei usage patterns.
  - src/theme/shadcn.css: Shadcn/tailwind CSS overrides and variables.
  - src/ui/shadcnComponents/: Directory for shadcn UI components.
- Modified files:
  - src/3d/models/rc390.jsx: Change from direct Three.js to r3f/Drei usage.
  - src/3d/controls/PositionSliders.jsx: Change from direct Three.js to r3f/Drei usage.
  - src/3d/controls/RotationSliders.jsx: Change from direct Three.js to r3f/Drei usage.
  - src/components/FoamOverlay3D.jsx: Change from direct Three.js to r3f/Drei usage.
  - src/pages/Garage.jsx: Change from direct Three.js to r3f/Drei usage and update styling to shadcn/tailwind.
  - src/pages/Manual.jsx: Change from direct Three.js to r3f/Drei usage and update styling to shadcn/tailwind.
  - src/pages/Shop.jsx: Change from direct Three.js to r3f/Drei usage and update styling to shadcn/tailwind.
  - src/pages/Display.jsx: Change from direct Three.js to r3f/Drei usage and update styling to shadcn/tailwind.
  - src/pages/Exhaust.jsx: Change from direct Three.js to r3f/Drei usage and update styling to shadcn/tailwind.
  - src/layouts/ThreeDLayout.jsx: Change from direct Three.js to r3f/Drei usage.
  - src/index.css: Refactor for tailwind/shadcn integration.
  - src/theme/bike-theme.css: Refactor for tailwind/shadcn integration.
- Deleted files:
  - src/3d/controls/useGLBControls.js: Remove direct Three.js helper.
  - Any legacy CSS files replaced by shadcn/tailwind.
- Configuration:
  - README.md: Update to document migration steps and new usage.
  - src/manual/3d-architecture-guide.md: Add migration notes.

[Functions]
Functions will be refactored to use r3f/Drei hooks and patterns.

- New functions:
  - r3fBaseProvider(): Provides r3f context and Canvas.
  - useDreiGLTF(): Loads GLTF models using Drei.
- Modified functions:
  - All Three.js scene setup functions to use r3f Canvas and hooks.
  - Custom controls to use Drei's OrbitControls and r3f state.
- Removed functions:
  - Direct Three.js scene setup and manual render loop logic.

[Classes]
Classes will be replaced or refactored for r3f/Drei.

- New classes:
  - None (prefer functional components/hooks).
- Modified classes:
  - ErrorBoundary (ensure compatibility with r3f context).
- Removed classes:
  - Any class-based Three.js scene managers.

[Dependencies]
Dependencies will be updated to ensure latest r3f, Drei, shadcn, and tailwind versions.

- Add/update:
  - @react-three/fiber
  - @react-three/drei
  - tailwindcss
  - shadcn-ui (or equivalent package)
- Remove:
  - Direct Three.js usage where replaced by r3f/Drei.
  - Legacy CSS dependencies replaced by tailwind/shadcn.

[Testing]
Testing will validate migration and feature parity for r3f, Drei, and shadcn/tailwind.

- Update existing tests to use r3f/Drei/shadcn components.
- Add smoke tests for each migrated page.
- Validate 3D rendering, controls, and UI styling.

[Implementation Order]
Migration will proceed in logical steps to minimize conflicts.

1. Refactor base 3D architecture: create r3fBase.jsx and dreiHelpers.js.
2. Update src/3d/models/rc390.jsx and controls to use r3f/Drei.
3. Refactor FoamOverlay3D and shared 3D components.
4. Update ThreeDLayout to wrap children in r3f Canvas.
5. Migrate Garage.jsx to use r3f/Drei.
6. Migrate Manual.jsx to use r3f/Drei.
7. Migrate Shop.jsx to use r3f/Drei.
8. Migrate Display.jsx to use r3f/Drei.
9. Migrate Exhaust.jsx to use r3f/Drei.
10. Update documentation and tests for new architecture.
