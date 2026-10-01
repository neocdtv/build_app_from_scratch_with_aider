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

const fpsElement = document.getElementById('fps-counter');
const coordsElement = document.getElementById('coords');
const blockInfoElement = document.getElementById('block-info');

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

controls.init(player);

// Load saved data from LocalStorage
function loadBlocks() {
    const savedData = localStorage.getItem('voxelBlocks');
    if (savedData) {
        try {
            const blocks = JSON.parse(savedData);
            blocks.forEach(block => {
                const chunk = renderer.renderer.scene.children.find(child => child.userData && child.userData.chunk);
                if (chunk && chunk.userData.chunk) {
                    const chunkObj = chunk.userData.chunk;
                    chunkObj.setBlock(block.x, block.y, block.z, block.type);
                }
            });
        } catch (e) {
            console.error('Failed to load blocks:', e);
        }
    }
}

// Save modified blocks to LocalStorage
function saveBlocks() {
    const chunks = [];
    renderer.renderer.render(renderer.scene, renderer.camera);
    
    renderer.renderer.children.forEach(child => {
        if (child.userData && child.userData.chunk) {
            const chunk = child.userData.chunk;
            const chunkData = chunk.data;
            for (let i = 0; i < chunkData.length; i++) {
                if (chunkData[i] !== 0) {
                    const x = i % 16;
                    const z = Math.floor(i / 256);
                    const y = Math.floor(i / 16) % 16;
                    chunks.push({ x, y, z, type: chunkData[i] });
                }
            }
        }
    });
    
    localStorage.setItem('voxelBlocks', JSON.stringify(chunks));
}

controls.setupDesktop = () => {
    controls.canvas.addEventListener('click', () => controls.lockPointer());
    controls.canvas.addEventListener('mousemove', (e) => controls.handleMouseMove(e));
    controls.setupDesktopInput();
};

controls.setupMobile = () => {
    controls.canvas.addEventListener('touchstart', (e) => controls.handleTouchStart(e), { passive: false });
    controls.canvas.addEventListener('touchmove', (e) => controls.handleTouchMove(e), { passive: false });
    controls.canvas.addEventListener('touchend', (e) => controls.handleTouchEnd(e), { passive: false });
};

controls.setupKeyboard = () => {
    window.addEventListener('keydown', (e) => {
        controls.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
        controls.keys[e.code] = false;
    });
};

controls.setupDesktopInput = () => {
    if (controls.desktopControls) {
        controls.desktopControls.detach();
    }
    controls.desktopControls = new PointerLockControls(controls.camera, controls.canvas);
    controls.desktopControls.addEventListener('lock', () => {
        controls.pointerLocked = true;
    });
    controls.desktopControls.addEventListener('unlock', () => {
        controls.pointerLocked = false;
    });
    renderer.scene.add(controls.desktopControls);
};

controls.lockPointer = () => {
    if (!controls.pointerLocked) {
        controls.desktopControls.lock();
    }
};

controls.handleMouseMove = (e) => {
    if (controls.pointerLocked) {
        controls.camera.rotation.y -= e.movementX * 0.002;
        controls.camera.rotation.x -= e.movementY * 0.002;
        controls.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.camera.rotation.x));
    }
};

controls.handleTouchStart = (e) => {
    e.preventDefault();
    controls.touchActive = true;
    controls.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    controls.setupMobileInput();
};

controls.handleTouchMove = (e) => {
    if (!controls.touchActive) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - controls.touchStart.x;
    const deltaY = e.touches[0].clientY - controls.touchStart.y;
    controls.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    
    const screenMid = window.innerWidth / 2;
    const touchX = e.touches[0].clientX;
    
    if (touchX < screenMid) {
        controls.moveX = Math.max(-1, Math.min(1, deltaX * 0.01));
        controls.moveZ = Math.max(-1, Math.min(1, deltaY * 0.01));
    } else {
        controls.lookX = deltaX * 0.002;
        controls.lookY = deltaY * 0.002;
        controls.camera.rotation.y -= controls.lookX;
        controls.camera.rotation.x -= controls.lookY;
        controls.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.camera.rotation.x));
    }
};

