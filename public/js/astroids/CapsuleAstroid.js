import * as THREE from 'three';

export default class CapsuleAstroid {
    constructor() {
        // length is between 3 and 10
        var l = 3 + (Math.random() * 7);
        // radius is between 1 and 4
        var r = 1 + (Math.random() * 3);

        this.geometry = new THREE.CapsuleGeometry(r,l,6,10);

        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scaleFactor = Math.sin(Math.PI / 1000);
        
        var rotationSpeed = 0.1;

        this.randRotateX = Math.random() * rotationSpeed - 0.05;
        this.randRotateY = Math.random() * rotationSpeed - 0.05;
        this.randRotateZ = Math.random() * rotationSpeed - 0.05;
    }

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