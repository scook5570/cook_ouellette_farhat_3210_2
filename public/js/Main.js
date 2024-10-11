import * as THREE from 'three';
import SquareAstroid from './astroids/SquareAstroid';
import CapsuleAstroid from './astroids/CapsuleAstroid';
import SphereAstroid from './astroids/SphereAstroid';
import TorusAstroid from './astroids/TorusAstroid';
import TorusKnotAstroid from './astroids/TorusKnotAstroid';
import TetrahedronAstroid from './astroids/TetrahedronAstroid';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
camera.position.z = 100;  
camera.lookAt( new THREE.Vector3(0.0,0.0,0.0));
scene.add( camera );

var renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var s = new SquareAstroid();
scene.add(s.mesh);

var c = new CapsuleAstroid();
scene.add(c.mesh);

c.mesh.translateX(15);

var sp = new SphereAstroid();
scene.add(sp.mesh);

sp.mesh.translateX(-15);

var t = new TorusAstroid();
scene.add(t.mesh);

t.mesh.translateY(-15);

var tk = new TorusKnotAstroid();
scene.add(tk.mesh);

tk.mesh.translateY(15);

var tr = new TetrahedronAstroid();
scene.add(tr.mesh);

tr.mesh.translateY(15);
tr.mesh.translateX(15);

function animate() {

    s.update();
    c.update();

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
animate();