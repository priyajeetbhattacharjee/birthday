import * as THREE from "three";

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
);

camera.position.set(0, 0, 8);

export const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#space"),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

/* Makes the Three.js canvas transparent so the cake background is visible */
renderer.setClearColor(0x000000, 0);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.9
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    2.5
);

mainLight.position.set(5, 8, 8);

scene.add(mainLight);

export const cakeLight = new THREE.PointLight(
    0xffd27d,
    0,
    20
);

cakeLight.position.set(0, -1, -5);

scene.add(cakeLight);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});