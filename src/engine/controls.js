class Controls {
    constructor(renderer, canvas) {
        this.renderer = renderer;
        this.canvas = canvas;
        this.camera = renderer.camera;
        this.pointerLocked = false;
        this.touchActive = false;
        this.touchStart = { x: 0, y: 0 };
        this.moveState = { x: 0, y: 0 };
    }

    init() {
        this.setupDesktop();
        this.setupMobile();
        window.addEventListener('resize', () => this.renderer.resize());
    }

    setupDesktop() {
        this.canvas.addEventListener('click', () => this.lockPointer());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    setupMobile() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    lockPointer() {
        if (!this.pointerLocked) {
            this.canvas.requestPointerLock();
        }
    }

    handleMouseMove(e) {
        if (this.pointerLocked) {
            this.camera.rotation.y -= e.movementX * 0.002;
            this.camera.rotation.x -= e.movementY * 0.002;
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
        }
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.touchActive = true;
        this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    handleTouchMove(e) {
        if (!this.touchActive) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - this.touchStart.x;
        const deltaY = e.touches[0].clientY - this.touchStart.y;
        this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.camera.rotation.y -= deltaX * 0.002;
        this.camera.rotation.x -= deltaY * 0.002;
        this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
    }

    handleTouchEnd(e) {
        this.touchActive = false;
    }
}
