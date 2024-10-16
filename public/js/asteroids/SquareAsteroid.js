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
        var rotationSpeed = 0.1;

        this.randRotateX = Math.random() * rotationSpeed - 0.05;
        this.randRotateY = Math.random() * rotationSpeed - 0.05;
        this.randRotateZ = Math.random() * rotationSpeed - 0.05;

        // variables to control the asteroid speed
        this.xSpeed = Math.random() * 0.2 - 0.1;
        if (Math.abs(this.xSpeed) < 0.05 && this.xSpeed > 0) {
            this.xSpeed += 0.1;
        } else if (Math.abs(this.xSpeed) < 0.05 && this.xSpeed < 0) {
            this.xSpeed -= 0.1;
        }
    }

    // This function updates the asteroid movement through space
    update(t) {
        this.mesh.position.x += this.xSpeed;

        this.mesh.rotateX(this.randRotateX);
        this.mesh.rotateY(this.randRotateY);
        this.mesh.rotateZ(this.randRotateZ);
    }
}