import * as THREE from 'three';

export default class TorusAsteroid {
    constructor() {
        // radius is between 2 and 7
        var r = 2 + (Math.random() * 5);

        // tube is between 0.5 and 2.5
        var tube = 0.5 + (Math.random() * 2);

        this.geometry = new THREE.TorusGeometry(r, tube);

        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    update() {
    }
}