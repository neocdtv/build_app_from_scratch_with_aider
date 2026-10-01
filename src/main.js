import { Renderer } from './engine/renderer.js';
import { Controls } from './engine/controls.js';
import Player from './player/player.js';

const canvas = document.getElementById('canvas');
const renderer = new Renderer(canvas);
const controls = new Controls(renderer, canvas);
const player = new Player(8, 0, renderer.camera);

controls.init(player);
renderer.animate();

// Handle player input in animation loop
const updatePlayer = () => {
    controls.update();
};

renderer.animate = () => {
    updatePlayer();
    requestAnimationFrame(() => renderer.animate());
    renderer.renderer.render(renderer.scene, renderer.camera);
};
