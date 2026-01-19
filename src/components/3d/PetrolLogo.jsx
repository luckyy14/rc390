import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { TextGeometry } from 'three-stdlib';
import { FontLoader } from 'three-stdlib';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';

// Vertex Shader: Instanced Particle Logic
const vertexShader = `
uniform float uTime;
uniform vec3 uMouse; // World space mouse position
uniform float uHover; // 0.0 to 1.0 (hover intensity)
uniform float uDisrupt; // Global disruption intensity (0.0 to 1.0)

// Helper: Calculate analytical radius of the container at height Y
float getRadiusAtY(float y) {
    float halfH = 1.25;
    float cylR = 2.0;
    float capR = 3.25;
    float centerTopY = -1.31;
    float centerBotY = 1.31;
    
    if (y > halfH) {
        // Top Cap
        float dy = y - centerTopY;
        // Check if inside sphere vertical range
        if (dy > capR) return 0.0;
        return sqrt(max(0.0, capR*capR - dy*dy));
    } else if (y < -halfH) {
        // Bottom Cap
        float dy = y - centerBotY;
        if (abs(dy) > capR) return 0.0;
        return sqrt(max(0.0, capR*capR - dy*dy));
    } else {
        // Cylinder Body
        return cylR;
    }
}

attribute vec3 aTarget; // Original target position on the "X"
attribute float aRandom; // Random offset for noise
attribute float aScale; // Individual particle scale

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

// Simplex Noise (standard implementation)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    
    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
           
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * n_ * n_);  // mod(p,7*7)
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
}

// SDF Utilities
float sdSphere(vec3 p, vec3 c, float r) {
    return length(p - c) - r;
}

float sdCylinder(vec3 p, float h, float r) {
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

void main() {
    vUv = uv;
    
    // Apply individual particle scale
    vec3 scaledPos = position * aScale;

    // Instance Matrix transformation
    vec4 worldPosition = instanceMatrix * vec4(scaledPos, 1.0);
    vec3 initialPos = worldPosition.xyz; 
    
    vec3 pos = aTarget;
    
    // Noise for idle movement
    float n = snoise(vec3(pos.x * 0.5, pos.y * 0.5, uTime * 0.2));
    vNoise = n;
    
    // Idle float
    pos.x += n * 0.05;
    pos.y += snoise(vec3(pos.y, pos.z, uTime * 0.3)) * 0.05;
    
    // --- GLOBAL DISASSEMBLY (Velocity Shock) ---
    if (uDisrupt > 0.01) {
        vec3 chaosDir = vec3(
            snoise(vec3(pos.yz * 0.5, uTime * 1.5)),
            snoise(vec3(pos.zx * 0.5, uTime * 1.5 + 10.0)),
            snoise(vec3(pos.xy * 0.5, uTime * 1.5 + 20.0))
        );
        pos += chaosDir * uDisrupt * 5.0; 
    }
    
    // --- Mouse Interaction (Drift) ---
    float radius = 2.5; // Larger influence radius for attraction
    float power = 2.5; // Positive = Attraction (Drag the swarm) 
    
    float dist = distance(pos, uMouse);
    
    if (dist < radius) {
        float influence = 1.0 - smoothstep(0.0, radius, dist);
        vec3 dir = normalize(uMouse - pos);
        vec3 scatterDir = vec3(
            snoise(vec3(pos.xy * 5.0, uTime * 2.0)),
            snoise(vec3(pos.yz * 5.0, uTime * 2.0 + 10.0)),
            snoise(vec3(pos.zx * 5.0, uTime * 2.0 + 20.0))
        );
        
        vec3 move = dir * (influence * power * 0.8 * uHover);
        move += scatterDir * (influence * power * 0.6 * uHover);
        pos += move;
    }

    // --- EXACT ANALYTIC PROJECTION ---
    
    float limitR = getRadiusAtY(pos.y);
    float currentR = length(pos.xz);
    
    // If outside the radius, clamp it back
    if (currentR > limitR) {
        // Project radially towards axis
        // Add a small buffer (-0.05) to keep clearly strictly inside
        float safeR = max(0.0, limitR - 0.05);
        if (currentR > 0.001) {
             pos.xz = (pos.xz / currentR) * safeR;
        } else {
             pos.xz = vec2(0.0);
        }
        
        // Add "Smear" velocity damping
        // If we hit the wall, we kill radial momentum (handled by next frame pos update inherently)
    }
    
    // Also clamp Y to absolute max sphere extent to prevent vertical escape
    // Top Sphere Max Y = -1.31 + 3.25 = 1.94
    // Bot Sphere Min Y = 1.31 - 3.25 = -1.94
    if (pos.y > 1.94) pos.y = 1.94 - 0.05;
    if (pos.y < -1.94) pos.y = -1.94 + 0.05;

    // Now adding the sphere vertex offset
    vec3 finalObjPos = pos + scaledPos;

    gl_Position = projectionMatrix * viewMatrix * vec4(finalObjPos, 1.0);
    
    vPosition = finalObjPos;
    vNormal = normal; 
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 normal = normalize(vNormal);

  // Fresnel
  float fresnel = dot(viewDir, normal);
  fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
  fresnel = pow(fresnel, 3.0);

  // Petrol Colors
  vec3 col = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
  
  // Iridescence
  vec3 iri = palette(fresnel + uTime * 0.2, 
      vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.00, 0.33, 0.67));

  col = mix(col, iri, fresnel);
  col += uColorB * pow(max(0.0, dot(viewDir, normal)), 4.0) * 0.5; // Specular

  gl_FragColor = vec4(col, 1.0);
}
`;

