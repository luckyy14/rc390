/**
 * Physics Worker
 * Handles heavy vertex-level distance calculations to avoid main-thread hitches.
 */

self.onmessage = function (e) {
    const { meshes, pointer, wipeRadius } = e.data;
    const toHide = {};

    if (!meshes || !pointer) return;

    const px = pointer.x;
    const py = pointer.y;
    const pz = pointer.z;

    meshes.forEach((mesh) => {
        const { name, positions, worldMatrix } = mesh;
        const hitIndices = [];

        // Check if any vertex is within wipeRadius
        // optimized to avoid object creation in inner loop
        for (let i = 0; i < positions.length; i += 3) {
            let vx = positions[i];
            let vy = positions[i + 1];
            let vz = positions[i + 2];

            // Manual matrix multiplication to transform local to world
            // worldMatrix is a 16-element array (column-major)
            const x = vx * worldMatrix[0] + vy * worldMatrix[4] + vz * worldMatrix[8] + worldMatrix[12];
            const y = vx * worldMatrix[1] + vy * worldMatrix[5] + vz * worldMatrix[9] + worldMatrix[13];
            const z = vx * worldMatrix[2] + vy * worldMatrix[6] + vz * worldMatrix[10] + worldMatrix[14];

            const dx = x - px;
            const dy = y - py;
            const dz = z - pz;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < wipeRadius * wipeRadius) {
                hitIndices.push(i / 3);
            }
        }

        if (hitIndices.length > 0) {
            toHide[name] = new Int32Array(hitIndices);
        }
    });

    self.postMessage({ toHide });
};
