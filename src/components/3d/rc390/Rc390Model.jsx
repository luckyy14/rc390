import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * Base 3D Model for the KTM RC390.
 */
export default function Rc390Model({ scale = 1, position = [0, -0.6, 0], foamMap, onSceneReady }) {
    const { scene: originalScene } = useGLTF("/assets/ktm.glb");
    const [scene] = React.useState(() => originalScene.clone(true));

    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material = child.material.clone();
                    if (foamMap) {
                        child.material.transparent = true;
                        child.material.alphaMap = foamMap;
                        child.material.alphaTest = 0.1;
                    } else {
                        child.material.transparent = false;
                        child.material.alphaMap = null;
                        child.material.alphaTest = 0;
                    }
                    child.material.needsUpdate = true;
                }
            });

            if (onSceneReady) {
                onSceneReady(scene);
            }
        }
    }, [foamMap, scene, onSceneReady]);

    return <primitive object={scene} position={position} scale={[scale, scale, scale]} />;
}
