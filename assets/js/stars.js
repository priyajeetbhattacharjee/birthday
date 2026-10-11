import * as THREE from "three";

// Helper to create a soft, glowing radial star sprite texture
function createStarTexture(color = "#ffffff", glow = 1.0) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.15, "rgba(255, 248, 220, 0.95)");
    gradient.addColorStop(0.4, "rgba(255, 215, 130, 0.45)");
    gradient.addColorStop(0.8, "rgba(200, 160, 255, 0.12)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    // Subtle 4-point star spike glint
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.lineTo(32, 54);
    ctx.moveTo(10, 32);
    ctx.lineTo(54, 32);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

export function createStars(scene) {
    const starTexture = createStarTexture();

    // 1. COSMIC AMBIENT DEEP STARS (18,000 tiny stars in vast 3D sphere)
    const deepCount = 18000;
    const deepPositions = new Float32Array(deepCount * 3);
    const deepColors = new Float32Array(deepCount * 3);

    const palette = [
        new THREE.Color(0xffffff), // Diamond White
        new THREE.Color(0xffebba), // Warm Champagne Gold
        new THREE.Color(0xffd1dc), // Soft Rose Quartz
        new THREE.Color(0xcbe3fb), // Celestial Ice Blue
        new THREE.Color(0xe0b0ff)  // Ethereal Lavender
    ];

    for (let i = 0; i < deepCount; i++) {
        const i3 = i * 3;
        // Distribute in a spherical celestial volume
        const radius = 250 + Math.random() * 2200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        deepPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        deepPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        deepPositions[i3 + 2] = radius * Math.cos(phi);

        const col = palette[Math.floor(Math.random() * palette.length)];
        deepColors[i3] = col.r;
        deepColors[i3 + 1] = col.g;
        deepColors[i3 + 2] = col.b;
    }

    const deepGeometry = new THREE.BufferGeometry();
    deepGeometry.setAttribute("position", new THREE.BufferAttribute(deepPositions, 3));
    deepGeometry.setAttribute("color", new THREE.BufferAttribute(deepColors, 3));

    const deepMaterial = new THREE.PointsMaterial({
        size: 1.6,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        map: starTexture,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const deepStars = new THREE.Points(deepGeometry, deepMaterial);
    scene.add(deepStars);

    // 2. BRILLIANT TWINKLING STARS (4,500 larger luminous stars closer to camera)
    const brightCount = 4500;
    const brightPositions = new Float32Array(brightCount * 3);
    const brightColors = new Float32Array(brightCount * 3);
    const brightPhases = new Float32Array(brightCount); // for individual twinkle animations

    for (let i = 0; i < brightCount; i++) {
        const i3 = i * 3;
        const radius = 60 + Math.random() * 950;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        brightPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        brightPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        brightPositions[i3 + 2] = radius * Math.cos(phi);

        const col = palette[Math.floor(Math.random() * palette.length)];
        brightColors[i3] = col.r;
        brightColors[i3 + 1] = col.g;
        brightColors[i3 + 2] = col.b;
        brightPhases[i] = Math.random() * Math.PI * 2;
    }

    const brightGeometry = new THREE.BufferGeometry();
    brightGeometry.setAttribute("position", new THREE.BufferAttribute(brightPositions, 3));
    brightGeometry.setAttribute("color", new THREE.BufferAttribute(brightColors, 3));

    const brightMaterial = new THREE.PointsMaterial({
        size: 3.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
        map: starTexture,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const brightStars = new THREE.Points(brightGeometry, brightMaterial);
    scene.add(brightStars);

    // 3. SHOOTING STARS / METEORS POOL
    const shootingStars = [];
    const shootingStarCount = 3;

    for (let i = 0; i < shootingStarCount; i++) {
        const lineGeo = new THREE.BufferGeometry();
        const linePositions = new Float32Array(6); // 2 vertices
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

        const lineMat = new THREE.LineBasicMaterial({
            color: 0xfff4d0,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            linewidth: 2
        });

        const line = new THREE.Line(lineGeo, lineMat);
        line.userData = {
            active: false,
            startPos: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            length: 18,
            life: 0,
            maxLife: 1.2,
            respawnTimer: Math.random() * 4 + 2
        };

        scene.add(line);
        shootingStars.push(line);
    }

    function resetShootingStar(star) {
        const sideX = (Math.random() - 0.5) * 80;
        const startY = 25 + Math.random() * 25;
        const startZ = -20 - Math.random() * 40;

        star.userData.startPos.set(sideX, startY, startZ);
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        const speed = 75 + Math.random() * 35;
        star.userData.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 15);
        star.userData.life = 0;
        star.userData.maxLife = 0.8 + Math.random() * 0.6;
        star.userData.active = true;
    }

    // Return root container & update hook
    const starGroup = new THREE.Group();
    starGroup.add(deepStars);
    starGroup.add(brightStars);

    // Attach animation update function
    starGroup.userData = {
        deepStars,
        brightStars,
        shootingStars,
        update: (time, delta = 0.016) => {
            // Rotation of starfields
            deepStars.rotation.y = time * 0.00008;
            deepStars.rotation.x = time * 0.00003;

            brightStars.rotation.y = time * 0.00012;
            brightStars.rotation.x = time * 0.00005;

            // Twinkle pulsing of bright stars
            brightMaterial.opacity = 0.82 + Math.sin(time * 3.5) * 0.15;
            brightMaterial.size = 3.2 + Math.sin(time * 2.2) * 0.4;

            // Update shooting stars
            shootingStars.forEach((star) => {
                const data = star.userData;
                if (!data.active) {
                    data.respawnTimer -= delta;
                    if (data.respawnTimer <= 0) {
                        resetShootingStar(star);
                    }
                    return;
                }

                data.life += delta;
                const progress = data.life / data.maxLife;

                if (progress >= 1) {
                    data.active = false;
                    data.respawnTimer = 4 + Math.random() * 6;
                    star.material.opacity = 0;
                    return;
                }

                // Opacity curve: fast fade in, steady, gentle fade out
                if (progress < 0.2) {
                    star.material.opacity = (progress / 0.2) * 0.95;
                } else {
                    star.material.opacity = (1 - (progress - 0.2) / 0.8) * 0.95;
                }

                const currentX = data.startPos.x + data.velocity.x * data.life;
                const currentY = data.startPos.y + data.velocity.y * data.life;
                const currentZ = data.startPos.z + data.velocity.z * data.life;

                const tailX = currentX - data.velocity.x * 0.08;
                const tailY = currentY - data.velocity.y * 0.08;
                const tailZ = currentZ - data.velocity.z * 0.08;

                const posAttr = star.geometry.attributes.position;
                posAttr.setXYZ(0, currentX, currentY, currentZ);
                posAttr.setXYZ(1, tailX, tailY, tailZ);
                posAttr.needsUpdate = true;
            });
        }
    };

    return starGroup;
}