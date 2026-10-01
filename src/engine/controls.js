import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import THREE from 'three';

class Controls {
    constructor(renderer, canvas) {
        this.renderer = renderer;
        this.canvas = canvas;
        this.camera = renderer.camera;
        this.pointerLocked = false;
        this.touchActive = false;
        this.touchStart = { x: 0, y: 0 };
        this.moveState = { x: 0, y: 0 };
        this.controls = null;
        this.desktopControls = null;
        this.keys = {};
        this.lastTime = 0;
        this.moveX = 0;
        this.moveZ = 0;
        this.lookX = 0;
        this.lookY = 0;
        this.jump = false;
    }

    init(player) {
        this.player = player;
        this.setupDesktop();
        this.setupMobile();
        window.addEventListener('resize', () => this.renderer.resize());
        this.setupKeyboard();
    }

    setupDesktop() {
        this.canvas.addEventListener('click', () => this.lockPointer());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.setupDesktopInput();
    }

    setupMobile() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    setupDesktopInput() {
        if (this.desktopControls) {
            this.desktopControls.detach();
        }
        this.desktopControls = new PointerLockControls(this.camera, this.canvas);
        this.desktopControls.addEventListener('lock', () => {
            this.pointerLocked = true;
        });
        this.desktopControls.addEventListener('unlock', () => {
            this.pointerLocked = false;
        });
        this.renderer.scene.add(this.desktopControls);
    }

    lockPointer() {
        if (!this.pointerLocked) {
            this.desktopControls.lock();
        }
    }

    handleMouseMove(e) {
        if (this.pointerLocked) {
            this.camera.rotation.y -= e.movementX * 0.002;
            this.camera.rotation.x -= e.movementY * 0.002;
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
        }
    }

    setupMobileInput() {
        this.moveX = 0;
        this.moveZ = 0;
        this.lookX = 0;
        this.lookY = 0;
        this.jump = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.touchActive = true;
        this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.setupMobileInput();
    }

    handleTouchMove(e) {
        if (!this.touchActive) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - this.touchStart.x;
        const deltaY = e.touches[0].clientY - this.touchStart.y;
        this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        
        // Mobile: left half of screen for movement, right half for look
        const screenMid = window.innerWidth / 2;
        const touchX = e.touches[0].clientX;
        
        if (touchX < screenMid) {
            // Left side - movement
            this.moveX = Math.max(-1, Math.min(1, deltaX * 0.01));
            this.moveZ = Math.max(-1, Math.min(1, deltaY * 0.01));
        } else {
            // Right side - look
            this.lookX = deltaX * 0.002;
            this.lookY = deltaY * 0.002;
            this.camera.rotation.y -= this.lookX;
            this.camera.rotation.x -= this.lookY;
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
        }
    }

    handleTouchEnd(e) {
        this.touchActive = false;
        this.setupMobileInput();
    }

    handleKeyDown(e) {
        const input = this.player.input;
        
        switch (e.code) {
            case 'KeyW':
                input.moveZ = -1;
                break;
            case 'KeyS':
                input.moveZ = 1;
                break;
            case 'KeyA':
                input.moveX = -1;
                break;
            case 'KeyD':
                input.moveX = 1;
                break;
            case 'Space':
                input.jump = true;
                if (this.player.isOnGround()) {
                    this.player.jump();
                }
                break;
        }
    }

    handleKeyUp(e) {
        const input = this.player.input;
        
        switch (e.code) {
            case 'KeyW':
            case 'KeyS':
                input.moveZ = 0;
                break;
            case 'KeyA':
            case 'KeyD':
                input.moveX = 0;
                break;
            case 'Space':
                input.jump = false;
                break;
        }
    }

    update() {
        // Update player input from keyboard
        this.handleKeyDown();
        this.handleKeyUp();
        
        // Update player
        if (this.player) {
            this.player.update(0.016);
        }
    }

    dispose() {
        if (this.desktopControls) {
            this.desktopControls.detach();
            this.renderer.scene.remove(this.desktopControls);
        }
    }
}

export default Controls;
