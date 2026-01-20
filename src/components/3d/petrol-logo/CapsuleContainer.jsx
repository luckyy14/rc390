import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { capsuleVertexShader, capsuleFragmentShader } from './shaders';

/**
 * Capsule closure for the Petrol Logo particles.
 * Triggers glow effects on "collision" with the swarm center.
 */
export default function CapsuleContainer({ mouseRef, disruptionRef, glowRef }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            const m = glowRef.current;
            const mRad = Math.sqrt(m.x * m.x + m.z * m.z);
            const mY = Math.abs(m.y);
            let dWall = 100.0;

            if (mY < 1.25) {
                dWall = Math.abs(2.0 - mRad);
            } else {
                dWall = Math.abs(3.0 - mRad);
            }

            const impact = 1.0 - THREE.MathUtils.smoothstep(0.2, 0.8, dWall);

            groupRef.current.children.forEach(mesh => {
                if (mesh.isMesh && mesh.material && mesh.material.uniforms) {
                    mesh.material.uniforms.uTime.value = state.clock.elapsedTime;
                    mesh.material.uniforms.uMouse.value.copy(glowRef.current);
                    mesh.material.uniforms.uDisrupt.value = disruptionRef.current;
                    if (mesh.material.uniforms.uImpact) {
                        mesh.material.uniforms.uImpact.value = impact;
                    } else {
                        mesh.material.uniforms.uImpact = { value: impact };
                    }
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {/* Cylinder Body */}
            <mesh>
                <cylinderGeometry args={[2.0, 2.0, 2.5, 128, 64]} />
                <shaderMaterial
                    vertexShader={capsuleVertexShader}
                    fragmentShader={capsuleFragmentShader}
                    uniforms={{
                        uTime: { value: 0 },
                        uMouse: { value: new THREE.Vector3() },
                        uDisrupt: { value: 0 },
                    }}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Top Cap */}
            <mesh position={[0, -1.31, 0]}>
                <sphereGeometry args={[3.25, 128, 128, 0, Math.PI * 2, 0, 0.67]} />
                <shaderMaterial
                    vertexShader={capsuleVertexShader}
                    fragmentShader={capsuleFragmentShader}
                    uniforms={{
                        uTime: { value: 0 },
                        uMouse: { value: new THREE.Vector3() },
                        uDisrupt: { value: 0 },
                    }}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Bottom Cap */}
            <mesh position={[0, 1.31, 0]}>
                <sphereGeometry args={[3.25, 128, 128, 0, Math.PI * 2, 2.47, 0.67]} />
                <shaderMaterial
                    vertexShader={capsuleVertexShader}
                    fragmentShader={capsuleFragmentShader}
                    uniforms={{
                        uTime: { value: 0 },
                        uMouse: { value: new THREE.Vector3() },
                        uDisrupt: { value: 0 },
                    }}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}
