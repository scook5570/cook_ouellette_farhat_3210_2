import * as THREE from "three";
import ObjectPool from "./ObjectPool";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(0, 0, 200); // Move camera slightly in front of where the cockpit will be
scene.add(camera);

// DO NOT REMOVE - KEEPS PROJECTION MATRIX STATIC ACROSS ALL SCREENS
// Ensures rear view ports always line up with the model
camera.aspect = 1263 / 598;
camera.updateProjectionMatrix();

camera.aspect = window.innerWidth / window.innerHeight;

var rearCamera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
rearCamera.position.set(0, 0, 5); // Position it behind the main camera
rearCamera.rotation.set(0, Math.PI, 0);
camera.add(rearCamera);

var leftCamera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
leftCamera.position.set(0, 0, 2); // Slightly behind main camera
leftCamera.rotation.set(0, Math.PI, 0);
camera.add(leftCamera); // Rear camera is bound to the main camera

// Mirror the rear cameras by scaling the X-axis of its projection matrix
rearCamera.projectionMatrix.elements[0] *= -1; // Flip the X-axis for the mirror effect
leftCamera.projectionMatrix.elements[0] *= -1;

// Virtual bounding box for camera
const cameraBoundingBox = new THREE.Box3(
  new THREE.Vector3(),
  new THREE.Vector3()
);
const cameraSize = 2; // Adjust size to fit the camera bounds

var renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up movement controls
let moveSpeed = 20;
var controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.1; // Adjust look speed
controls.movementSpeed = moveSpeed; // Movement speed for controls
controls.autoForward = true;

// Set up Effect Composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Set up Unreal Bloom Pass
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2, // Strength 
  1, // Radius
  0.8 // Threshold
);
composer.addPass(bloomPass);

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

// Create object pool
var pool = new ObjectPool(10).pool;
console.log(pool);

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

// Load GLB model
const loader = new GLTFLoader();
loader.load(
  "./eagle5.glb",
  function (gltf) {
    const cockpit = gltf.scene;
    cockpit.scale.set(0.5, 0.5, 0.5); // Scale smaller
    cockpit.position.set(0.68, -1.4, -0.22); // Set model position
    cockpit.rotation.set(0, Math.PI, 0); // Flip on y-axis
    camera.add(cockpit);
  },
  function (error) {
    console.error("An error happened while loading the model:", error);
  }
);

var clock = new THREE.Clock();
var delta = 0;

let hitCounter = 0;
let coolDown = false;
let endGameCounter = 0; // Prevents modal from resetting as impacts happen after death

// Function to update camera bounding box
function updateCameraBoundingBox() {
  cameraBoundingBox.setFromCenterAndSize(
    camera.position,
    new THREE.Vector3(cameraSize, cameraSize, cameraSize)
  );
}

// Function to update bounding boxes of objects
function updateBoundingBoxes() {
  for (var i = 0; i < pool.length; i++) {
    pool[i].boundingBox.setFromObject(pool[i].mesh);
  }
}

// Function to check for collisions
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

// Function to handle collision logic
function handleCollision() {
  if (coolDown) {
    return;
  }

  hitCounter++;

  const originalMoveSpeed = moveSpeed;
  controls.movementSpeed = -Math.abs(moveSpeed); // Reverse the moveSpeed

  // Reverse immunity - no collisions in this time period
  coolDown = true;
  setTimeout(() => {
    controls.movementSpeed = originalMoveSpeed;
    coolDown = false;
  }, 500);

  // Check if 3 hits and if endgame is not currently running
  if (hitCounter >= 3 && endGameCounter < 1) {
    endGame();
    endGameCounter++;
  }
}

// Array to hold the file paths of the GIFs
const gifArray = [
  "gifs/gif1.gif",
  "gifs/gif2.gif",
  "gifs/gif3.gif",
  "gifs/gif4.gif",
  "gifs/gif5.gif",
  "gifs/gif6.gif",
  "gifs/gif7.gif",
  "gifs/gif8.gif",
];

