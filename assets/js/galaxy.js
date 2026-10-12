import * as THREE from "three";
import milkywayImg from "../images/milkyway.png";
import nebulaImg from "../images/nebula.png";

export function createGalaxy(scene) {
    const loader = new THREE.TextureLoader();

    // ===========================
    // Materials
    // ===========================
    const milkyMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const nebulaMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const nebulaAuraMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    // ===========================
    // Load Textures
    // ===========================
    const milkyTexture = loader.load(
        milkywayImg,
        (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            milkyMaterial.map = tex;
            milkyMaterial.needsUpdate = true;
        },
        undefined,
        (err) => console.error("Milkyway texture error:", err)
    );
    milkyTexture.colorSpace = THREE.SRGBColorSpace;
    milkyMaterial.map = milkyTexture;

    const nebulaTexture = loader.load(
        nebulaImg,
        (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            nebulaMaterial.map = tex;
            nebulaMaterial.needsUpdate = true;
            nebulaAuraMaterial.map = tex;
            nebulaAuraMaterial.needsUpdate = true;
        },
        undefined,
        (err) => console.error("Nebula texture error:", err)
    );
    nebulaTexture.colorSpace = THREE.SRGBColorSpace;
    nebulaMaterial.map = nebulaTexture;
    nebulaAuraMaterial.map = nebulaTexture;

    // ===========================
    // 1. THE MILKY WAY GALAXY (Luminous, Prominent Spiral Band Across Sky)
    // ===========================
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