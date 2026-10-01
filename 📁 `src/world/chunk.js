import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export class Chunk {
    constructor() {
        this.blockData = this.createBlockData();
        this.mesh = this.createInstancedMesh();
    }

    createBlockData() {
        const data = [];
        for (let x = 0; x < 16; x++) {
            data[x] = [];
            for (let y = 0; y < 16; y++) {
                data[x][y] = [];
                for (let z = 0; z < 16; z++) {
                    data[x][y][z] = 2; // Initialize with grass
                }
            }
        }
        return data;
    }

    createInstancedMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Grass color
        const mesh = new THREE.InstancedMesh(geometry, material, 16 * 16 * 16);

        const instanceMatrix = new Float32Array(16 * 16 * 16 * 16);
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    const index = z * 16 * 16 + y * 16 + x;
                    const matrix = new THREE.Matrix4().makeTranslation(x, y, z);
                    matrix.toArray(instanceMatrix, index * 16);
                }
            }
        }

        mesh.instanceMatrix.set(instanceMatrix);
        mesh.instanceMatrix.needsUpdate = true;
        return mesh;
    }

    setBlock(x, y, z, typeId) {
        if (x < 0 || x >= 16 || y < 0 || y >= 16 || z < 0 || z >= 16) return;
        const index = z * 16 * 16 + y * 16 + x;
        const matrix = new THREE.Matrix4().makeTranslation(x, y, z);
        this.mesh.instanceMatrix.set(matrix.elements, index * 16);
        this.mesh.instanceMatrix.needsUpdate = true;
        this.blockData[x][y][z] = typeId;
    }
}
