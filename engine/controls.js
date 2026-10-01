import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export function createControls(camera, overlay) {
  const controls = new PointerLockControls(camera, document.body);

  controls.keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  };

  const keyMap = {
    KeyW: "forward",
    ArrowUp: "forward",
    KeyS: "backward",
    ArrowDown: "backward",
    KeyA: "left",
    ArrowLeft: "left",
    KeyD: "right",
    ArrowRight: "right",
    Space: "jump",
  };

  function setKey(event, value) {
    const action = keyMap[event.code];
    if (!action) return;

    controls.keys[action] = value;

    if (event.code === "Space") {
      event.preventDefault();
    }
  }

  document.addEventListener("keydown", (event) => {
    if (!controls.isLocked) return;
    setKey(event, true);
  });

  document.addEventListener("keyup", (event) => {
    if (!controls.isLocked) return;
    setKey(event, false);
  });

  controls.addEventListener("unlock", () => {
    Object.keys(controls.keys).forEach((key) => {
      controls.keys[key] = false;
    });
  });

  overlay.addEventListener("click", () => {
    controls.lock();
  });

  return controls;
}
