import * as THREE from 'three';

export default class SphereAstroid {    
    constructor() {
        // radius is between 3 and 10
        var r = 3 + (Math.random() * 7);

        this.geometry = new THREE.SphereGeometry(r,10,10);

        var color = Math.random() * 0xffffff;
        this.material = new THREE.MeshBasicMaterial({color: color});

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}