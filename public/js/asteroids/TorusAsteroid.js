import * as THREE from 'three';

export default class TorusAsteroid {
    constructor() {
        // radius is between 2 and 7
        var r = 2 + (Math.random() * 5);

        // tube is between 0.5 and 2.5
        var tube = 0.5 + (Math.random() * 2);

        // Creates the geometry of the asteroid
        this.geometry = new THREE.TorusGeometry(r, tube);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    // This function updates the asteroid movement through space
    update() {
    }
}