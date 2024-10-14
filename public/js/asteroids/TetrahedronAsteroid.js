import * as THREE from 'three';

export default class TetrahedronAsteroid {
    constructor() {
        // radius is between 2 and 7
        var r = 2 + (Math.random() * 5);

        // detail between 1 and 10
        var d = Math.floor((Math.random() * 10));

        // Creates the geometry of the asteroid
        this.geometry = new THREE.TetrahedronGeometry(r, d);

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