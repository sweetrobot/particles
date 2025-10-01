import * as THREE from 'three';
import { TweenLite } from 'gsap/TweenMax';
import InteractiveControls from './webgl/controls/InteractiveControls';
import Particles from './webgl/particles/Particles';

export default class ParticleRenderer {
  constructor(container, imageUrl, settings = {}) {
    this.container = container;
    this.imageUrl = imageUrl;
    this.settings = {
      particleSize: settings.particle_size || 1.5,
      particleDepth: settings.particle_depth || 4.0,
      particleRandom: settings.particle_random || 2.0,
      touchRadius: settings.touch_radius || 0.15
    };
    this.initThree();
    this.initParticles();
    this.initControls();
    this.addListeners();
    this.animate();
    this.resize();
    this.loadImage();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.clientWidth / this.container.clientHeight,
      1,
      10000
    );
    this.camera.position.z = 300;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock(true);
  }

  initControls() {
    this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
  }

  initParticles() {
    this.particles = new Particles(this);
    this.scene.add(this.particles.container);
  }

  loadImage() {
    if (this.particles) {
      this.particles.init(this.imageUrl, this.settings);
    }
  }

  addListeners() {
    this.handlerAnimate = this.animate.bind(this);
    this.handlerResize = this.resize.bind(this);
    window.addEventListener('resize', this.handlerResize);
  }

  animate() {
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.handlerAnimate);
  }

  update() {
    const delta = this.clock.getDelta();
    if (this.particles) this.particles.update(delta);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (!this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

    this.renderer.setSize(width, height);

    if (this.interactive) this.interactive.resize();
    if (this.particles) this.particles.resize();
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.handlerResize);
    if (this.particles) this.particles.destroy();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
