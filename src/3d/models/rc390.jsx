import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";

/**
 * Rc390 - Reusable KTM RC390 3D model component.
 * @param {Object} props
 * @param {number} [props.scale=1] - Uniform scale for the model.
 * @param {Array} [props.position=[0, -0.6, 0]] - Position of the model.
 * @param {Function} [props.onSceneReady] - Callback when scene is ready.
 * @returns JSX.Element
 */
import * as THREE from "three";

export function Rc390({ scale = 1, position = [0, -0.6, 0], foamMap, onSceneReady }) {
const { scene: originalScene } = useGLTF("/src/3d/glb/ktm.glb");
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
      
      // Notify parent component that scene is ready
      if (onSceneReady) {
        onSceneReady(scene);
      }
    }
  }, [foamMap, scene, onSceneReady]);

  return <primitive object={scene} position={position} scale={[scale, scale, scale]} />;
}

/**
 * BikeController - Handles keyboard controls and inverse kinematics for the bike
 */
function BikeController({ scene }) {
  const [bikePosition, setBikePosition] = useState({ x: 0, z: 0 });
  const bikeBasisRef = useRef(null);
  const wheelAxisControlRef = useRef(null);
  const steeringControlRef = useRef(null);
  const keysPressed = useRef(new Set());
  const previousBikeMatrix = useRef(null);
  const accumulatedWheelX = useRef(0);
  const isInitialized = useRef(false);
  const startTime = useRef(Date.now());
  const currentSpeed = useRef(0.0001);

  // Configuration (matching Blender script)
  const WHEELBASE_LENGTH = 1.37;
  const MAX_STEERING_ANGLE_DEGREES = 35.0;
  const STEERING_SENSITIVITY = 0.3;
  const STEERING_DIRECTION_MULTIPLIER = 1.0;

  // Find the bike objects in the scene
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.name === "Bike_Basis_") {
          bikeBasisRef.current = child;
          // Ensure bike starts at origin
          child.position.set(0, 0, 0);
        } else if (child.name === "Wheel_Axis_Control") {
          wheelAxisControlRef.current = child;
          // Reset wheel position
          child.position.x = 0;
        } else if (child.name === "Steering_Control") {
          steeringControlRef.current = child;
          // Reset steering to center
          child.rotation.y = 0;
        }
      });
      // Mark as initialized after finding all objects
      isInitialized.current = true;
    }
  }, [scene]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const code = event.code.toLowerCase();
      
      // Check for W, A, S, D, R keys using multiple methods
      if (key === 'w' || key === 'a' || key === 's' || key === 'd' || key === 'r' || 
          code === 'keyw' || code === 'keya' || code === 'keys' || code === 'keyd' || code === 'keyr' || 
          event.keyCode === 87 || event.keyCode === 65 || event.keyCode === 83 || event.keyCode === 68 || event.keyCode === 82) {
        event.preventDefault();
        event.stopPropagation();
        keysPressed.current.add(key);
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const code = event.code.toLowerCase();
      
      if (key === 'w' || key === 'a' || key === 's' || key === 'd' || key === 'r' || 
          code === 'keyw' || code === 'keya' || code === 'keys' || code === 'keyd' || code === 'keyr' || 
          event.keyCode === 87 || event.keyCode === 65 || event.keyCode === 83 || event.keyCode === 68 || event.keyCode === 82) {
        event.preventDefault();
        event.stopPropagation();
        keysPressed.current.delete(key);
      }
    };

    // Use capture phase to intercept events before browser handles them
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, []);

  // Update bike position and calculate inverse kinematics
  useFrame(() => {
    if (!bikeBasisRef.current || !isInitialized.current) return;

    const moveSpeed = currentSpeed.current; // Same speed for all directions
    const maxDistance = 2;

    const hasW = keysPressed.current.has('w');
    const hasA = keysPressed.current.has('a');
    const hasS = keysPressed.current.has('s');
    const hasD = keysPressed.current.has('d');
    const hasR = keysPressed.current.has('r');

    // Handle R key reset
    if (hasR) {
      bikeBasisRef.current.position.set(0, 0, 0);
      setBikePosition({ x: 0, z: 0 });
      accumulatedWheelX.current = 0;
      if (wheelAxisControlRef.current) {
        wheelAxisControlRef.current.position.x = 0;
      }
      if (steeringControlRef.current) {
        steeringControlRef.current.rotation.y = 0;
      }
      return;
    }

    // Calculate speed ramping over 10 seconds
    const elapsedTime = (Date.now() - startTime.current) / 1000; // seconds
    const maxSpeed = 0.0009;
    const minSpeed = 0.0001;
    const rampDuration = 10; // 10 seconds
    
    if (elapsedTime < rampDuration) {
      currentSpeed.current = minSpeed + (maxSpeed - minSpeed) * (elapsedTime / rampDuration);
    } else {
      currentSpeed.current = maxSpeed;
    }

    // Only proceed if any movement keys are pressed
    if (!hasW && !hasA && !hasS && !hasD) {
      // If no keys pressed, ensure bike is at rest position
      if (bikeBasisRef.current.position.x !== 0 || bikeBasisRef.current.position.z !== 0) {
        bikeBasisRef.current.position.x = 0;
        bikeBasisRef.current.position.z = 0;
        setBikePosition({ x: 0, z: 0 });
      }
      return; // Exit early if no movement
    }

    // Store previous matrix for delta calculation
    const currentMatrix = bikeBasisRef.current.matrixWorld.clone();
    
    // Update X position (front/back) - matches Blender X
    if (hasW) {
      setBikePosition(prev => ({ ...prev, x: Math.min(prev.x + moveSpeed, maxDistance) }));
    } else if (hasS) {
      setBikePosition(prev => ({ ...prev, x: Math.max(prev.x - moveSpeed, -maxDistance) }));
    } else {
      // Return X to center when no W/S keys are pressed
      setBikePosition(prev => ({
        ...prev,
        x: Math.abs(prev.x) < moveSpeed ? 0 : prev.x > 0 ? prev.x - moveSpeed : prev.x + moveSpeed
      }));
    }

    // Update Z position (side movement) - only when moving forward/backward
    if ((hasW || hasS) && (hasA || hasD)) {
      if (hasA) {
        setBikePosition(prev => ({ ...prev, z: Math.max(prev.z - moveSpeed, -maxDistance) }));
      } else if (hasD) {
        setBikePosition(prev => ({ ...prev, z: Math.min(prev.z + moveSpeed, maxDistance) }));
      }
    } else {
      // Return Z to center when not moving forward/backward or no A/D keys
      setBikePosition(prev => ({
        ...prev,
        z: Math.abs(prev.z) < moveSpeed ? 0 : prev.z > 0 ? prev.z - moveSpeed : prev.z + moveSpeed
      }));
    }

    // Apply position to the Bike_Basis_ with correct axis mapping
    bikeBasisRef.current.position.x = bikePosition.x;  // Our X = Blender X
    bikeBasisRef.current.position.z = bikePosition.z;  // Our Z = Blender Y (side movement)

    // Calculate inverse kinematics if we have previous matrix
    if (previousBikeMatrix.current && wheelAxisControlRef.current && steeringControlRef.current) {
      // Calculate delta transformation
      const deltaMatrix = previousBikeMatrix.current.clone().invert().multiply(currentMatrix);
      
      // Extract delta location and rotation with correct axis mapping
      const deltaLocation = new THREE.Vector3();
      deltaMatrix.decompose(deltaLocation, new THREE.Quaternion(), new THREE.Vector3());
      
      const deltaForwardDistance = deltaLocation.x;  // Our X = Blender X

      // Update wheel rotation
      accumulatedWheelX.current += deltaForwardDistance;
      if (wheelAxisControlRef.current) {
        wheelAxisControlRef.current.position.x = accumulatedWheelX.current;
      }

      // Calculate steering angle only when A or D keys are pressed
      let steeringAngleRadians = 0.0;
      
      if (hasA || hasD) {
        // Direct steering control based on A/D keys
        if (hasA) {
          steeringAngleRadians = MAX_STEERING_ANGLE_DEGREES * Math.PI / 180; // Turn left
        } else if (hasD) {
          steeringAngleRadians = -MAX_STEERING_ANGLE_DEGREES * Math.PI / 180; // Turn right
        }
        
        // Apply steering sensitivity and direction multiplier
        steeringAngleRadians *= STEERING_SENSITIVITY * STEERING_DIRECTION_MULTIPLIER;
        
        // Clamp steering angle
        const maxSteeringRadians = MAX_STEERING_ANGLE_DEGREES * Math.PI / 180;
        steeringAngleRadians = Math.max(-maxSteeringRadians, Math.min(maxSteeringRadians, steeringAngleRadians));
      } else {
        // Return steering to center when no A/D keys are pressed
        if (steeringControlRef.current) {
          const currentSteering = steeringControlRef.current.rotation.y;
          const steeringReturnSpeed = 0.05;
          if (Math.abs(currentSteering) < steeringReturnSpeed) {
            steeringControlRef.current.rotation.y = 0;
          } else {
            steeringControlRef.current.rotation.y = currentSteering > 0 ? 
              currentSteering - steeringReturnSpeed : currentSteering + steeringReturnSpeed;
          }
        }
        return; // Skip steering application
      }

      // Apply steering to the control object with correct axis mapping
      if (steeringControlRef.current) {
        steeringControlRef.current.rotation.y = steeringAngleRadians;  // Our Y = Blender Z (steering)
      }
    }

    // Store current matrix for next frame
    previousBikeMatrix.current = currentMatrix.clone();
  });

  return null;
}

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#e5e7eb" />
    </mesh>
  );
}

