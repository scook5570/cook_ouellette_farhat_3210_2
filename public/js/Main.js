import * as THREE from "three";
import ObjectPool from "./ObjectPool";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.z = 200;
scene.add(camera);

// Add PointerLockControls
const controls = new PointerLockControls(camera, document.body); // Controls camera using Pointer Lock

var renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var pool = new ObjectPool(10).pool;
console.log(pool);

const moveSpeed = 0.5

for (var i = 0; i < pool.length; i++) {
  var a = pool[i];
  scene.add(a.mesh);
  a.mesh.translateX(Math.random() * 50 - 25);
  a.mesh.translateY(Math.random() * 50 - 25);
  a.mesh.translateZ(Math.random() * 50 - 25);
}

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

function animate() {
  for (var i = 0; i < pool.length; i++) {
    pool[i].update(Date.now());
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
animate();

// Resize handler to ensure correct aspect ratio
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
