import * as THREE from 'three';

export default class TetrahedronAsteroid {
    constructor() {
        // radius is between 2 and 7
        this.r = 2 + (Math.random() * 5);

        // Creates the geometry of the asteroid
        this.geometry = new THREE.TetrahedronGeometry(this.r);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // change the detail of the tetrahedron asteroid after creation
        this.time = Date.now();
    }

    // This function updates the asteroid movement through space
    update(t) {
        if (t - this.time > 1000) {
            
            var d = Math.floor((Math.random() * 5));
            this.mesh.geometry.dispose();
            this.geometry = new THREE.TetrahedronGeometry(this.r, d);
            this.mesh.geometry = this.geometry;
            
            this.time = Date.now();
            
        }
    }
}