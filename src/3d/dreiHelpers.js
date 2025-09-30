// src/3d/dreiHelpers.js
import { useGLTF, useTexture, useAnimations } from "@react-three/drei";

/**
 * Loads a GLTF model using Drei's useGLTF hook.
 * @param {string} url - The URL of the GLTF model.
 * @returns {object} GLTF scene and nodes.
 */
export function useDreiGLTF(url) {
  return useGLTF(url);
}

/**
 * Loads a texture using Drei's useTexture hook.
 * @param {string} url - The URL of the texture.
 * @returns {object} Texture object.
 */
export function useDreiTexture(url) {
  return useTexture(url);
}

/**
 * Loads animations for a GLTF model using Drei's useAnimations hook.
 * @param {object} gltf - The loaded GLTF object.
 * @param {object} ref - The ref to the mesh.
 * @returns {object} Animation actions and clips.
 */
export function useDreiAnimations(gltf, ref) {
  return useAnimations(gltf.animations, ref);
}
