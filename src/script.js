import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { log } from 'three/examples/jsm/nodes/Nodes.js';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const gui = new GUI();

let width = window.innerWidth;
let height = window.innerHeight;

//================== Objects ========================
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#b9ca3f' })
);
object1.position.x = -2;
/* To get the right distance of ray casting: Threejs updates the objs' coordinates right before rendering them, since we do the ray casting immediately, none of the objs' coordinates have been rendered - They are all 2.5, while it should be obj1=0.5, obj2=2.5, obj3=4.5 */
object1.updateMatrixWorld();

const object2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1.5),
  new THREE.MeshBasicMaterial({ color: '#b9ca3f' })
);
object2.updateMatrixWorld();

const object3 = new THREE.Mesh(
  new THREE.ConeGeometry(0.7, 1),
  new THREE.MeshBasicMaterial({ color: '#b9ca3f' })
);
object3.position.x = 2;
object3.updateMatrixWorld();

scene.add(object1, object2, object3);

//================ Raycaster ========================
const raycaster = new THREE.Raycaster();

//================= Camera ==========================
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 4;
scene.add(camera);

//============== Orbit Controls =====================
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//================= Renderer ========================
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//=============== Resize Listener ====================
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//==================== Cursor ========================
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  // We need a value between -1 to 1
  mouse.x = (e.clientX / width) * 2 - 1;
  mouse.y = -(e.clientY / height) * 2 + 1;

  // console.log(mouse);
});

window.addEventListener('click', () => {
  if (currentIntersect) {
    console.log('Click on an Object');
  }
});

//=================== Animate ========================
const clock = new THREE.Clock();
let prevTime = 0;

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime - elapsedTime;

  //=== Animate Objects
  object1.position.y = Math.sin(deltaTime * 0.8) * 1.5;
  object2.position.y = Math.sin(deltaTime * 1) * 1.5;
  object3.position.y = Math.sin(deltaTime * 1.3) * 1.5;

  raycaster.setFromCamera(mouse, camera);
  const objectsContainer = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsContainer);
  // console.log(intersects.length);

  // Force the objects to have the main color then...
  for (const obj of objectsContainer) {
    obj.material.color.set('#c1d42c');
  }

  // Change the color of those who intersect with the ray
  for (const intersect of intersects) {
    intersect.object.material.color.set('#6a53be'); // purple
  }

  // If you like to show a message or hide it
  if (intersects.length) {
    if (currentIntersect === null) {
      console.log('Mouse Entered!');
    }
    // something intersecting
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log('Mouse Leaved!');
    }

    // nothing intersecting
    currentIntersect = null;
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/* Static Objects - ray casting

const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-3, 0, 0);
// Direction must have a length of 1, otherwise it should be normalized
const rayDirection = new THREE.Vector3(10, 0, 0);
// console.log(rayDirection.length());
rayDirection.normalize();
// console.log(rayDirection.length());

raycaster.set(rayOrigin, rayDirection);

const intersect = raycaster.intersectObject(object1);
console.log(intersect);

const intersects = raycaster.intersectObjects([object1, object2, object3]);
console.log(intersects);
*/

/* Dynamic Objects - ray casting 
- inside tick()


  //=== Animate Objects
  object1.position.y = Math.sin(deltaTime * 0.8) * 1.5;
  object2.position.y = Math.sin(deltaTime * 1) * 1.5;
  object3.position.y = Math.sin(deltaTime * 1.3) * 1.5;

  //=== Cast a ray
  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirection = new THREE.Vector3(1, 0, 0);
  rayDirection.normalize();

  raycaster.set(rayOrigin, rayDirection);

  const objectsContainer = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsContainer);
  // console.log(intersects.length);

  // Force the objects to have the main color then...
  for (const obj of objectsContainer) {
    obj.material.color.set('#c1d42c');
  }

  // Change the color of those who intersect with the ray
  for (const intersect of intersects) {
    intersect.object.material.color.set('#6a53be'); // purple
  }
*/
