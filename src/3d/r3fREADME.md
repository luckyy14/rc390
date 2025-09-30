# React Three Fiber & Drei Integration Guide

## Overview
This directory contains base setup and helpers for integrating React Three Fiber (r3f) and Drei in the rc390 project. All 3D components should use r3f/Drei patterns for scene management, controls, and asset loading.

## Files
- **r3fBase.jsx**: Provides the r3f Canvas, ambient light, environment, and OrbitControls. Wrap all 3D scenes/components with this.
- **dreiHelpers.js**: Utility hooks for loading GLTF models, textures, and animations using Drei.

## Usage

### Base Scene
```jsx
import R3FBase from "./r3fBase";

<R3FBase>
  {/* 3D components go here */}
</R3FBase>
```

### Loading Models
```js
import { useDreiGLTF } from "./dreiHelpers";
const { scene, nodes } = useDreiGLTF("/assets/ktm.glb");
```

### Controls & Environment
- Use `<OrbitControls />` for camera movement.
- Use `<Environment preset="sunset" />` for HDRI lighting.

## Migration Notes
- Replace direct Three.js logic with r3f/Drei hooks and components.
- Use functional components and hooks for all 3D logic.
- See migration_plan.md for implementation order and details.
