import Voxel from './voxel.js';

class Chunk {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.chunkSize = 16;
        this.data = [];
        this.mesh = null;
        this.generateTerrain();
    }

    // Simplex noise implementation for procedural terrain
    simplexNoise(x, y, z) {
        // Simple 3D noise using sine waves for lightweight generation
        const scale = 0.1;
        const freq = 0.05;
        const amplitude = 12;
        
        return Math.sin(x * freq) * amplitude +
               Math.cos(y * freq) * amplitude +
               Math.sin(z * freq) * amplitude;
    }

    generateTerrain() {
        // Initialize 16x16x16 3D array
        this.data = new Array(this.chunkSize * this.chunkSize * this.chunkSize).fill(0);

        for (let x = 0; x < this.chunkSize; x++) {
            for (let z = 0; z < this.chunkSize; z++) {
                // Calculate noise-based height at this position
                const noiseValue = this.simplexNoise(x, 0, z);
                const height = Math.floor(Math.max(1, Math.min(12, noiseValue + 6)));
                
                for (let y = 0; y < this.chunkSize; y++) {
                    let typeId = 0; // air
                    
                    // Fill from bottom up to the height
                    if (y < height) {
                        if (y === height - 1) {
                            typeId = 2; // grass on top
                        } else {
                            typeId = 1; // dirt below grass
                        }
                    }
                    
                    this.data[this.getIndex(x, y, z)] = typeId;
                }
            }
        }

        this.createMesh();
    }

    getIndex(x, y, z) {
        return x + y * this.chunkSize + z * this.chunkSize * this.chunkSize;
    }

    getBlock(x, y, z) {
        if (x < 0 || x >= this.chunkSize || y < 0 || y >= this.chunkSize || z < 0 || z >= this.chunkSize) {
            return 0; // air outside chunk
        }
        return this.data[this.getIndex(x, y, z)];
    }

    setBlock(x, y, z, typeId) {
        if (x >= 0 && x < this.chunkSize && y >= 0 && y < this.chunkSize && z >= 0 && z < this.chunkSize) {
            const index = this.getIndex(x, y, z);
            const oldTypeId = this.data[index];
            this.data[index] = typeId;
            this.updateMesh();
            return oldTypeId;
        }
        return 0;
    }

    getBlockAtRaycast(rayOrigin, rayDirection) {
        // Trace ray through the voxel world to find blocks
        const step = 0.5;
        const maxDistance = 50;
        const origin = rayOrigin.clone();
        const direction = rayDirection.clone().normalize();
        
        for (let t = 0; t < maxDistance; t += step) {
            const worldX = origin.x + direction.x * t;
            const worldY = origin.y + direction.y * t;
            const worldZ = origin.z + direction.z * t;
            
            const chunkX = Math.floor(worldX / this.chunkSize);
            const chunkZ = Math.floor(worldZ / this.chunkSize);
            
            // For simplicity, assume we're in our own chunk
            const localX = worldX - this.x * this.chunkSize;
            const localZ = worldZ - this.z * this.chunkSize;
            const localY = Math.floor(worldY);
            
            const blockType = this.getBlock(localX, localY, localZ);
            
            if (blockType !== 0) {
                return {
                    x: localX,
                    y: localY,
                    z: localZ,
                    type: blockType
                };
            }
        }
        
        return null;
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const count = this.chunkSize * this.chunkSize * this.chunkSize;
        
        this.mesh = new THREE.InstancedMesh(geometry, new THREE.MeshLambertMaterial({ color: 0x888888 }), count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
        this.mesh.userData.chunk = this;
        
        let index = 0;
        const matrix = new THREE.Matrix4();

        for (let x = 0; x < this.chunkSize; x++) {
            for (let y = 0; y < this.chunkSize; y++) {
                for (let z = 0; z < this.chunkSize; z++) {
                    const typeId = this.data[index];
                    
                    if (typeId === 0) {
                        // Skip air blocks
                        matrix.identity();
                    } else {
                        // Position block in world space
                        const chunkPosition = new THREE.Vector3(this.x * this.chunkSize, 0, this.z * this.chunkSize);
                        const blockPosition = new THREE.Vector3(x, y, z);
                        
                        matrix.setPosition(chunkPosition.clone().add(blockPosition));
                    }
                    
                    matrix.scaleScalar(1);
                    this.mesh.setMatrixAt(index, matrix);
                    index++;
                }
            }
        }

        this.mesh.count = index;
        this.mesh.needsUpdate = true;
    }

    updateMesh() {
        if (!this.mesh) return;

        let index = 0;
        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();

        for (let x = 0; x < this.chunkSize; x++) {
            for (let y = 0; y < this.chunkSize; y++) {
                for (let z = 0; z < this.chunkSize; z++) {
                    const typeId = this.data[index];

                    if (typeId === 0) {
                        // Skip air blocks
                        matrix.identity();
                    } else {
                        // Position block in world space
                        const chunkPosition = new THREE.Vector3(this.x * this.chunkSize, 0, this.z * this.chunkSize);
                        const blockPosition = new THREE.Vector3(x, y, z);

                        matrix.setPosition(chunkPosition.clone().add(blockPosition));

                        // Set different colors based on block type
                        if (typeId === 1) {
                            color.setHex(0x8B4513); // dirt brown
                        } else if (typeId === 2) {
                            color.setHex(0x228B22); // grass green
                        } else {
                            color.setHex(0x888888); // default
                        }
                        this.mesh.setColorAt(index, color);
                    }

                    matrix.scaleScalar(1);
                    this.mesh.setMatrixAt(index, matrix);
                    index++;
                }
            }
        }

        this.mesh.count = index;
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
    }

    dispose() {
        if (this.mesh) {
            this.mesh.dispose();
            this.mesh = null;
        }
    }
}

export default Chunk;
