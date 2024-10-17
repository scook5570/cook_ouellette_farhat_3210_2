import * as THREE from 'three';

export default class SphereAsteroid {    
    constructor() {
        // radius is between 3 and 6
        var r = 3 + (Math.random() * 6);

        // Creates the geometry of the asteroid
        this.geometry = new THREE.SphereGeometry(r,10,10);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // variables to control the scaling of the asteroid
        this.scaleFactor = 0;
        this.scaleSpeed = Math.random() * 2 + 1; // scale speed in seconds

        // variables to control the asteroid speed
        this.XYZ = Math.floor(Math.random() * 3);
        this.temp = Math.floor(Math.random());
        this.negative = 0
        if (this.temp == 1) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        this.speed = this.negative * (Math.random() * 4 + 2); // speed in units per second
    }

    // This funciton controls the movement on the astroid
    update(t) {
        this.mesh.scale.x = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.y = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.z = Math.sin(this.scaleFactor) * 0.25 + 1;

        this.scaleFactor += Math.PI / this.scaleSpeed * t;
        if (this.scaleFactor >= 2 * Math.PI) {
            this.scaleFactor = 0;
        }

        if (this.XYZ == 0) {
            this.mesh.position.x += this.speed * t;
        } else if (this.XYZ == 1) {
            this.mesh.position.y += this.speed * t;
        } else {
            this.mesh.position.z += this.speed * t;
        }


    }
}