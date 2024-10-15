import * as THREE from 'three';

export default class TorusAsteroid {
    constructor() {
        // radius is between 2 and 7
        var r = 2 + (Math.random() * 5);

        // tube is between 0.5 and 2.5
        var tube = 0.5 + (Math.random() * 2);

        // Creates the geometry of the asteroid
        this.geometry = new THREE.TorusGeometry(r, tube);

        // Creates a random color for the asteroid
        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        // Creates the mesh of the asteroid
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Allows the torus to rotate around the z axis
        this.XYZ = Math.floor(Math.random() * 3);
        this.negative = Math.floor(Math.random() * 2 - 1);
        if (this.negative == 0) {
            this.negative = 1;
        }
        console.log(this.XYZ);
        this.randRotate = Math.PI / (Math.random() * 80 + 100) * this.negative;

        // Allows the torus to move in the x/y direction by a sin wave
        this.xSpeed = 0;
    }

    // This function updates the asteroid movement through space
    update() {
        if (this.XYZ == 0) {
            this.mesh.position.x += Math.sin(this.xSpeed/0.75) * Math.PI / 10;
            this.mesh.position.y += this.negative * Math.PI / 30;
        } else if (this.XYZ == 1) {
            this.mesh.position.y += Math.sin(this.xSpeed/0.75) * Math.PI / 10;
            this.mesh.position.x += this.negative * Math.PI / 30;
        } else {
            this.mesh.position.x += Math.sin(this.xSpeed/0.75) * Math.PI / 10;
            this.mesh.position.z += this.negative * Math.PI / 30;
        }
    

        this.xSpeed += (Math.PI / 360);

        if (this.XYZ == 0) {
            this.mesh.rotateX(this.randRotate);
        } else if (this.XYZ == 1) {
            this.mesh.rotateY(this.randRotate);
        } else {
            this.mesh.rotateX(this.randRotate);
            this.mesh.rotateY(this.randRotate);
            this.mesh.rotateZ(this.randRotate);
        }
    }
}