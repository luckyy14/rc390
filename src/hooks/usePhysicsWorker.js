import { useEffect, useRef, useCallback } from 'react';

export function usePhysicsWorker() {
    const workerRef = useRef(null);

    useEffect(() => {
        // Vite handles Web Worker imports automatically
        workerRef.current = new Worker(new URL('../services/physics.worker.js', import.meta.url), {
            type: 'module'
        });

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const calculateHiding = useCallback((meshes, pointer, wipeRadius) => {
        return new Promise((resolve) => {
            if (!workerRef.current) {
                resolve({});
                return;
            }

            const handleMessage = (e) => {
                workerRef.current.removeEventListener('message', handleMessage);
                resolve(e.data.toHide);
            };

            workerRef.current.addEventListener('message', handleMessage);

            // Prepare serializable data
            const serializableMeshes = meshes.map(mesh => ({
                uuid: mesh.uuid,
                positions: mesh.geometry.attributes.position.array,
                worldMatrix: mesh.matrixWorld.elements
            }));

            workerRef.current.postMessage({
                meshes: serializableMeshes,
                pointer: { x: pointer.x, y: pointer.y, z: pointer.z },
                wipeRadius
            });
        });
    }, []);

    return { calculateHiding };
}
