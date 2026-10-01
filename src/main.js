import { Renderer } from './engine/renderer.js';
import { Controls } from './engine/controls.js';
import Player from './player/player.js';
import { Raycaster } from 'three';

const canvas = document.getElementById('canvas');
const renderer = new Renderer(canvas);
const controls = new Controls(renderer, canvas);
const player = new Player(8, 0, renderer.camera);

const raycaster = new Raycaster();
const mouse = new THREE.Vector2();

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

// Raycasting for block interaction
function raycastInteraction() {
    mouse.x = (renderer.camera.position.x / window.innerWidth) * 2 - 1;
    mouse.y = -(renderer.camera.position.z / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera({ x: mouse.x, y: mouse.y }, renderer.camera);
    
    const intersects = raycaster.intersectObjects(renderer.scene.children);
    
    if (intersects.length > 0) {
        const intersect = intersects[0];
        
        if (intersect.object && intersect.object.type === 'InstancedMesh') {
            // Get the chunk from the mesh
            const mesh = intersect.object;
            const instanceMatrix = mesh.instanceMatrix.array;
            const instanceColor = mesh.instanceColor.array;
            
            // Find which instance we're intersecting
            for (let i = 0; i < mesh.count; i++) {
                const matrix = mesh.getMatrixAt(i);
                if (matrix.intersectsPoint(intersect.point)) {
                    // Get the chunk this instance belongs to
                    // We need to store chunk reference on the mesh for easier access
                    const chunk = mesh.userData.chunk;
                    
                    if (chunk) {
                        const voxel = intersect.point;
                        const blockX = Math.floor(voxel.x);
                        const blockY = Math.floor(voxel.y);
                        const blockZ = Math.floor(voxel.z);
                        
                        const normal = intersect.face.normal;
                        
                        // Calculate adjacent block position
                        const targetX = Math.floor(voxel.x + normal.x);
                        const targetY = Math.floor(voxel.y + normal.y);
                        const targetZ = Math.floor(voxel.z + normal.z);
                        
                        // Left click - break block
                        if (intersect.face.normal.dot(intersect.point - mesh.instancePosition) < 0) {
                            chunk.setBlock(targetX, targetY, targetZ, 0);
                        } 
                        // Right click - place block
                        else {
                            chunk.setBlock(targetX, targetY, targetZ, 2); // grass
                        }
                    }
                    return;
                }
            }
        }
    }
}

// Desktop mouse click handlers
canvas.addEventListener('mousedown', (e) => {
    if (!controls.pointerLocked) return;
    
    raycastInteraction();
});

// Mobile touch button handlers
document.getElementById('break-btn').addEventListener('click', (e) => {
    e.preventDefault();
    raycastInteraction();
});

document.getElementById('place-btn').addEventListener('click', (e) => {
    e.preventDefault();
    raycastInteraction();
});
