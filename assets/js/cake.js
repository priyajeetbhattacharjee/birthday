import * as THREE from "three";
import cakeImg from "../images/cake.png";

export let cake = null;
export let cakeLight = null;
let cakeEmbers = null;

let showing = false;
let cakeClicked = false;
const CAKE_SCALE = 1.35;

// =====================================
// CREATE CAKE & MAGIC EMBERS
// =====================================

export function createCake(scene) {
    const geometry = new THREE.PlaneGeometry(7.5, 7.5);

    const material = new THREE.MeshBasicMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        cakeImg,
        (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            material.map = tex;
            material.needsUpdate = true;
        },
        undefined,
        (err) => console.error("Cake texture error:", err)
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    material.map = texture;

    cake = new THREE.Mesh(geometry, material);
    cake.position.set(0, -20, -8);
    cake.scale.set(CAKE_SCALE, CAKE_SCALE, 1);
    cake.renderOrder = 10;
    cake.userData.isCake = true;
    scene.add(cake);

    // Warm Candlelight Point Light
    cakeLight = new THREE.PointLight(0xffbe5c, 0, 18);
    cakeLight.position.set(0, 0.8, -6);
    scene.add(cakeLight);

    // Magic Golden Floating Candle Embers
    const emberCount = 120;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    const emberVel = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
        const i3 = i * 3;
        emberPos[i3] = (Math.random() - 0.5) * 5;
        emberPos[i3 + 1] = -2 + Math.random() * 4;
        emberPos[i3 + 2] = -7.5 + (Math.random() - 0.5) * 2;

        emberVel[i3] = (Math.random() - 0.5) * 0.4;
        emberVel[i3 + 1] = 0.5 + Math.random() * 1.2;
        emberVel[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));

    // Create a golden circle particle canvas texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255, 230, 160, 1)");
    grad.addColorStop(0.35, "rgba(255, 180, 70, 0.85)");
    grad.addColorStop(0.8, "rgba(255, 120, 20, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const emberTex = new THREE.CanvasTexture(canvas);

    const emberMat = new THREE.PointsMaterial({
        size: 0.28,
        map: emberTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    cakeEmbers = new THREE.Points(emberGeo, emberMat);
    cakeEmbers.userData = { vel: emberVel, visible: false };
    scene.add(cakeEmbers);
}

// =====================================
// SHOW CAKE
// =====================================

export function showCake() {
    if (!cake) return;

    showing = true;
    cakeClicked = false;
    if (cakeEmbers) cakeEmbers.userData.visible = true;

    const targetY = -0.9;

    function rise() {
        if (cake.position.y < targetY) {
            cake.position.y += (targetY - cake.position.y) * 0.085;
            if (cakeLight) {
                cakeLight.intensity += (3.8 - cakeLight.intensity) * 0.085;
            }
            if (cakeEmbers) {
                cakeEmbers.material.opacity += (0.9 - cakeEmbers.material.opacity) * 0.085;
            }
            requestAnimationFrame(rise);
        } else {
            cake.position.y = targetY;
            if (cakeLight) cakeLight.intensity = 3.8;
            if (cakeEmbers) cakeEmbers.material.opacity = 0.9;
        }
    }

    rise();
}

// =====================================
// CAKE ANIMATION
// =====================================

export function animateCake() {
    if (!cake || !showing) return;

    const t = performance.now() * 0.001;

    // Candlelight flicker
    if (cakeLight) {
        cakeLight.intensity = 3.6 + Math.sin(t * 12) * 0.25 + Math.cos(t * 7) * 0.15;
    }

    // Normal floating
    if (!cakeClicked) {
        cake.position.y = -0.9 + Math.sin(t * 1.6) * 0.07;
        cake.rotation.z = Math.sin(t * 0.9) * 0.015;
    }

    // Floating embers rising up from the cake
    if (cakeEmbers && cakeEmbers.userData.visible) {
        const pos = cakeEmbers.geometry.attributes.position.array;
        const vel = cakeEmbers.userData.vel;
        const count = pos.length / 3;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            pos[i3 + 1] += vel[i3 + 1] * 0.016;
            pos[i3] += Math.sin(t * 2 + i) * 0.008;

            // Reset when drifted too high
            if (pos[i3 + 1] > 3.2) {
                pos[i3 + 1] = cake.position.y - 1.2 + Math.random() * 0.5;
                pos[i3] = cake.position.x + (Math.random() - 0.5) * 4.2;
            }
        }
        cakeEmbers.geometry.attributes.position.needsUpdate = true;
    }
}

// =====================================
// CAKE CLICKED
// =====================================

export function celebrateCake() {
    if (!cake || cakeClicked) return;

    cakeClicked = true;

    const startY = cake.position.y;
    const startTime = performance.now();

    function bounce(time) {
        const elapsed = time - startTime;
        const duration = 750;

        if (elapsed < duration) {
            const progress = elapsed / duration;

            cake.position.y =
                startY - Math.sin(progress * Math.PI) * 0.45;

            const scale =
                CAKE_SCALE + Math.sin(progress * Math.PI) * 0.14;

            cake.scale.set(scale, scale, 1);

            if (cakeLight) {
                cakeLight.intensity = 4.5 + Math.sin(progress * Math.PI) * 2.5;
            }

            requestAnimationFrame(bounce);
        } else {
            cake.position.y = startY;
            cake.scale.set(CAKE_SCALE, CAKE_SCALE, 1);
        }
    }

    requestAnimationFrame(bounce);
}