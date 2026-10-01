import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export class Chunk {
    constructor() {
        this.blockData = this.createBlockData();
        this.mesh = this.createInstancedMesh();
        this.generateTerrain();
    }

    createBlockData() {
        const data = [];
        for (let x = 0; x < 16; x++) {
            data[x] = [];
            for (let y = 0; y < 16; y++) {
                data[x][y] = [];
                for (let z = 0; z < 16; z++) {
                    data[x][y][z] = 0; // Initialize with air
                }
            }
        }
        return data;
    }

    createInstancedMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Grass color
        const mesh = new THREE.InstancedMesh(geometry, material, 16 * 16 * 16);

        // Initialize the instanceMatrix with identity matrices
        const instanceMatrix = new Float32Array(16 * 16 * 16 * 16);
        for (let i = 0; i < 16 * 16 * 16; i++) {
            const matrix = new THREE.Matrix4().identity();
            matrix.toArray(instanceMatrix, i * 16);
        }

        mesh.instanceMatrix.set(instanceMatrix);
        mesh.instanceMatrix.needsUpdate = true;
        return mesh;
    }

    setBlock(x, y, z, typeId) {
        if (x < 0 || x >= 16 || y < 0 || y >= 16 || z < 0 || z >= 16) return;

        const index = z * 16 * 16 + y * 16 + x;
        const matrix = new THREE.Matrix4().makeTranslation(x, y, z);

        if (typeId !== 0) {
            this.mesh.instanceMatrix.set(matrix.elements, index * 16);
            this.mesh.instanceMatrix.needsUpdate = true;
        }

        this.blockData[x][y][z] = typeId;
    }

    getNoise(x, z) {
        // Simple 2D noise using sine and cosine for a natural undulating look
        const value = Math.sin(x * 0.1) * Math.cos(z * 0.1) +
                      Math.sin(x * 0.2) * Math.cos(z * 0.2) +
                      Math.sin(x * 0.3) * Math.cos(z * 0.3);
        return value * 6 + 6; // Scales to 0–12
    }

    generateTerrain() {
        const noiseScale = 0.1;
        const maxHeight = 12;

        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                const noiseValue = this.getNoise(x * noiseScale, z * noiseScale);
                const height = Math.floor(noiseValue);
                const clampedHeight = Math.max(0, Math.min(maxHeight, height));

                for (let y = 0; y <= clampedHeight; y++) {
                    const typeId = (y === clampedHeight) ? BLOCK_GRASS : BLOCK_DIRT;
                    this.setBlock(x, y, z, typeId);
                }
            }
        }
    }
}
