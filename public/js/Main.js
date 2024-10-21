import * as THREE from 'three';
import ObjectPool from './ObjectPool';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
camera.position.z = 200;  
camera.lookAt( new THREE.Vector3(0.0,0.0,0.0));
scene.add( camera );

var renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var pool = new ObjectPool(10).pool;
console.log(pool);

for(var i = 0; i < pool.length; i++){
    var a = pool[i];
    scene.add(a.mesh);
    a.mesh.translateX(Math.random() * 50 - 25);
    a.mesh.translateY(Math.random() * 50 - 25);
    a.mesh.translateZ(Math.random() * 50 - 25);
}

var clock = new THREE.Clock();
var delta = 0;

function animate() {

    delta = clock.getDelta();

    for (var i = 0; i < pool.length; i++){
        pool[i].update(delta);
    }

    // s.update();
    // c.update();

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
animate();