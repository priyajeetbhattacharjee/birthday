import * as THREE from "three";

export function createGalaxy(scene) {
    const loader = new THREE.TextureLoader();

    // ===========================
    // Load Textures
    // ===========================
    const milkyTexture = loader.load("/assets/images/milkyway.png");
    const nebulaTexture = loader.load("/assets/images/nebula.png");

    milkyTexture.colorSpace = THREE.SRGBColorSpace;
    nebulaTexture.colorSpace = THREE.SRGBColorSpace;

    // ===========================
    // 1. THE MILKY WAY GALAXY (Luminous, Prominent Spiral Band Across Sky)
    // ===========================
    const milkyMaterial = new THREE.MeshBasicMaterial({
        map: milkyTexture,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    // 1915 x 821 aspect ratio ~ 2.33
    const milkyway = new THREE.Mesh(
        new THREE.PlaneGeometry(240, 103),
        milkyMaterial
    );

    // Positioned front and center in the cosmic sky
    milkyway.position.set(0, 3, -75);
    milkyway.rotation.z = -0.25; // Dramatic diagonal cosmic arch
    scene.add(milkyway);

    // ===========================
    // 2. Deep Violet Ambient Nebula (Ethereal Atmospheric Backdrop)
    // ===========================
    const nebulaMaterial = new THREE.MeshBasicMaterial({
        map: nebulaTexture,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const nebula = new THREE.Mesh(
        new THREE.PlaneGeometry(320, 175),
        nebulaMaterial
    );

    // Set behind the Milky Way to create true volumetric depth
    nebula.position.set(10, -5, -130);
    scene.add(nebula);

    // ===========================
    // 3. Secondary Nebula Stardust Cloud (Warmth and depth)
    // ===========================
    const nebulaAuraMaterial = new THREE.MeshBasicMaterial({
        map: nebulaTexture,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const nebulaAura = new THREE.Mesh(
        new THREE.PlaneGeometry(360, 200),
        nebulaAuraMaterial
    );
    nebulaAura.position.set(-20, 15, -160);
    nebulaAura.rotation.z = Math.PI * 0.4;
    scene.add(nebulaAura);

    return {
        milkyway,
        nebula,
        nebulaAura
    };
}