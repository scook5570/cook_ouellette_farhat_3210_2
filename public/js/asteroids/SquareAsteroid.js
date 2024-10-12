import * as THREE from 'three';

export default class SquareAsteroid {
    constructor() {
        // side is between 3 and 10
        var side = 3 + (Math.random() * 7);
        
        this.geometry = new THREE.BoxGeometry(side,side,side);

        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});


        this.mesh = new THREE.Mesh(this.geometry, this.material);

        var rotationSpeed = 0.1;

        this.randRotateX = Math.random() * rotationSpeed - 0.05;
        this.randRotateY = Math.random() * rotationSpeed - 0.05;
        this.randRotateZ = Math.random() * rotationSpeed - 0.05;
    }

    update() {
        this.mesh.rotateX(this.randRotateX);
        this.mesh.rotateY(this.randRotateY);
        this.mesh.rotateZ(this.randRotateZ);
    }
}