function CameraZoom({ zoom }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  });
  return null;
}

/**
 * Rc390Viewer - Full interactive viewer for the RC390 model.
 * Includes scale and zoom sliders, camera controls, and lighting.
 */
export function Rc390Viewer({
  environmentPreset = "warehouse",
  sceneElements,
  children,
}) {
  const [scale, setScale] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [scene, setScene] = useState(null);

  const handleSceneReady = (sceneObject) => {
    setScene(sceneObject);
  };

  return (
    <div className="w-full h-[80vh] bg-[var(--color-bg)] relative p-4 md:p-8">
      <div
        className="absolute top-6 left-6 z-10 bg-[rgba(26,26,26,0.85)] p-4 md:p-6 rounded-lg shadow-lg border border-[var(--color-border)] min-w-[260px]"
        style={{
          fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
          color: "#E0E0E0",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          {/* Scale icon */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <rect x="2" y="8" width="16" height="4" rx="2" fill="#FF6F00"/>
            <rect x="7" y="6" width="6" height="8" rx="2" fill="#1A1A1A"/>
          </svg>
          <label className="font-bold tracking-wide" style={{ minWidth: 60 }}>
            Scale
          </label>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.01"
            value={scale}
            onChange={e => setScale(Number(e.target.value))}
            style={{
              width: 120,
              marginLeft: 8,
              accentColor: "#FF6F00",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #FF6F00 60%, #FF8C1A 100%)",
              boxShadow: "0 0 6px #FF6F0088",
              outline: "none",
              border: "1px solid #333",
              height: 4,
            }}
            className="focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <span style={{ marginLeft: 12, fontFamily: "Rajdhani, Inter, sans-serif", fontWeight: 700 }}>
            {scale.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Zoom icon */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="#FF6F00" strokeWidth="2" fill="#1A1A1A"/>
            <rect x="9" y="4" width="2" height="12" rx="1" fill="#FF6F00"/>
            <rect x="4" y="9" width="12" height="2" rx="1" fill="#FF6F00"/>
          </svg>
          <label className="font-bold tracking-wide" style={{ minWidth: 60 }}>
            Zoom
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.01"
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{
              width: 120,
              marginLeft: 8,
              accentColor: "#FF6F00",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #FF6F00 60%, #FF8C1A 100%)",
              boxShadow: "0 0 6px #FF6F0088",
              outline: "none",
              border: "1px solid #333",
              height: 4,
            }}
            className="focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <span style={{ marginLeft: 12, fontFamily: "Rajdhani, Inter, sans-serif", fontWeight: 700 }}>
            {zoom.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Bike Movement Controls Info */}
      <div
        className="absolute top-6 right-6 z-10 bg-[rgba(26,26,26,0.85)] p-4 md:p-6 rounded-lg shadow-lg border border-[var(--color-border)]"
        style={{
          fontFamily: "Oswald, Rajdhani, Inter, sans-serif",
          color: "#E0E0E0",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="#FF6F00" strokeWidth="2" fill="none"/>
            <path d="M10 2 L10 18 M2 10 L18 10" stroke="#FF6F00" strokeWidth="2"/>
          </svg>
          <span className="font-bold tracking-wide">Bike Controls</span>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#333] rounded text-xs font-mono">W</kbd>
            <span>Forward (X-axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#333] rounded text-xs font-mono">S</kbd>
            <span>Backward (X-axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#333] rounded text-xs font-mono">A</kbd>
            <span>Turn Left (Z-axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#333] rounded text-xs font-mono">D</kbd>
            <span>Turn Right (Z-axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#333] rounded text-xs font-mono">R</kbd>
            <span>Reset to Center</span>
          </div>
        </div>
      </div>

      <Canvas shadows camera={{ position: [2, 2, 5], fov: 50, zoom }}>
        <CameraZoom zoom={zoom} />
        <ambientLight intensity={0.5} />
        {/* Ceiling lights */}
        <rectAreaLight
          position={[0, 5, 0]}
          width={6}
          height={6}
          intensity={8}
          color="#fff"
          lookAt={[0, 0, 0]}
        />
        <directionalLight
          position={[2, 5, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
          <Rc390 scale={scale} onSceneReady={handleSceneReady} />
          <BikeController scene={scene} />
        </Suspense>
        {sceneElements}
        <OrbitControls enablePan enableZoom enableRotate />
        <Environment preset={environmentPreset} />
        {children}
      </Canvas>
    </div>
  );
}