controls.handleTouchEnd = (e) => {
    controls.touchActive = false;
    controls.setupMobileInput();
};

controls.update = () => {
    controls.handleKeyDown();
    controls.handleKeyUp();
    
    if (controls.player) {
        controls.player.update(0.016);
    }
};

// FPS counter
const updateFPS = () => {
    const now = performance.now();
    frameCount++;
    if (now - lastTime >= 1000) {
        fps = Math.round(frameCount * 1000 / (now - lastTime));
        frameCount = 0;
        lastTime = now;
        fpsElement.textContent = `FPS: ${fps}`;
        
        // Check if mobile and FPS is low
        const isMobile = window.innerWidth < 768;
        if (isMobile && fps < 30 && renderer.renderer.shadowMap.enabled) {
            renderer.renderer.shadowMap.enabled = false;
            renderer.light.castShadow = false;
            console.log('Shadows disabled for performance');
        }
    }
};

// Update UI
const updateUI = () => {
    fpsElement.textContent = `FPS: ${fps}`;
    const worldX = player.position.x;
    const worldY = player.position.y;
    const worldZ = player.position.z;
    coordsElement.textContent = `X: ${Math.round(worldX)}, Y: ${Math.round(worldY)}, Z: ${Math.round(worldZ)}`;
    
    // Update block info from last raycast
    blockInfoElement.textContent = `Target: ${targetBlock ? targetBlock.type : 'Air'}`;
};

let targetBlock = null;

// Raycasting for block interaction
function raycastInteraction() {
    mouse.x = (player.position.x / window.innerWidth) * 2 - 1;
    mouse.y = -(player.position.z / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera({ x: mouse.x, y: mouse.y }, renderer.camera);
    
    const intersects = raycaster.intersectObjects(renderer.renderer.children);
    
    if (intersects.length > 0) {
        const intersect = intersects[0];
        
        if (intersect.object && intersect.object.type === 'InstancedMesh') {
            const mesh = intersect.object;
            const instanceMatrix = mesh.instanceMatrix.array;
            const instanceColor = mesh.instanceColor.array;
            
            for (let i = 0; i < mesh.count; i++) {
                const matrix = mesh.getMatrixAt(i);
                if (matrix.intersectsPoint(intersect.point)) {
                    const chunk = mesh.userData.chunk;
                    
                    if (chunk) {
                        const voxel = intersect.point;
                        const blockX = Math.floor(voxel.x);
                        const blockY = Math.floor(voxel.y);
                        const blockZ = Math.floor(voxel.z);
                        
                        const normal = intersect.face.normal;
                        
                        targetBlock = {
                            x: blockX,
                            y: blockY,
                            z: blockZ,
                            type: chunk.getBlock(blockX, blockY, blockZ)
                        };
                        
                        // Left click - break block
                        if (intersect.face.normal.dot(intersect.point - mesh.instancePosition) < 0) {
                            const oldType = chunk.setBlock(blockX, blockY, blockZ, 0);
                            targetBlock.type = 0;
                            saveBlocks();
                        } 
                        // Right click - place block
                        else {
                            const oldType = chunk.setBlock(blockX, blockY, blockZ, 2); // grass
                            targetBlock.type = 2;
                            saveBlocks();
                        }
                    }
                    return;
                }
            }
        }
    } else {
        targetBlock = null;
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

// Handle player input in animation loop
const updatePlayer = () => {
    controls.update();
};

renderer.animate = () => {
    updateFPS();
    updatePlayer();
    updateUI();
    requestAnimationFrame(() => renderer.animate());
    renderer.renderer.render(renderer.scene, renderer.camera);
};

// Load saved blocks on start
loadBlocks();
