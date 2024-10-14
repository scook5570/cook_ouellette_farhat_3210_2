import * as THREE from 'three';
import ObjectPool from './asteroids/ObjectPool';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
camera.position.z = 100;  
camera.lookAt( new THREE.Vector3(0.0,0.0,0.0));
scene.add( camera );

var renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// var s = new SquareAsteroid();
// scene.add(s.mesh);

// var c = new CapsuleAsteroid();
// scene.add(c.mesh);

// c.mesh.translateX(15);

// var sp = new SphereAsteroid();
// scene.add(sp.mesh);

// sp.mesh.translateX(-15);

// var t = new TorusAsteroid();
// scene.add(t.mesh);

// t.mesh.translateY(-15);

// var tk = new TorusKnotAsteroid();
// scene.add(tk.mesh);

// tk.mesh.translateY(15);

// var tr = new TetrahedronAsteroid();
// scene.add(tr.mesh);

// tr.mesh.translateY(15);
// tr.mesh.translateX(15);

var pool = new ObjectPool(10).pool;
console.log(pool);

for(var i = 0; i < pool.length; i++){
    var a = pool[i];
    scene.add(a.mesh);
    a.mesh.translateX(Math.random() * 50 - 25);
    a.mesh.translateY(Math.random() * 50 - 25);
    a.mesh.translateZ(Math.random() * 50 - 25);
}

function animate() {

    for (var i = 0; i < pool.length; i++){
        pool[i].update();
    }   

    // s.update();
    // c.update();

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
animate();