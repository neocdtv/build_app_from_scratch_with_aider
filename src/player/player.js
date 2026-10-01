import Voxel from './voxel.js';
import THREE from 'three';

class Player {
    constructor(x, z, camera) {
        this.position = new THREE.Vector3(x, 1.7, z);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.boundingBox = {
            minX: 0,
            maxX: 0.6,
            minY: 0,
            maxY: 1.8,
            width: 0.6,
            depth: 0.6,
            height: 1.8
        };
        this.gravity = 9.8;
        this.onGround = false;
        this.canJump = false;
        this.speed = 5.0;
        this.jumpForce = 8.0;
        this.camera = camera;
        this.input = {
            moveX: 0,
            moveZ: 0,
            lookX: 0,
            lookY: 0,
            jump: false
        };
    }

    update(deltaTime, chunkData) {
        if (deltaTime <= 0) return;

        // Apply gravity
        this.velocity.y -= this.gravity * deltaTime;

        // Apply horizontal movement
        this.velocity.x = this.input.moveX * this.speed;
        this.velocity.z = this.input.moveZ * this.speed;

        // Predict next position for collision detection
        const nextX = this.position.x + this.velocity.x * deltaTime;
        const nextZ = this.position.z + this.velocity.z * deltaTime;
        const nextY = this.position.y + this.velocity.y * deltaTime;

        // Raycast down to detect ground
        this.onGround = this.raycastDown(nextX, nextY, nextZ, chunkData);

        if (this.onGround) {
            this.velocity.y = 0;
            this.position.y = nextY;
            this.canJump = true;
        } else {
            this.canJump = false;
        }

        // Apply velocity
        this.position.x = nextX;
        this.position.y = nextY;
        this.position.z = nextZ;

        // Clamp player to ground (prevent falling through world)
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }

        // Update camera position
        if (this.camera) {
            this.camera.position.set(this.position.x, this.position.y + 1.7, this.position.z);
        }
    }

    raycastDown(x, y, z, chunkData) {
        // Simple raycast to find ground level
        const rayStep = 0.1;
        const rayLength = 5.0;
        
        for (let d = 0; d < rayLength; d += rayStep) {
            const checkY = y - d;
            const chunkX = Math.floor(x / 16);
            const chunkZ = Math.floor(z / 16);
            const localX = x - chunkX * 16;
            const localZ = z - chunkZ * 16;
            const localY = Math.floor(checkY);
            
            // Check if this position is within a chunk and has a solid block
            if (chunkData && chunkData.getChunk(chunkX, chunkZ)) {
                const chunk = chunkData.getChunk(chunkX, chunkZ);
                const blockType = chunk.getBlock(localX, localY, localZ);
                
                if (blockType !== 0) {
                    return true;
                }
            } else {
                // Default to ground at y=0 if no chunk data
                if (checkY <= 0) {
                    return true;
                }
            }
        }
        
        return false;
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
            this.canJump = false;
        }
    }

    isOnGround() {
        return this.onGround;
    }

    setBoundingBox(width, height) {
        this.boundingBox.width = width;
        this.boundingBox.height = height;
        this.boundingBox.maxX = width / 2;
        this.boundingBox.maxY = height;
    }
}

export default Player;
