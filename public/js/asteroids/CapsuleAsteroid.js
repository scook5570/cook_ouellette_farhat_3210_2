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


        var temp = Math.random();
        this.negative = 0;
        this.random = 0;
        if (this.temp > 0.5) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        
        // variables to control the scaling of the asteroid and the rotation speed
        this.scaleFactor = 0;
        
        var rotationSpeed = 1; // in seconds

        this.randRotateX = Math.random() * rotationSpeed - (rotationSpeed / 2);
        this.randRotateY = Math.random() * rotationSpeed - (rotationSpeed / 2);
        this.randRotateZ = Math.random() * rotationSpeed - (rotationSpeed / 2);

        // variables to control the asteroid speed
        this.xSpeed = this.negative * (Math.random() * 4 + 2);
    }

    // This function updates the asteroid's scale and rotation
    update(t) {
        this.mesh.scale.x = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.y = Math.sin(this.scaleFactor) * 0.25 + 1;
        this.mesh.scale.z = Math.sin(this.scaleFactor) * 0.25 + 1;

        this.scaleFactor += Math.PI * t;
        if (this.scaleFactor > 2 * Math.PI) {
            this.scaleFactor = 0;
        }

        this.mesh.rotateX(this.randRotateX * t);
        this.mesh.rotateY(this.randRotateY * t);
        this.mesh.rotateZ(this.randRotateZ * t);

        this.mesh.position.x += this.xSpeed * t;
    }
}