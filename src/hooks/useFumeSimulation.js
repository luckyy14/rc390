import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

const SIZE = 64;

export function useFumeSimulation() {
    const workerRef = useRef(null);
    const textureRef = useRef(null);
    const densityRef = useRef(new Float32Array(SIZE * SIZE));

    // Initialize DataTexture
    if (!textureRef.current) {
        const data = new Uint8Array(SIZE * SIZE * 4);
        textureRef.current = new THREE.DataTexture(
            data,
            SIZE,
            SIZE,
            THREE.RGBAFormat
        );
        textureRef.current.needsUpdate = true;
    }

    useEffect(() => {
        workerRef.current = new Worker(new URL('../services/fume.worker.js', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            if (e.data.density) {
                densityRef.current = e.data.density;
                const data = textureRef.current.image.data;
                for (let i = 0; i < SIZE * SIZE; i++) {
                    const d = Math.min(255, e.data.density[i]);
                    data[i * 4] = d;     // R
                    data[i * 4 + 1] = d; // G
                    data[i * 4 + 2] = d; // B
                    data[i * 4 + 3] = d; // A (using density as alpha too)
                }
                textureRef.current.needsUpdate = true;
            }
        };

        let animationId;
        const loop = () => {
            workerRef.current.postMessage({ type: 'step' });
            animationId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animationId);
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const addInteraction = useCallback((x, y, dx, dy, amount) => {
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'interaction',
                x,
                y,
                dx,
                dy,
                amount
            });
        }
    }, []);

    return { texture: textureRef.current, addInteraction };
}
