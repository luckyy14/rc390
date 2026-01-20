/**
 * GLSL Shaders for the Petrol Particle Logo and its Capsule Container.
 */

// --- LOGO VERTEX SHADER ---
export const logoVertexShader = `
uniform float uTime;
uniform vec3 uMouse;
uniform float uHover;
uniform float uDisrupt;

float getRadiusAtY(float y) {
    float halfH = 1.25;
    float cylR = 2.0;
    float capR = 3.25;
    float centerTopY = -1.31;
    float centerBotY = 1.31;
    
    if (y > halfH) {
        float dy = y - centerTopY;
        if (dy > capR) return 0.0;
        return sqrt(max(0.0, capR*capR - dy*dy));
    } else if (y < -halfH) {
        float dy = y - centerBotY;
        if (abs(dy) > capR) return 0.0;
        return sqrt(max(0.0, capR*capR - dy*dy));
    } else {
        return cylR;
    }
}

attribute vec3 aTarget;
attribute float aRandom;
attribute float aScale;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * n_ * n_);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
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
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vUv = uv;
    vec3 scaledPos = position * aScale;
    vec4 worldPosition = instanceMatrix * vec4(scaledPos, 1.0);
    vec3 pos = aTarget;
    float n = snoise(vec3(pos.x * 0.5, pos.y * 0.5, uTime * 0.2));
    vNoise = n;
    pos.x += n * 0.05;
    pos.y += snoise(vec3(pos.y, pos.z, uTime * 0.3)) * 0.05;
    
    if (uDisrupt > 0.01) {
        vec3 chaosDir = vec3(
            snoise(vec3(pos.yz * 0.5, uTime * 1.5)),
            snoise(vec3(pos.zx * 0.5, uTime * 1.5 + 10.0)),
            snoise(vec3(pos.xy * 0.5, uTime * 1.5 + 20.0))
        );
        pos += chaosDir * uDisrupt * 5.0; 
    }
    
    float radius = 1.5; float power = 1.5;
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

    float limitR = getRadiusAtY(pos.y);
    float currentR = length(pos.xz);
    if (currentR > limitR) {
        float safeR = max(0.0, limitR - 0.05);
        if (currentR > 0.001) pos.xz = (pos.xz / currentR) * safeR;
        else pos.xz = vec2(0.0);
    }
    
    if (pos.y > 1.94) pos.y = 1.94 - 0.05;
    if (pos.y < -1.94) pos.y = -1.94 + 0.05;

    vec3 finalObjPos = pos + scaledPos;
    gl_Position = projectionMatrix * viewMatrix * vec4(finalObjPos, 1.0);
    vPosition = finalObjPos;
    vNormal = normal; 
}
`;

// --- LOGO FRAGMENT SHADER ---
export const logoFragmentShader = `
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
  float fresnel = dot(viewDir, normal);
  fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
  fresnel = pow(fresnel, 3.0);
  vec3 col = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
  vec3 iri = palette(fresnel + uTime * 0.2, 
      vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.00, 0.33, 0.67));
  col = mix(col, iri, fresnel);
  col += uColorB * pow(max(0.0, dot(viewDir, normal)), 4.0) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

// --- CAPSULE VERTEX SHADER ---
export const capsuleVertexShader = `
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

// --- CAPSULE FRAGMENT SHADER ---
export const capsuleFragmentShader = `
uniform float uTime;
uniform vec3 uMouse;
uniform float uDisrupt;
uniform float uImpact;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    float alpha = 0.0;
    vec3 color = vec3(0.5, 0.6, 0.7);
    float dist = distance(vPosition, uMouse);
    float glowRadius = 1.2;
    float glow = 0.0;
    
    if (dist < glowRadius && uImpact > 0.01) {
        float falloff = 1.0 - smoothstep(0.0, glowRadius, dist);
        float granular = fract(sin(dot(vPosition.xy + vPosition.z * 10.0, vec2(12.9898, 78.233))) * 43758.5453);
        float spark = step(0.6, granular); 
        glow = falloff * spark;
        glow = pow(glow, 2.0);
    }
    
    glow *= uImpact * 2.0;
    if (uDisrupt > 0.1) {
        float noise = fract(sin(dot(vPosition.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
        if (noise > 0.95) glow += 0.5 * uDisrupt;
    }

    vec3 glowColor = vec3(1.0, 0.6, 0.2);
    color += glowColor * glow * 2.0;
    alpha += glow * 0.4;
    gl_FragColor = vec4(color, alpha);
}
`;
