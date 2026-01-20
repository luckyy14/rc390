import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { TextGeometry, FontLoader } from 'three-stdlib';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { logoVertexShader, logoFragmentShader } from './shaders';
import CapsuleContainer from './CapsuleContainer';

/**
 * Main Petrol Particle Logo component.
 * Handles text-to-particle conversion, physics, and rendering.
 */
export default function PetrolLogo({ text = 'X' }) {
    const meshRef = useRef();
    const targetAttrRef = useRef();
    const [staticData, setStaticData] = useState(null);
    const targetBufferRef = useRef(new Float32Array(50000 * 3));

    const { camera, pointer } = useThree();
    const mouseRef = useRef(new THREE.Vector3(9999, 9999, 0));
    const glowRef = useRef(new THREE.Vector3(9999, 9999, 0));
    const prevMousePos = useRef(new THREE.Vector3(0, 0, 0));
    const disruptionVal = useRef(0);

    // Initial static data generation
    useEffect(() => {
        const count = 50000;
        const randoms = new Float32Array(count);
        const scales = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random();
            scales[i] = 0.5 + Math.random() * 0.5;
        }
        setStaticData({ count, randoms, scales });
    }, []);

    // Text-to-target generation
    useEffect(() => {
        if (!staticData) return;
        disruptionVal.current = 1.5;
        const loader = new FontLoader();
        const font = loader.parse(helvetiker);

        let lines = text.length > 4 ? [text.slice(0, Math.ceil(text.length / 2)), text.slice(Math.ceil(text.length / 2))] : [text];
        const maxLen = Math.max(...lines.map(l => l.length));
        const fontSize = 3.0 / maxLen;
        const scaleFactor = fontSize / 3.0;

        const geos = lines.map((s, i) => {
            const g = new TextGeometry(s, {
                font, size: fontSize, height: 0.5, curveSegments: 12,
                bevelEnabled: true, bevelThickness: 0.1 * scaleFactor,
                bevelSize: 0.05 * scaleFactor, bevelOffset: 0, bevelSegments: 5,
            });
            g.center();
            if (lines.length > 1) g.translate(0, i === 0 ? fontSize * 0.65 : -fontSize * 0.65, 0);
            return g;
        });

        let total = 0;
        geos.forEach(g => total += g.attributes.position.count);
        const merged = new Float32Array(total * 3);
        let off = 0;
        geos.forEach(g => {
            merged.set(g.attributes.position.array, off);
            off += g.attributes.position.array.length;
            g.dispose();
        });

        const attr = new THREE.BufferAttribute(merged, 3);
        const targets = new Float32Array(staticData.count * 3);
        const trio = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();

        for (let i = 0; i < staticData.count; i++) {
            const idx = Math.floor(Math.random() * (attr.count / 3)) * 3;
            a.fromBufferAttribute(attr, idx);
            b.fromBufferAttribute(attr, idx + 1);
            c.fromBufferAttribute(attr, idx + 2);
            const r1 = Math.random(), r2 = Math.random(), sqrtR1 = Math.sqrt(r1);
            const p = trio.set(0, 0, 0).addScaledVector(a, 1 - sqrtR1).addScaledVector(b, sqrtR1 * (1 - r2)).addScaledVector(c, sqrtR1 * r2);
            targets[i * 3] = p.x; targets[i * 3 + 1] = p.y; targets[i * 3 + 2] = p.z;
        }

        targetBufferRef.current.set(targets);
        if (targetAttrRef.current) targetAttrRef.current.needsUpdate = true;
    }, [text, staticData]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;

        const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera);
        const pos = camera.position.clone().add(vec.sub(camera.position).normalize().multiplyScalar(-camera.position.z / vec.z));

        mouseRef.current.lerp(pos, 0.05);
        glowRef.current.lerp(mouseRef.current, 0.02);

        const speed = pos.distanceTo(prevMousePos.current) / delta;
        prevMousePos.current.copy(pos);
        const target = speed > 100.0 ? 1.0 : 0.0;
        disruptionVal.current = THREE.MathUtils.lerp(disruptionVal.current, target, target > disruptionVal.current ? 0.1 : 0.05);

        meshRef.current.material.uniforms.uDisrupt.value = disruptionVal.current;
        meshRef.current.material.uniforms.uMouse.value.copy(mouseRef.current);
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uHover: { value: 1.0 },
        uDisrupt: { value: 0.0 },
        uColorA: { value: new THREE.Color("#4a2c00") },
        uColorB: { value: new THREE.Color("#ff9900") },
        uColorC: { value: new THREE.Color("#050505") },
    }), []);

    if (!staticData) return null;

    return (
        <>
            <CapsuleContainer mouseRef={mouseRef} disruptionRef={disruptionVal} glowRef={glowRef} />
            <instancedMesh
                ref={meshRef}
                args={[null, null, staticData.count]}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    disruptionVal.current = 1.5;
                    mouseRef.current.set(9999, 9999, 0);
                    glowRef.current.set(9999, 9999, 0);
                }}
            >
                <sphereGeometry args={[0.02, 8, 8]} />
                <shaderMaterial vertexShader={logoVertexShader} fragmentShader={logoFragmentShader} uniforms={uniforms} transparent />
                <instancedBufferAttribute ref={targetAttrRef} attach="geometry-attributes-aTarget" args={[targetBufferRef.current, 3]} />
                <instancedBufferAttribute attach="geometry-attributes-aRandom" args={[staticData.randoms, 1]} />
                <instancedBufferAttribute attach="geometry-attributes-aScale" args={[staticData.scales, 1]} />
            </instancedMesh>
        </>
    );
}
