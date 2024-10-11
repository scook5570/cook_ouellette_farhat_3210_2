// Setup Three.js scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
camera.position.z = 3;
camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
scene.add(camera);

// Check and grab canvas if exists
const myCanvas = document.getElementById('myCanvas');
var renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
renderer.setClearColor(0x333339);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);