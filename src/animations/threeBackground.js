import * as THREE from 'three';
import { canRunThreeJS, safeExecute } from './guards';

let renderer, scene, camera, particles;
let animationFrameId;
let isMounted = false;

export const mountThreeJS = () => {
    if (isMounted) return;
    if (!canRunThreeJS()) return;

    safeExecute(() => {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.5'; // Subtle
        document.body.appendChild(canvas);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio

        // Warm color palette: Saffron, Red, Brown
        const colors = [0xFF9933, 0xD35400, 0x8B4513];
        const geometry = new THREE.BufferGeometry();
        const count = 150; // Low poly count
        const positions = new Float32Array(count * 3);
        const colorAttribute = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            colorAttribute[i * 3] = color.r;
            colorAttribute[i * 3 + 1] = color.g;
            colorAttribute[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorAttribute, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (particles) {
                particles.rotation.y += 0.0005;
                particles.rotation.x += 0.0002;
            }
            renderer.render(scene, camera);
        };
        animate();
        isMounted = true;

        // Cleanup helper
        window.__disposeThree = unmountThreeJS;

    });
};

export const unmountThreeJS = () => {
    if (!isMounted) return;
    safeExecute(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (renderer) {
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
        if (particles) {
            if (particles.geometry) particles.geometry.dispose();
            if (particles.material) particles.material.dispose();
        }
        scene = null;
        camera = null;
        renderer = null;
        particles = null;
        isMounted = false;
    });
};
