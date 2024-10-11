import THREE from 'three';

export function CapsuleAstroid(r,l) {
    this.geo = new THREE.CapsuleGeometry(r,l,6,10);

    // Creates the material color for the astroid
    let color = "#";
    let letters = "0123456789ABCDEF";
    for (let j = 0; j < 6; j++) 
        color += letters[(Math.floor(Math.random() * 16))];
    this.material = new THREE.MeshBasicMaterial({color: color});

    this.mesh = new THREE.Mesh(this.geo, this.material);
    
}