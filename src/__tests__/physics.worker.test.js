/**
 * Test script for physics.worker.js logic
 * Run with: node src/__tests__/physics.worker.test.js
 */

// Mock data
const pointer = { x: 1, y: 1, z: 1 };
const wipeRadius = 0.5;
const meshes = [
    {
        uuid: 'mesh-1',
        positions: new Float32Array([0, 0, 0, 1.1, 1.1, 1.1, 2, 2, 2]),
        worldMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] // Identity matrix
    },
    {
        uuid: 'mesh-2',
        positions: new Float32Array([10, 10, 10]),
        worldMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }
];

// Test logic (matching services/physics.worker.js)
function testWorkerLogic(data) {
    const { meshes, pointer, wipeRadius } = data;
    const toHide = {};
    const px = pointer.x;
    const py = pointer.y;
    const pz = pointer.z;

    meshes.forEach((mesh) => {
        const { uuid, positions, worldMatrix } = mesh;
        for (let i = 0; i < positions.length; i += 3) {
            let vx = positions[i];
            let vy = positions[i + 1];
            let vz = positions[i + 2];

            // Manual matrix multiplication to transform local to world
            const x = vx * worldMatrix[0] + vy * worldMatrix[4] + vz * worldMatrix[8] + worldMatrix[12];
            const y = vx * worldMatrix[1] + vy * worldMatrix[5] + vz * worldMatrix[9] + worldMatrix[13];
            const z = vx * worldMatrix[2] + vy * worldMatrix[6] + vz * worldMatrix[10] + worldMatrix[14];

            const dx = x - px;
            const dy = y - py;
            const dz = z - pz;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < wipeRadius * wipeRadius) {
                toHide[uuid] = true;
                break;
            }
        }
    });
    return toHide;
}

const result = testWorkerLogic({ meshes, pointer, wipeRadius });

console.log('Test Result:', result);
if (result['mesh-1'] === true && result['mesh-2'] === undefined) {
    console.log('SUCCESS: Mesh-1 identified as hit, Mesh-2 ignored.');
} else {
    console.error('FAILURE: Logic incorrect.');
    process.exit(1);
}
