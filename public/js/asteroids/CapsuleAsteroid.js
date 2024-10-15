import * as THREE from 'three';

export default class CapsuleAsteroid {
    constructor() {
        // length is between 3 and 10
        var l = 3 + (Math.random() * 7);
        // radius is between 1 and 4
        var r = 1 + (Math.random() * 3);

        // Creates the geometry of the asteroid
        this.geometry = new THREE.CapsuleGeometry(r,l,6,10);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // variables to control the scaling of the asteroid and the rotation speed
        this.scaleFactor = 0;
        
        var rotationSpeed = 0.1;

        this.randRotateX = Math.random() * rotationSpeed - (rotationSpeed / 2);
        this.randRotateY = Math.random() * rotationSpeed - (rotationSpeed / 2);
        this.randRotateZ = Math.random() * rotationSpeed - (rotationSpeed / 2);

        // variables to control the asteroid speed
        this.xSpeed = Math.random() * 0.2 - 0.1;
        if (Math.abs(this.xSpeed) < 0.05 && this.xSpeed > 0) {
            this.xSpeed += 0.1;
        } else if (Math.abs(this.xSpeed) < 0.05 && this.xSpeed < 0) {
            this.xSpeed -= 0.1;
        }
    }

    // This function updates the asteroid's scale and rotation
    update() {
        this.mesh.scale.x = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.y = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.z = Math.sin(this.scaleFactor) * 0.25 + 1;

        this.scaleFactor += Math.PI / 180;
        if (this.scaleFactor > 2 * Math.PI) {
            this.scaleFactor = 0;
        }

        this.mesh.rotateX(this.randRotateX);
        this.mesh.rotateY(this.randRotateY);
        this.mesh.rotateZ(this.randRotateZ);

        this.mesh.position.x += this.xSpeed;
    }
}