import * as THREE from "three";

export function getVoxelColor(height, maxHeight) {
  const color = new THREE.Color();

  if (height <= 0) {
    return color.setHex(0x000000);
  }

  const t = Math.min(height / maxHeight, 1);

  if (t < 0.35) {
    color.setHSL(0.33, 0.55, 0.32 + t * 0.25);
  } else if (t < 0.7) {
    color.setHSL(0.25, 0.45, 0.35 + t * 0.2);
  } else {
    color.setHSL(0.0, 0.0, 0.55 + t * 0.35);
  }

  return color;
}
