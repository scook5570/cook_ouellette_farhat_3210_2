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
        this.XZ = Math.floor(Math.random());
        this.temp = Math.floor(Math.random());
        this.negative = 0
        if (this.temp == 1) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }

        this.randXRotate = Math.PI / (Math.random() * 2 + 1) * this.negative;
        this.randYRotate = Math.PI / (Math.random() * 2 + 1) * this.negative;
        this.randZRotate = Math.PI / (Math.random() * 2 + 1) * this.negative;

        // Allows the torus to move in the x/y direction by a sin wave
        this.sinSpeed = 0;
        this.speed = Math.random() * (2 * Math.PI) + Math.PI;
    }

    // This function updates the asteroid movement through space
    update(t) {
        this.sinSpeed += (Math.PI / 2) * t;

        this.mesh.position.y = Math.sin(this.sinSpeed) * 10;
        if (this.XZ == 0) {
            this.mesh.position.x += this.speed * t * this.negative;
        } else {
            this.mesh.position.y += this.speed * t * this.negative;
        }

        if (this.sinSpeed > 2 * Math.PI) {
            this.sinSpeed = 0;
        }

        this.mesh.rotateX(this.randXRotate * t);
        this.mesh.rotateY(this.randYRotate * t);
        this.mesh.rotateZ(this.randZRotate * t);
    }
}