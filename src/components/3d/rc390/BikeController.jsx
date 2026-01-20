import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useBikeControls } from "../../../hooks/useBikeControls";

/**
 * Handles movement logic and inverse kinematics for the KTM model.
 */
export default function BikeController({ scene }) {
    const [, setBikePosition] = useState({ x: 0, z: 0 }); // Track for internal UI if needed
    const bikeBasisRef = useRef(null);
    const wheelAxisControlRef = useRef(null);
    const steeringControlRef = useRef(null);
    const keysPressed = useBikeControls(); // Use the modular hook

    const isInitialized = useRef(false);
    const startTime = useRef(Date.now());
    const currentSpeed = useRef(0.0001);

    // Configuration
    const MAX_STEERING_ANGLE_DEGREES = 35.0;

    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.name === "Bike_Basis_") {
                    bikeBasisRef.current = child;
                    child.position.set(0, 0, 0);
                } else if (child.name === "Wheel_Axis_Control") {
                    wheelAxisControlRef.current = child;
                    child.position.x = 0;
                } else if (child.name === "Steering_Control") {
                    steeringControlRef.current = child;
                    child.rotation.y = 0;
                }
            });
            isInitialized.current = true;
        }
    }, [scene]);

    useFrame((state, delta) => {
        if (!bikeBasisRef.current || !isInitialized.current) return;

        const moveSpeed = currentSpeed.current;
        const maxDistance = 2;

        const hasW = keysPressed.current.has('w');
        const hasA = keysPressed.current.has('a');
        const hasS = keysPressed.current.has('s');
        const hasD = keysPressed.current.has('d');
        const hasR = keysPressed.current.has('r');

        if (hasR) {
            bikeBasisRef.current.position.set(0, 0, 0);
            setBikePosition({ x: 0, z: 0 });
            if (wheelAxisControlRef.current) wheelAxisControlRef.current.position.x = 0;
            if (steeringControlRef.current) steeringControlRef.current.rotation.y = 0;
            return;
        }

        const elapsedTime = (Date.now() - startTime.current) / 1000;
        const maxSpeed = 0.0009;
        const minSpeed = 0.0001;
        const rampDuration = 10;

        currentSpeed.current = elapsedTime < rampDuration
            ? minSpeed + (maxSpeed - minSpeed) * (elapsedTime / rampDuration)
            : maxSpeed;

        if (!hasW && !hasA && !hasS && !hasD) {
            if (bikeBasisRef.current.position.x !== 0 || bikeBasisRef.current.position.z !== 0) {
                bikeBasisRef.current.position.x = 0;
                bikeBasisRef.current.position.z = 0;
                setBikePosition({ x: 0, z: 0 });
            }
            return;
        }

        if (hasW) {
            bikeBasisRef.current.position.x += moveSpeed * 2;
            if (bikeBasisRef.current.position.x > maxDistance) bikeBasisRef.current.position.x = maxDistance;
        } else if (hasS) {
            bikeBasisRef.current.position.x -= moveSpeed * 2;
            if (bikeBasisRef.current.position.x < -maxDistance) bikeBasisRef.current.position.x = -maxDistance;
        }

        if ((hasW || hasS) && (hasA || hasD)) {
            if (hasA) {
                bikeBasisRef.current.position.z -= moveSpeed;
                if (bikeBasisRef.current.position.z < -maxDistance) bikeBasisRef.current.position.z = -maxDistance;
            } else if (hasD) {
                bikeBasisRef.current.position.z += moveSpeed;
                if (bikeBasisRef.current.position.z > maxDistance) bikeBasisRef.current.position.z = maxDistance;
            }
        }

        setBikePosition({
            x: bikeBasisRef.current.position.x,
            z: bikeBasisRef.current.position.z
        });

        if (steeringControlRef.current) {
            if (hasA) {
                steeringControlRef.current.rotation.y = MAX_STEERING_ANGLE_DEGREES * Math.PI / 180;
            } else if (hasD) {
                steeringControlRef.current.rotation.y = -MAX_STEERING_ANGLE_DEGREES * Math.PI / 180;
            } else {
                steeringControlRef.current.rotation.y = 0;
            }
        }
    });

    return null;
}
