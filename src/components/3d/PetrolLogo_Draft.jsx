import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TextGeometry } from 'three-stdlib';
import { FontLoader } from 'three-stdlib';
// We'll simulate loading a font or use a simple geometry if font loading is complex without assets.
// Actually, let's use a simple primitive or hardcoded points if font is tricky, BUT
// TextGeometry is best. I will try to load a standard font from a URL.

import helvetiker_regular from 'three/examples/fonts/helvetiker_regular.typeface.json';

const vertexShader = `
uniform float uTime;
uniform vec3 uMouse;
uniform float uHover;

attribute vec3 aTarget;
attribute float aRandom;

varying vec2 vUv;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vPosition;

// Simplex noise (same as before for consistency)
// ... (insert noise function) ...
// For brevity using a simple hash here or re-using the previous snoise function
// Let's assume standard noise function exists or is pasted structure.
// I will reuse the snoise from previous file.

void main() {
  vUv = uv;
  vNormal = normal; // Normal of the INSTANCE (tiny sphere)

  // 1. Base Position (The "X" shape)
  vec3 targetPos = aTarget;

  // 2. Mouse Interaction
  // Calculate distance from particle target to mouse cursor
  float dist = distance(targetPos.xy, uMouse.xy);
  
  // Interaction Radius
  float radius = 1.5; 
  
  // Force: Pull towards mouse if inside radius
  vec3 offset = vec3(0.0);
  if (dist < radius) {
     float strength = (1.0 - dist / radius); // 1 at center, 0 at edge
     strength = pow(strength, 2.0); // Non-linear falloff
     
     // Direction from particle TO mouse
     vec3 dir = normalize(uMouse - targetPos);
     
     // Move towards mouse, but also add some chaos/noise
     offset = dir * strength * 0.5 * uHover; 
     
     // Add "petrol" turbulence
     offset.z += sin(uTime * 10.0 + aRandom * 10.0) * strength * 0.2;
  }

  // 3. Final Position
  vec3 finalPos = targetPos + offset;
  
  // Apply Instance Matrix (scale/rotation of tiny particles) + Position
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  
  // Manually translate the instance to the final position
  mvPosition.xyz += finalPos;

  vPosition = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
// ... Reuse the iridescent fragment shader from PetrolParticle ...
// ...
`;

// ... Component Logic ...
