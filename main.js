import * as THREE from "three";
import { createRenderer } from "./engine/renderer.js";
import { createControls } from "./engine/controls.js";
import { VoxelWorld } from "./world/chunk.js";
import { Player } from "./player/player.js";

const container = document.getElementById("game");
const overlay = document.getElementById("overlay");

const { scene, camera, renderer } = createRenderer(container);

const world = new VoxelWorld(scene);
const controls = createControls(camera, overlay);
const player = new Player(camera, controls, world);

controls.addEventListener("lock", () => {
  overlay.classList.add("hidden");
});

controls.addEventListener("unlock", () => {
  overlay.classList.remove("hidden");
});

const raycaster = new THREE.Raycaster();
raycaster.far = 100;
const screenCenter = new THREE.Vector2(0, 0);

renderer.domElement.addEventListener("mousedown", (event) => {
  if (!controls.isLocked) return;

  raycaster.setFromCamera(screenCenter, camera);
  const hits = raycaster.intersectObject(world.mesh, false);

  if (!hits.length) return;

  const hit = hits[0];
  if (hit.instanceId === undefined) return;

  if (event.button === 0) {
    world.removeBlockAtInstance(hit.instanceId);
  } else if (event.button === 2) {
    world.placeBlockAtInstance(hit.instanceId);
  }
});

renderer.domElement.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);
  player.update(dt);

  renderer.render(scene, camera);
}

animate();
