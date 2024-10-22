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
renderer.autoClear = false;

// Add basic lighting - Change later I just wanted to see the model
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light to simulate sunlight
directionalLight.position.set(10000, 10000, 10000); // Position way off in the distance
scene.add(directionalLight);

// Lighting for the camper 
const cabinLight = new THREE.PointLight(0xffffff, 10);
cabinLight.position.set(1, 1, -1);
camera.add(cabinLight);

const leftHeadLight = new THREE.PointLight(0xffffff, 100);
leftHeadLight.position.set(-1, -2, -6);
camera.add(leftHeadLight);

const rightHeadLight = new THREE.PointLight(0xffffff, 100);
rightHeadLight.position.set(6, -2, -6);
camera.add(rightHeadLight);

var pool = new ObjectPool(10).pool;
console.log(pool);

let moveSpeed = 0.5;

for (var i = 0; i < pool.length; i++) {
  var a = pool[i];
  scene.add(a.mesh);
  a.mesh.translateX(Math.random() * 50 - 25);
  a.mesh.translateY(Math.random() * 50 - 25);
  a.mesh.translateZ(Math.random() * 50 - 25);

  // Create a bounding box for each object
  a.mesh.geometry.computeBoundingBox();
  a.boundingBox = new THREE.Box3().setFromObject(a.mesh); // Create the bounding box
}

// Load the cockpit model
const loader = new GLTFLoader();
loader.load(
  "eagle5.glb",
  function (gltf) {
    const cockpit = gltf.scene;

    // Adjust scale and position the cockpit
    cockpit.scale.set(0.5, 0.5, 0.5);
    cockpit.position.set(0.68, -1.4, -0.35);

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

// Virtual bounding box for camera
const cameraBoundingBox = new THREE.Box3(
  new THREE.Vector3(),
  new THREE.Vector3()
);
const cameraSize = 2; // Adjust size to fit the camera bounds

function updateCameraBoundingBox() {
  cameraBoundingBox.setFromCenterAndSize(
    camera.position,
    new THREE.Vector3(cameraSize, cameraSize, cameraSize)
  );
}

function updateBoundingBoxes() {
  for (var i = 0; i < pool.length; i++) {
    pool[i].boundingBox.setFromObject(pool[i].mesh);
  }
}

function checkCollisions() {
  updateBoundingBoxes();
  updateCameraBoundingBox();

  for (var i = 0; i < pool.length; i++) {
    var objectBoundingBox = pool[i].boundingBox;

    if (cameraBoundingBox.intersectsBox(objectBoundingBox)) {
      console.log("Collision detected with object " + i);
      handleCollision();
    }
  }
}

let hitCounter = 0;
let coolDown = false

function handleCollision() {
  if (coolDown) {
    return;
  }

  hitCounter++;
  
  const originalMoveSpeed = 0.5;
  moveSpeed = -Math.abs(moveSpeed); // Reverse the moveSpeed

  coolDown = true;
  setTimeout(() => {
    moveSpeed = originalMoveSpeed;
    coolDown = false;
  }, 500);

  console.log("Collision detected: Reversing movement for 1 second");

  if (hitCounter >= 3) {
    endGame();  // Call the endGame function when 3 hits are reached
  }
}

function endGame() {
  // Hide the game canvas and show the game-over screen
  document.getElementById("myCanvas").style.display = "none";
  document.getElementById("game-over-screen").style.display = "block";
  
  // Lock the controls if needed
  controls.unlock();
}

document.getElementById("restart-button").addEventListener("click", function() {
  restartGame();
});

function restartGame() {
  window.location.reload();
}

function animate() {
  renderer.clear();
  delta = clock.getDelta();

  for (var i = 0; i < pool.length; i++) {
    pool[i].update(delta);
  }

  if (controls.isLocked) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, moveSpeed);
  }

  checkCollisions(); // Check for collisions after moving the camera

  // Render the main camera view (full screen)
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

// Resize handler to ensure correct aspect ratio
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