// --- CAPSULE SHADER ---
const capsuleVertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const capsuleFragmentShader = `
uniform float uTime;
uniform vec3 uMouse;
uniform float uDisrupt;
uniform float uImpact;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    float alpha = 0.0; // Completely transparent base
    vec3 color = vec3(0.5, 0.6, 0.7); // Glassy tint

    // 1. Grid/Wireframe effect (barycentric-ish fake via UVs)
    // Create a grid pattern
    float grid = step(0.98, fract(vUv.x * 20.0)) + step(0.98, fract(vUv.y * 10.0));
    // alpha += grid * 0.1; // Hide grid when idle

    // 2. Impact Glow
    // Calculate distance to mouse for "swarm center"
    float dist = distance(vPosition, uMouse);
    float glowRadius = 1.2; // Tighter impact zone
    
    // Scale glow strictly by uImpact (0 = no collision, 1 = heavy collision)
    float glow = 0.0;
    
    if (dist < glowRadius && uImpact > 0.01) {
        // Basic radial falloff
        float falloff = 1.0 - smoothstep(0.0, glowRadius, dist);
        
        // Granular Impact Noise: Simulate individual particles hitting
        // High frequency noise based on position
        float granular = fract(sin(dot(vPosition.xy + vPosition.z * 10.0, vec2(12.9898, 78.233))) * 43758.5453);
        
        // Only keep "sparks"
        float spark = step(0.6, granular); 
        
        glow = falloff * spark;
        glow = pow(glow, 2.0);
    }
    
    // STRICT Modulate by impact. No base glow.
    glow *= uImpact * 2.0; // Boost intensity of actual hits

    // Add random disruption flashes
    if (uDisrupt > 0.1) {
        float noise = fract(sin(dot(vPosition.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
        if (noise > 0.95) glow += 0.5 * uDisrupt;
    }

    vec3 glowColor = vec3(1.0, 0.6, 0.2); // Amber/Petrol Orange glow
    color += glowColor * glow * 2.0;
    alpha += glow * 0.4;

    gl_FragColor = vec4(color, alpha);
}
`;

