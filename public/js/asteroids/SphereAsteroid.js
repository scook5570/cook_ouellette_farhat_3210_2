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

        // variables to control the scaling of the asteroid
        this.scaleFactor = 0;

        // variables to control the asteroid speed
        this.XYZ = Math.floor(Math.random() * 3);
        this.speed = Math.random() * 0.2 - 0.1;
        if (Math.abs(this.speed) < 0.05 && this.speed > 0) {
            this.speed += 0.1;
        } else if (Math.abs(this.speed) < 0.05 && this.speed < 0) {
            this.xSpeed -= 0.1;
        }
    }

    // This funciton controls the movement on the astroid
    update() {
        this.mesh.scale.x = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.y = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.z = Math.sin(this.scaleFactor) * 0.25 + 1;

        this.scaleFactor += Math.PI / 180;
        if (this.scaleFactor > 2 * Math.PI) {
            this.scaleFactor = 0;
        }

        if (this.XYZ == 0) {
            this.mesh.position.x += this.speed;
        } else if (this.XYZ == 1) {
            this.mesh.position.y += this.speed;
        } else {
            this.mesh.position.z += this.speed;
        }


    }
}