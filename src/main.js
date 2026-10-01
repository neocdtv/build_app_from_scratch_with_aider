import { Renderer } from './engine/renderer.js';
import { Controls } from './engine/controls.js';

const renderer = new Renderer();
const controls = new Controls(renderer.camera, renderer.scene);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render();
}

animate();