// Different quotes for every end game!
const quotesArray = [
  "Oh, no. Not again.",
  "Now you are going to die! BAM!",
  "No, no, no. Go past this. Pass this part. In fact, never play this again.",
  "Out of order? Even in the future nothing works!",
  "I've lost the bleeps, I've lost the sweeps, and I've lost the creeps.",
  "You listen. On this ship, you're to refer to me as 'idiot', not 'you captain'. I mean, you know what I mean.",
  "So, Lone Starr, now you see that evil will always triumph because good is dumb.",
  "Say goodbye to your two best friends, and I don't mean your pals in the Winnebago.",
  "I must have pressed the wrong button.",
  "I got no more left. Oh, waiter... cheque please.",
  "This ship will self-destruct in twenty seconds. This is your last chance to push the cancellation button.",
  "I hate it when I get my Schwartz twisted.",
  "Well, boys, it's a very lovely ship. I think you should go down with it.",
  "All personnel proceed to escape pods. Close down the circus. Evacuate the zoo. The self-destruct mechanism has been activated. Abandon ship.",
  "Ooh, I *hate* these movies!",
  "You are *ugly* when you're angry.",
  "Abandon ship! Abandon ship! Women and mawgs first!",
  "I can't believe you fell for the oldest trick in the book! What a goof!",
  "Oh, look, you fell for that too! I can't believe it, man!",
  "Thank you for pressing the self destruct button.",
  "It's either the 4th of July, or someone's trying to kill us!",
  "You are now our prisoner, and you will be held hostage until such time as all of the air is transferred from your planet to ours.",
  "If you do not give me the combination to the air shield, Dr. Schlotkin will give your daughter back... her old nose!",
  "On a sadder note, Pizza the Hutt, famed half man, half pizza, was found dead earlier today in the back seat of his stretched limo.",
  "All personnel proceed to escape pods. Close down the circus. Evacuate the zoo. The self-destruct mechanism has been activated. Abandon ship.",
];

// Function to get a random quote from the array
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  return quotesArray[randomIndex];
}

// Function to get a random GIF from the array
function getRandomGif() {
  const randomIndex = Math.floor(Math.random() * gifArray.length);
  return gifArray[randomIndex];
}

// Function to handle end game logic
function endGame() {
  moveSpeed = 0;
  controls.movementSpeed = moveSpeed;
  // Hide the game canvas and show the game-over screen
  document.getElementById("canvas").style.display = "flex";
  document.getElementById("game-over-screen").style.display = "flex";

  // Set a random quote in the paragraph
  var randomQuote = getRandomQuote();
  document.getElementById("random-quote").textContent = randomQuote;

  // Set a random GIF on the death screen
  var randomGif = getRandomGif();
  document.getElementById("death-gif").src = randomGif;
}

// Reload window
function restartGame() {
  window.location.reload();
}

// Check for button click and reload
document
  .getElementById("restart-button")
  .addEventListener("click", function () {
    restartGame();
  });

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Calculate delta time for smooth movement
  const delta = clock.getDelta();

  // Update all objects in the scene
  for (var i = 0; i < pool.length; i++) {
    pool[i].update(delta);
  }

  // Update controls
  controls.update(delta);

  checkCollisions();

  // Render the main view (full-screen) with emissions
  composer.render()

  // Render the rear-view mirror (smaller view at the top center)
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissor(
    window.innerWidth * 0.685,
    window.innerHeight * 0.667,
    window.innerWidth * 0.122,
    window.innerHeight * 0.072
  );
  renderer.setScissorTest(true);

  renderer.render(scene, rearCamera);

  // Disable scissor test after rendering rear view
  renderer.setScissorTest(false);

  // Render the rear-view left mirror (smaller view at the top center)
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissor(
    window.innerWidth * 0.371,
    window.innerHeight * 0.291,
    window.innerWidth * 0.03,
    window.innerHeight * 0.155
  );
  renderer.setScissorTest(true);

  renderer.render(scene, rearCamera);

  // Disable scissor test after rendering rear view
  renderer.setScissorTest(false);
}

// Handle window resize
window.addEventListener("resize", function () {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
