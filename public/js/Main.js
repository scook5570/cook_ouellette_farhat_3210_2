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
let coolDown = false;
let endGameCounter = 0; // Prevents modal from resetting as impacts happen after death

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

  if (hitCounter >= 3 && endGameCounter < 1) {
    endGame(); // Call the endGame function when 3 hits are reached
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

function endGame() {
  // Unlock controls to allow mouse movement
  controls.unlock();

  // Hide the game canvas and show the game-over screen
  document.getElementById("myCanvas").style.display = "flex";
  document.getElementById("game-over-screen").style.display = "flex";

  // Set a random quote in the paragraph
  const randomQuote = getRandomQuote();
  document.getElementById("random-quote").textContent = randomQuote;

  // Set a random GIF on the death screen
  const randomGif = getRandomGif();
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

function animate() {
  // Clear renderer for multiple view ports (auto clear disabled)
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
