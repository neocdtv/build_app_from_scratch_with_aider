import { Renderer } from './engine/renderer.js';
import { Controls } from './engine/controls.js';

const canvas = document.getElementById('canvas');
const renderer = new Renderer(canvas);
const controls = new Controls(renderer, canvas);

controls.init();
renderer.animate();
