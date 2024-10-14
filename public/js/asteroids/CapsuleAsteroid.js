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
        this.scaleFactor = Math.sin(Math.PI / 1000);
        
        var rotationSpeed = 0.1;

        this.randRotateX = Math.random() * rotationSpeed - (rotationSpeed / 2);
        this.randRotateY = Math.random() * rotationSpeed - (rotationSpeed / 2);
        this.randRotateZ = Math.random() * rotationSpeed - (rotationSpeed / 2);
    }

    // This function updates the asteroid's scale and rotation
    update() {
        if (this.mesh.scale.x > 1.25 || 
            this.mesh.scale.y > 1.25 ||
            this.mesh.scale.z > 1.25) {
            this.scaleFactor = -this.scaleFactor;
        }
        if (this.mesh.scale.x < 0.75 || 
            this.mesh.scale.y < 0.75 ||
            this.mesh.scale.z < 0.75 ){
            this.scaleFactor = -this.scaleFactor;
        }

        this.mesh.scale.x += this.scaleFactor;
        this.mesh.scale.y += this.scaleFactor;
        this.mesh.scale.z += this.scaleFactor;

        this.mesh.rotateX(this.randRotateX);
        this.mesh.rotateY(this.randRotateY);
        this.mesh.rotateZ(this.randRotateZ);
    }
}