import * as THREE from 'three';

export default class SquareAsteroid {
    constructor() {
        // side is between 3 and 10
        var side = 3 + (Math.random() * 7);
        
        // Creates the geometry of the asteroid
        this.geometry = new THREE.BoxGeometry(side,side,side);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // variables to control the rotation speed
        var rotationSpeed = 2;

        this.randRotateX = Math.random() * rotationSpeed + 1;
        this.randRotateY = Math.random() * rotationSpeed + 1;
        this.randRotateZ = Math.random() * rotationSpeed + 1;

        // variables to control the asteroid speed
        var temp = Math.floor(Math.random());
        this.random = 0;
        if (temp == 1) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        this.xSpeed = this.negative * (Math.random() * 4 + 2);
    }

    // This function updates the asteroid movement through space
    update(t) {
        this.mesh.position.x += this.xSpeed * t;

        this.mesh.rotateX(this.randRotateX * t);
        this.mesh.rotateY(this.randRotateY * t);
        this.mesh.rotateZ(this.randRotateZ * t);
    }
}