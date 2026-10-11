import * as THREE from "three";

export function createEarth(scene) {

    const loader = new THREE.TextureLoader();

    const texture = loader.load("/assets/images/earth.jpg");

    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(40, 256, 256);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0
    });

    const earth = new THREE.Mesh(geometry, material);

    // Giant Earth below the camera
    earth.position.set(0, -42, -60);

    scene.add(earth);

   

    return earth;

}