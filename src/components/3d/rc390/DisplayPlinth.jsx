import React, { useMemo } from "react";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { mergeBufferGeometries } from 'three-stdlib';

/**
 * DisplayPlinth - High-performance display base.
 * Memoized to prevent jitter and excessive re-renders.
 */
const DisplayPlinth = React.memo(function DisplayPlinth() {
    const logoTexture = useTexture("/assets/ktm.png");

    // High-performance procedural noise texture (cached)
    const noiseTexture = useMemo(() => {
        const size = 128; // Smaller for speed
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, '#151515');
        grad.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Fine Speckles (Dithered approach for stability)
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgb(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55})`;
            ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 2);
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        return tex;
    }, []);

    const width = 5;
    const height = 0.2;
    const depth = 2.5;

    // Merged Border Geometry (cached)
    const borderGeom = useMemo(() => {
        const borderThickness = 0.03;
        const borderHeight = 0.01;
        const borderOffset = 0.08;
        const yPos = height / 2 + 0.005;
        const geoms = [];

        // Horizontal rails
        const g1 = new THREE.BoxGeometry(width - borderOffset * 2, borderHeight, borderThickness);
        g1.translate(0, yPos, -(depth / 2 - borderOffset));
        geoms.push(g1);

        const g2 = new THREE.BoxGeometry(width - borderOffset * 2, borderHeight, borderThickness);
        g2.translate(0, yPos, (depth / 2 - borderOffset));
        geoms.push(g2);

        // Vertical rails
        const g3 = new THREE.BoxGeometry(borderThickness, borderHeight, depth - borderOffset * 2);
        g3.translate(-(width / 2 - borderOffset), yPos, 0);
        geoms.push(g3);

        const g4 = new THREE.BoxGeometry(borderThickness, borderHeight, depth - borderOffset * 2);
        g4.translate((width / 2 - borderOffset), yPos, 0);
        geoms.push(g4);

        return mergeBufferGeometries(geoms);
    }, []);

    return (
        <group position={[0, -height * 3.5, 0]}>
            {/* 1. SLATE SLAB (Optimized to standard BoxGeometry) */}
            <mesh receiveShadow>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color="#181818"
                    map={noiseTexture}
                    roughness={0.8}
                    metalness={0.1}
                    envMapIntensity={0.5}
                />
            </mesh>

            {/* 2. OPTIMIZED BORDER (Merged Mesh) */}
            <mesh geometry={borderGeom}>
                <meshStandardMaterial color="#FF4500" metalness={0} roughness={0.4} />
            </mesh>

            {/* 3. LOGO (Enhanced Z-offset for jitter protection) */}
            <mesh position={[0, 0, depth / 2 + 0.005]}>
                <planeGeometry args={[0.8, 0.2]} />
                <meshStandardMaterial
                    map={logoTexture}
                    transparent
                    opacity={0.35}
                    color="#ffffff"
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
});

export default DisplayPlinth;
