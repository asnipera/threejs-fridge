import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// init
const scene = new THREE.Scene();
const house = new THREE.Group();
scene.add(house);
const textureLoader = new THREE.TextureLoader();
// walls
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door2/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door2/height.png");
const doorNormalTexture = textureLoader.load("/textures/door2/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "/textures/door2/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/textures/door2/roughness.jpg"
);

const brickColorTexture = textureLoader.load("/textures/brick/baseColor.jpg");

const brickAmbientOcclusionTexture = textureLoader.load(
  "/textures/brick/ambientOcclusion.jpg"
);
const brickHeightTexture = textureLoader.load("/textures/brick/height.png");
const brickNormalTexture = textureLoader.load("/textures/brick/normal.jpg");
const brickRoughnessTexture = textureLoader.load(
  "/textures/door2/roughness.jpg"
);

brickColorTexture.repeat.set(3, 3);
brickAmbientOcclusionTexture.repeat.set(3, 3);
brickHeightTexture.repeat.set(3, 3);
brickNormalTexture.repeat.set(3, 3);
brickRoughnessTexture.repeat.set(3, 3);

brickColorTexture.wrapS = THREE.RepeatWrapping;
brickAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
brickHeightTexture.wrapS = THREE.RepeatWrapping;
brickNormalTexture.wrapS = THREE.RepeatWrapping;
brickRoughnessTexture.wrapS = THREE.RepeatWrapping;

brickColorTexture.wrapT = THREE.RepeatWrapping;
brickAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
brickHeightTexture.wrapT = THREE.RepeatWrapping;
brickNormalTexture.wrapT = THREE.RepeatWrapping;
brickRoughnessTexture.wrapT = THREE.RepeatWrapping;

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    displacementMap: brickHeightTexture,
    displacementScale: 0.001,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  })
);
walls.position.y = 1.25;
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.25, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI / 4;
roof.position.y = 3;
house.add(roof);

// door

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    // alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.z = 2 + 0.01;
door.position.y = 1;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#C8CBA4" });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// lights
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
directionalLight.position.set(1, 0.75, 0);
scene.add(directionalLight);

// door light
const doorLight = new THREE.PointLight("#ff7d46", 3, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

// graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

// ground
const floorColorTexture = textureLoader.load("/textures/floor/baseColor.jpg");
const floorAmbientOcclusionTexture = textureLoader.load(
  "/textures/floor/ambientOcclusion.jpg"
);
const floorHeightTexture = textureLoader.load("/textures/floor/height.png");
const floorNormalTexture = textureLoader.load("/textures/floor/normal.jpg");
const floorRoughnessTexture = textureLoader.load(
  "/textures/door2/roughness.jpg"
);
floorColorTexture.repeat.set(8, 8);
floorAmbientOcclusionTexture.repeat.set(8, 8);
floorHeightTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorRoughnessTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
floorHeightTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
floorHeightTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;

// ground
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorAmbientOcclusionTexture,
    displacementMap: floorHeightTexture,
    displacementScale: 0.01,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
  })
);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.position.set(0, 0, 0);
scene.add(plane);

// ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

//size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 2, 4);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

directionalLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

plane.receiveShadow = true;

// animation
// function animation() {
//   controls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(animation);
// }

// animation();

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  controls.update();

  // Render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
