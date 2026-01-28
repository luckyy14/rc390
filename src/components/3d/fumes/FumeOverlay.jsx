import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFumeSimulation } from '../../../hooks/useFumeSimulation';

export function FumeOverlay({ position = [0, 0, 0], scale = [10, 10, 1] }) {
    const meshRef = useRef();
    const { texture, addInteraction } = useFumeSimulation();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uFumeTexture: { value: texture },
        uLowColor: { value: new THREE.Color('#2F4F4F') }, // Titanium Blue
        uHighColor: { value: new THREE.Color('#FF4500') }, // Combustion Orange
    }), [texture]);

    useFrame((state) => {
        if (meshRef.current) {
            uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const handlePointerMove = (e) => {
        const { uv } = e;
        if (uv) {
            // Simple velocity estimation could be added here
            addInteraction(uv.x, uv.y, 0, 0.1, 50);
        }
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerMove={handlePointerMove}
        >
            <planeGeometry args={[scale[0], scale[1]]} />
            <shaderMaterial
                transparent
                depthWrite={false}
                uniforms={uniforms}
                vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
                fragmentShader={`
          uniform float uTime;
          uniform sampler2D uFumeTexture;
          uniform vec3 uLowColor;
          uniform vec3 uHighColor;
          varying vec2 vUv;

          // Simple noise function
          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }

          void main() {
            vec4 fumeData = texture2D(uFumeTexture, vUv);
            float d = fumeData.r;
            
            // Iridescent petrol effect based on density and UV
            vec3 petrolColor = vec3(
                0.2 + 0.3 * sin(d * 10.0 + uTime),
                0.1 + 0.2 * cos(d * 8.0 - uTime * 0.5),
                0.4 + 0.2 * sin(d * 12.0 + uTime * 0.2)
            );
            
            // Combine with manifesto colors
            vec3 baseColor = mix(uLowColor, uHighColor, d);
            vec3 finalColor = mix(baseColor, petrolColor, d * 0.5);
            
            // Gaseous movement noise
            float n = hash(vUv * 100.0 + uTime * 0.1);
            float alpha = smoothstep(0.01, 0.25, d) * (0.4 + 0.2 * n);
            
            // Edge fading
            float edge = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) *
                         smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
            
            gl_FragColor = vec4(finalColor, alpha * edge);
          }
        `}
            />
        </mesh>
    );
}
