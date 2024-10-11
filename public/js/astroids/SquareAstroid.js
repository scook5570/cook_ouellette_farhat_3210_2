import * as THREE from 'three';

export function SquareAstroid(w,h,d) {
    // Creates the geometry for the astroid
    this.geo = new THREE.BoxGeometry(w,h,d);

    // Creates the material color for the astroid
    let color = "#";
    let letters = "0123456789ABCDEF";
    for (let j = 0; j < 6; j++) 
        color += letters[(Math.floor(Math.random() * 16))];
    this.material = new THREE.MeshBasicMaterial({color: color});

    // Creates the mesh of the astroid and the axis the object will be rotating on.
    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.rand = Math.floor(Math.random() * 3);

    // This function proforms the thing the atroid will be doing
    this.move = function() {
        if (this.rand ==  0) {
            this.mesh.rotateX((Math.random()*10)/Math.PI);
        } else if(this.rand == 1) {
            this.mesh.rotateY((Math.random()*10)/Math.PI);
        } else {
            this.mesh.rotateZ((Math.random()*10)/Math.PI);
        }
    }

}