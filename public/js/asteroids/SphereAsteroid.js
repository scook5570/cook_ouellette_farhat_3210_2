import * as THREE from 'three';

export default class SphereAsteroid {    
    constructor() {
        // radius is between 3 and 10
        var r = 3 + (Math.random() * 7);

        // Creates the geometry of the asteroid
        this.geometry = new THREE.SphereGeometry(r,10,10);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    // This funciton controls the movement on the astroid
    update() {
    }
}