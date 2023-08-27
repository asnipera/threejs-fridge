import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Canvas
const canvas = document.querySelector("#mainCanvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 4, 6);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.zoomSpeed = 0.3;
controls.target = new THREE.Vector3(0, 3, 0);
controls.autoRotate = true;

/**
 * Objects
 */
// plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15),
  new THREE.MeshStandardMaterial({
    color: "#607D8B",
  })
);
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

/**
 * Models
 */
const gltfLoader = new GLTFLoader();
// draco
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
// Specify path to a folder containing WASM/JS decoding libraries.
dracoLoader.setDecoderPath("/draco/");
// Optional: Pre-fetch Draco WASM/JS module.
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
  "/fridge/scene.gltf",
  (gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);
  },
  (progress) => {
    console.log("progress");
    console.log(progress);
  },
  (error) => {
    console.log("error");
    console.log(error);
  }
);

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight();
directionLight.castShadow = true;
directionLight.position.set(5, 5, 6);
directionLight.shadow.camera.near = 1;
directionLight.shadow.camera.far = 20;
directionLight.shadow.camera.top = 10;
directionLight.shadow.camera.right = 10;
directionLight.shadow.camera.bottom = -10;
directionLight.shadow.camera.left = -10;

const directionLightHelper = new THREE.DirectionalLightHelper(
  directionLight,
  2
);
directionLightHelper.visible = false;
scene.add(directionLightHelper);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

const ambientLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.3);
scene.add(ambientLight, directionLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Animations
const tick = () => {
  // Render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
