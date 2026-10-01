import * as THREE from "three";

export class Player {
  constructor(camera, controls, world) {
    this.camera = camera;
    this.controls = controls;
    this.world = world;

    this.velocityY = 0;
    this.onGround = false;

    this.gravity = -25;
    this.jumpSpeed = 9;
    this.moveSpeed = 8;
    this.eyeHeight = 1.6;

    const startX = 0;
    const startZ = 0;

    camera.position.set(
      startX,
      world.getHeightAt(startX, startZ) + this.eyeHeight,
      startZ
    );
  }

  update(dt) {
    if (!this.controls.isLocked) return;

    const keys = this.controls.keys;

    const forward = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);
    const right = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

    if (forward !== 0) {
      this.controls.moveForward(forward * this.moveSpeed * dt);
    }

    if (right !== 0) {
      this.controls.moveRight(right * this.moveSpeed * dt);
    }

    this.camera.position.x = THREE.MathUtils.clamp(
      this.camera.position.x,
      -15.5,
      15.5
    );
    this.camera.position.z = THREE.MathUtils.clamp(
      this.camera.position.z,
      -15.5,
      15.5
    );

    if (keys.jump && this.onGround) {
      this.velocityY = this.jumpSpeed;
      this.onGround = false;
    }

    this.velocityY += this.gravity * dt;
    this.camera.position.y += this.velocityY * dt;

    const groundY =
      this.world.getHeightAt(this.camera.position.x, this.camera.position.z) +
      this.eyeHeight;

    if (this.camera.position.y <= groundY) {
      this.camera.position.y = groundY;
      this.velocityY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }
}