function CapsuleContainer({ mouseRef, disruptionRef, glowRef }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Calculate Impact based on GLOW REF (Lagged Swarm Center), not raw mouse
            const m = glowRef.current; // Use the lagged position
            const mRad = Math.sqrt(m.x * m.x + m.z * m.z);
            const mY = Math.abs(m.y);

            // Wall Distance approx
            let dWall = 100.0;

            if (mY < 1.25) {
                // Cylinder region
                dWall = Math.abs(2.0 - mRad);
            } else {
                // Cap region approximation (Sphere R=3.25 at Y=1.31)
                // This is tricky in JS without full vector math per cap
                // Bias towards assuming if mRad is high, it's near wall
                dWall = Math.abs(3.0 - mRad); // Rough approx
            }

            // If mouse is near wall (dist < 1.0), high impact
            // Tighter threshold: only trigger when < 0.8 units from wall (radius of swarm is approx 0.5-0.8)
            const impact = 1.0 - THREE.MathUtils.smoothstep(0.2, 0.8, dWall);

            groupRef.current.children.forEach(mesh => {
                if (mesh.isMesh && mesh.material && mesh.material.uniforms) {
                    mesh.material.uniforms.uTime.value = state.clock.elapsedTime;

                    // Pass the LAGGED glowRef as the "Mouse" for the wall shader
                    // This ensures the glow appears where the swarm IS, not where the cursor IS
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
            {/* Body: Cylinder R=1.5, H=3.5 */}
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
                    side={THREE.DoubleSide} // Render inside and out
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Top Cap: Sphere R=3.25. Seam at Y=1.25. Center Y=-1.31. 
                Theta limit: cos(theta) = 2.56/3.25 = 0.787 -> 0.66 rad (38deg) */ }
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

            {/* Bottom Cap: Sphere R=3.25. Seam at Y=-1.25. Center Y=1.31.
                Theta start: PI - 0.66 = 2.48 rad */ }
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


export default function PetrolLogo({ text = 'X' }) {
    const meshRef = useRef();
    const targetAttrRef = useRef(); // Direct access to attribute
    const [staticData, setStaticData] = useState(null); // Randoms and Scales (Constant)

    // We maintain a persistent buffer for targets to avoid re-mounting attributes
    const targetBufferRef = useRef(new Float32Array(50000 * 3));

    const { camera, raycaster, pointer } = useThree();
    const mouseRef = useRef(new THREE.Vector3(9999, 9999, 0));

    // GlowRef tracks the VISUAL center of the swarm (lagging behind mouse)
    // This allows the glow to hit the wall *after* the mouse, syncing with particles
    const glowRef = useRef(new THREE.Vector3(9999, 9999, 0));

    // Physics refs
    const prevMousePos = useRef(new THREE.Vector3(0, 0, 0));
    const disruptionVal = useRef(0);

    // 1. Init Static Data (Randoms/Scales) - Runs once
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

    // 2. Init/Update Targets on Text Change
    useEffect(() => {
        if (!staticData) return;

        // Disruption Spike to Mask Transition
        disruptionVal.current = 1.5;

        const loader = new FontLoader();
        const font = loader.parse(helvetiker);

        // --- SIZING & LAYOUT ---
        let lines = [];
        if (text.length > 4) {
            const middle = Math.ceil(text.length / 2);
            const spaceIdx = text.indexOf(' ');
            if (spaceIdx > 0 && Math.abs(spaceIdx - middle) < 3) {
                lines = [text.slice(0, spaceIdx), text.slice(spaceIdx + 1)];
            } else {
                lines = [text.slice(0, middle), text.slice(middle)];
            }
        } else {
            lines = [text];
        }

        const maxLen = Math.max(...lines.map(l => l.length));
        const fontSize = 3.0 / maxLen;
        const scaleFactor = fontSize / 3.0;

        const tempGeometries = lines.map((lineStr, i) => {
            const geo = new TextGeometry(lineStr, {
                font: font,
                size: fontSize,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1 * scaleFactor,
                bevelSize: 0.05 * scaleFactor,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            geo.center();

            if (lines.length > 1) {
                const yOff = (i === 0) ? (fontSize * 0.65) : -(fontSize * 0.65);
                geo.translate(0, yOff, 0);
            }
            return geo;
        });

        let totalVerts = 0;
        tempGeometries.forEach(g => {
            if (g.attributes.position) totalVerts += g.attributes.position.count;
        });

        const mergedPosArray = new Float32Array(totalVerts * 3);
        let offset = 0;
        tempGeometries.forEach(g => {
            if (g.attributes.position) {
                mergedPosArray.set(g.attributes.position.array, offset);
                offset += g.attributes.position.array.length;
            }
            g.dispose();
        });

        const posAttribute = new THREE.BufferAttribute(mergedPosArray, 3);
        const count = staticData.count;
        const targets = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Random triangle
            const faceIndex = Math.floor(Math.random() * (posAttribute.count / 3));
            const ai = faceIndex * 3;
            const bi = faceIndex * 3 + 1;
            const ci = faceIndex * 3 + 2;

            const a = new THREE.Vector3().fromBufferAttribute(posAttribute, ai);
            const b = new THREE.Vector3().fromBufferAttribute(posAttribute, bi);
            const c = new THREE.Vector3().fromBufferAttribute(posAttribute, ci);

            // Random point on triangle
            const r1 = Math.random();
            const r2 = Math.random();
            const sqrtR1 = Math.sqrt(r1);
            const u = 1 - sqrtR1;
            const v = sqrtR1 * (1 - r2);
            const w = sqrtR1 * r2;

            const p = new THREE.Vector3()
                .addScaledVector(a, u)
                .addScaledVector(b, v)
                .addScaledVector(c, w);

            targets[i * 3] = p.x;
            targets[i * 3 + 1] = p.y;
            targets[i * 3 + 2] = p.z;
        }

        // DIRECT BUFFER UPDATE STRATEGY
        // Instead of setting state (which remounts), we write directly to the buffer
        targetBufferRef.current.set(targets);

        // Crucial: We must flag the attribute as dirty. 
        // We check BOTH the ref and the mesh geometry to ensure we hit the active instance.
        if (targetAttrRef.current) {
            targetAttrRef.current.needsUpdate = true;
        }

        if (meshRef.current && meshRef.current.geometry && meshRef.current.geometry.attributes.aTarget) {
            meshRef.current.geometry.attributes.aTarget.needsUpdate = true;
        }



    }, [text, staticData]); // Dependency on text triggers rebuild

    // Update Uniforms
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;

            const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            // Smooth mouse movement - Slower lerp for "viscous" feel (stays distorted longer)
            mouseRef.current.lerp(pos, 0.05); // Mouse moves relatively fast (The "Hand")

            // Glow/Swarm follows mouse with HEAVY inertia/lag
            // This simulates the fluid mass trailing behind the cursor
            glowRef.current.lerp(mouseRef.current, 0.02); // Very slow catchup

            // --- VELOCITY TRACKING & DISRUPTION ---
            // Calculate speed of mouse movement
            const speed = pos.distanceTo(prevMousePos.current) / delta;
            prevMousePos.current.copy(pos);

            // Threshold for chaos (if speed > 20 world units/sec)
            // If fast, target is 1.0 (Full Chaos)
            // If slow, target is 0.0 (Order)
            const targetDisrupt = speed > 100.0 ? 1.0 : 0.0;

            // Asymmetric dampening:
            // Attack fast (explode), Decay VERY slow (suspend)
            const attackRate = 0.1; // Fast rise
            const decayRate = 0.05; // Was 0.005 - Speed up recovery to prevent "freezing"

            if (targetDisrupt > disruptionVal.current) {
                disruptionVal.current = THREE.MathUtils.lerp(disruptionVal.current, targetDisrupt, attackRate);
            } else {
                disruptionVal.current = THREE.MathUtils.lerp(disruptionVal.current, targetDisrupt, decayRate);
            }

            meshRef.current.material.uniforms.uDisrupt.value = disruptionVal.current;
            meshRef.current.material.uniforms.uMouse.value.copy(mouseRef.current);
        }
    });

    // Use useMemo for uniforms to prevent object recreation on every render
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uHover: { value: 1.0 },
        uDisrupt: { value: 0.0 },
        uColorA: { value: new THREE.Color("#4a2c00") },
        uColorB: { value: new THREE.Color("#ff9900") },
        uColorC: { value: new THREE.Color("#050505") },
    }), []);

    // Stable references for attribute arguments to prevent re-instantiation
    const targetArgs = useMemo(() => [targetBufferRef.current, 3], []);

    // Safety check for staticData before accessing properties
    const randomArgs = useMemo(() => [staticData ? staticData.randoms : new Float32Array(0), 1], [staticData]);
    const scaleArgs = useMemo(() => [staticData ? staticData.scales : new Float32Array(0), 1], [staticData]);

    if (!staticData) return null;

    return (
        <>
            <CapsuleContainer mouseRef={mouseRef} disruptionRef={disruptionVal} glowRef={glowRef} />
            <instancedMesh ref={meshRef} args={[null, null, staticData.count]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent
                />
                <instancedBufferAttribute
                    ref={targetAttrRef}
                    attach="geometry-attributes-aTarget"
                    args={targetArgs}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aRandom"
                    args={randomArgs}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aScale"
                    args={scaleArgs}
                />
            </instancedMesh>
        </>
    );
}
