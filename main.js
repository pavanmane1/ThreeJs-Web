import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer, textMesh, spotlight, character;

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext('2d');
    context.fillStyle = '#0d0d0d';
    context.fillRect(0, 0, 2, 2);
    context.fillStyle = '#333333';
    context.fillRect(0, 1, 2, 1);
    const bgTexture = new THREE.CanvasTexture(canvas);
    scene.background = bgTexture;

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Spotlight for mouse movement
    spotlight = new THREE.SpotLight(0xffffff, 1.5);
    spotlight.position.set(0, 0, 5);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.2;
    spotlight.decay = 2;
    spotlight.distance = 50;
    spotlight.castShadow = true;
    scene.add(spotlight);

    // Load Font and Create Text
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const geometry = new TextGeometry('Pavan', {
            font: font,
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });

        const material = new THREE.MeshStandardMaterial({
            color: 0x1565C0,
            metalness: 0.8,
            roughness: 0.2
        });
        textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.x = -2.5;
        textMesh.castShadow = true;
        scene.add(textMesh);

        // GSAP animation for text
        gsap.fromTo(textMesh.position,
            { y: 5 },
            {
                y: 0,
                scrollTrigger: {
                    trigger: document.getElementById('three-container'),
                    start: 'top bottom',
                    end: 'top center',
                    scrub: true
                }
            });
    });

    // Load 3D Cartoon Model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('path/to/your/cartoon_model.glb', function (gltf) {
        character = gltf.scene;
        character.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
        character.position.set(3, 0, 0); // Position next to the text
        character.castShadow = true;
        scene.add(character);

        // GSAP animation for character
        gsap.fromTo(character.position,
            { x: 10 },
            {
                x: 3,
                scrollTrigger: {
                    trigger: document.getElementById('three-container'),
                    start: 'top bottom',
                    end: 'top center',
                    scrub: true
                }
            });
    });

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Mouse move event listener
    document.addEventListener('mousemove', onMouseMove, false);

    // Window Resize
    window.addEventListener('resize', onWindowResize, false);
}

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Move spotlight
    spotlight.position.set(mouseX * 10, mouseY * 10, 5);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
