import * as THREE from "three";
import { getVoxelColor } from "./voxel.js";

export class VoxelWorld {
  constructor(scene) {
    this.scene = scene;
    this.size = 32;
    this.maxHeight = 12;
    this.offset = this.size / 2;

    this.heights = new Uint8Array(this.size * this.size);
    this.generateHeightmap();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.size * this.size
    );
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;

    this.matrix = new THREE.Matrix4();
    this.position = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.scale = new THREE.Vector3();

    this.rebuild();
    this.scene.add(this.mesh);
  }

  generateHeightmap() {
    for (let z = 0; z < this.size; z += 1) {
      for (let x = 0; x < this.size; x += 1) {
        const noise =
          Math.sin(x * 0.35) * 2.0 +
          Math.cos(z * 0.28) * 2.0 +
          Math.sin((x + z) * 0.18) * 1.5;

        const height = Math.round(4 + noise);
        this.heights[z * this.size + x] = THREE.MathUtils.clamp(
          height,
          1,
          this.maxHeight
        );
      }
    }
  }

  getHeightAt(worldX, worldZ) {
    const x = THREE.MathUtils.clamp(
      Math.floor(worldX + this.offset),
      0,
      this.size - 1
    );
    const z = THREE.MathUtils.clamp(
      Math.floor(worldZ + this.offset),
      0,
      this.size - 1
    );

    return this.heights[z * this.size + x];
  }

  removeBlockAtInstance(instanceId) {
    const x = instanceId % this.size;
    const z = Math.floor(instanceId / this.size);
    const index = z * this.size + x;

    if (this.heights[index] > 0) {
      this.heights[index] -= 1;
      this.rebuild();
    }
  }

  placeBlockAtInstance(instanceId) {
    const x = instanceId % this.size;
    const z = Math.floor(instanceId / this.size);
    const index = z * this.size + x;

    if (this.heights[index] < this.maxHeight) {
      this.heights[index] += 1;
      this.rebuild();
    }
  }

  rebuild() {
    for (let z = 0; z < this.size; z += 1) {
      for (let x = 0; x < this.size; x += 1) {
        const index = z * this.size + x;
        const height = this.heights[index];

        this.position.set(
          x - this.offset + 0.5,
          height > 0 ? height - 0.5 : -1000,
          z - this.offset + 0.5
        );

        this.scale.set(1, 1, 1);

        this.matrix.compose(this.position, this.quaternion, this.scale);
        this.mesh.setMatrixAt(index, this.matrix);
        this.mesh.setColorAt(index, getVoxelColor(height, this.maxHeight));
      }
    }

    this.mesh.count = this.size * this.size;
    this.mesh.instanceMatrix.needsUpdate = true;

    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }

    this.mesh.computeBoundingSphere();
  }
}
