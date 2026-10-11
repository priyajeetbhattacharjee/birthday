import * as THREE from "three";
import { cake } from "./cake.js";

let flames = [];
let flameLight = null;

let candlesBlown = false;

const loader = new THREE.TextureLoader();

const flameTexture = loader.load("/assets/images/flames.png");

export function createCandles(scene) {

    if (!cake) return;

    // Remove old flames
    flames.forEach((flame) => {

        cake.remove(flame);

    });

    flames = [];

    if (flameLight) {

        scene.remove(flameLight);

    }

    candlesBlown = false;

    const flameGeometry = new THREE.PlaneGeometry(
        0.16,
        0.28
    );

    // Relative to cake
    const positions = [

        { x: -0.42, y: 1.05 },
        { x: -0.21, y: 1.10 },
        { x:  0.00, y: 1.13 },
        { x:  0.21, y: 1.10 },
        { x:  0.42, y: 1.05 }

    ];

    positions.forEach((p) => {

        const material = new THREE.MeshBasicMaterial({

            map: flameTexture,
            transparent: true,
            alphaTest: 0.05,
            side: THREE.DoubleSide,
            depthWrite: false,
            toneMapped: false,
            color: 0xffffff

        });

        const flame = new THREE.Mesh(
            flameGeometry,
            material
        );

        flame.position.set(
            p.x,
            p.y,
            0.05
        );

        flame.renderOrder = 20;

        flame.visible = false;

        flame.userData.baseY = p.y;
        flame.userData.offset =
            Math.random() * Math.PI * 2;

        cake.add(flame);

        flames.push(flame);

    });

    flameLight = new THREE.PointLight(
        0xffbb55,
        0,
        5
    );

    scene.add(flameLight);

}

export function showFlames() {

    candlesBlown = false;

    flames.forEach((flame) => {

        flame.visible = true;

    });

    if (flameLight) {

        flameLight.intensity = 2;

    }

}

export function animateCandles() {

    if (candlesBlown) return;

    const t = performance.now() * 0.005;

    flames.forEach((flame) => {

        if (!flame.visible) return;

        const flicker =
            Math.sin(
                t +
                flame.userData.offset
            ) * 0.08;

        flame.scale.x =
            1 + flicker;

        flame.scale.y =
            1 + flicker * 1.4;

        flame.rotation.z =
            flicker * 0.10;

        flame.position.y =
            flame.userData.baseY +
            Math.sin(
                t * 0.5 +
                flame.userData.offset
            ) * 0.015;

        flame.material.opacity =
            0.9 +
            Math.random() * 0.1;

    });

    if (cake && flameLight) {

        flameLight.position.copy(cake.position);

        flameLight.position.y += 0.85;

        flameLight.position.z += 0.4;

        flameLight.intensity =
            2 +
            Math.sin(t * 2) * 0.15;

    }

}

export function blowCandles() {

    candlesBlown = true;

    flames.forEach((flame, i) => {

        setTimeout(() => {

            flame.visible = false;

        }, i * 180);

    });

    function fade() {

        if (!flameLight) return;

        flameLight.intensity *= 0.9;

        if (flameLight.intensity > 0.02) {

            requestAnimationFrame(fade);

        } else {

            flameLight.intensity = 0;

        }

    }

    fade();

}