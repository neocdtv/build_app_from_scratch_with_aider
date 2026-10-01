class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x333333);
        
        // Shadow map settings - disable on mobile for performance
        const isMobile = window.innerWidth < 768;
        this.shadowMapEnabled = !isMobile;
        
        if (this.shadowMapEnabled) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMap.autoUpdate = false;
            this.shadowMapEnabled = true;
        } else {
            this.renderer.shadowMap.enabled = false;
            this.shadowMapEnabled = false;
        }
        
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 10, 7.5);
        this.light.castShadow = this.shadowMapEnabled;
        if (this.shadowMapEnabled) {
            this.light.shadow.mapSize.width = 1024;
            this.light.shadow.mapSize.height = 1024;
            this.light.shadow.camera.near = 0.5;
            this.light.shadow.camera.far = 100;
            this.light.shadow.camera.left = -50;
            this.light.shadow.camera.right = 50;
            this.light.shadow.camera.top = 50;
            this.light.shadow.camera.bottom = -50;
        }
        this.scene.add(this.light);
        this.resize();
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
