import * as THREE from "three";
import ObjectPool from "./ObjectPool";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(0, 0, 200); // Move camera slightly in front of where the cockpit will be
scene.add(camera);

// Add PointerLockControls
const controls = new PointerLockControls(camera, document.body); // Controls camera using Pointer Lock

var renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Add basic lighting - Change later I just wanted to see the model
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light to simulate sunlight
directionalLight.position.set(10000, 10000, 10000); // Position way off in the distance
scene.add(directionalLight);

var pool = new ObjectPool(10).pool;
console.log(pool);

const moveSpeed = 0.5;

for (var i = 0; i < pool.length; i++) {
  var a = pool[i];
  scene.add(a.mesh);
  a.mesh.translateX(Math.random() * 50 - 25);
  a.mesh.translateY(Math.random() * 50 - 25);
  a.mesh.translateZ(Math.random() * 50 - 25);
}

// Load the cockpit model
const loader = new GLTFLoader();
loader.load(
  "eagle5.glb",
  function (gltf) {
    const cockpit = gltf.scene;

    // Adjust scale and position the cockpit
    cockpit.scale.set(0.5, 0.5, 0.5); 
    cockpit.position.set(0.68, -1.4, -0.5); 

    camera.add(cockpit); // Binds it to the camera rather than world
    cockpit.rotation.set(0, Math.PI, 0); // Flip on y axis
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Pointer Lock API to capture mouse input
function enablePointerLock() {
  const canvas = renderer.domElement;

  // Request pointer lock on click
  canvas.addEventListener("click", () => {
    controls.lock(); // Lock the pointer and enable controls
  });

  // Pointer lock change event listeners
  controls.addEventListener("lock", () => {
    console.log("Pointer locked");
  });

  controls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
  });
}

enablePointerLock();

var clock = new THREE.Clock();
var delta = 0;

function animate() {
  
  delta = clock.getDelta();
  
  for (var i = 0; i < pool.length; i++) {
    pool[i].update(delta);
  }

  if (controls.isLocked) {
    // Get the direction the camera is facing
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction); // This returns a normalized vector pointing forward

    // Move the camera in the direction it's facing
    camera.position.addScaledVector(direction, moveSpeed);
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Resize handler to ensure correct aspect ratio
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
