import * as THREE from 'three';

export default class TetrahedronAsteroid {
    constructor() {
        // radius is between 2 and 7
        var r = 2 + (Math.random() * 5);

        // detail between 1 and 10
        var d = Math.floor((Math.random() * 10));

        this.geometry = new THREE.TetrahedronGeometry(r, d);

        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}