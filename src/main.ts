import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Tween, Easing, update } from "three/examples/jsm/libs/tween.module.js";
// gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");
// 给scene添加一个背景图片
// scene.background = new THREE.CubeTextureLoader().load([
//   "/skybox/px.jpg",
//   "/skybox/nx.jpg",
//   "/skybox/py.jpg",
//   "/skybox/ny.jpg",
//   "/skybox/pz.jpg",
//   "/skybox/nz.jpg",
// ]);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-6, 1.5, 1.2);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionLight.position.set(-2, -1, -2);
directionLight.shadow.camera.near = 10;
directionLight.shadow.camera.far = 200;
directionLight.shadow.camera.top = 10;
directionLight.shadow.camera.right = 100;
directionLight.shadow.camera.bottom = -10;
directionLight.shadow.camera.left = -10;
// helper
// const helper = new THREE.DirectionalLightHelper(directionLight, 1);
// scene.add(helper);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight, directionLight);
// 自然光
const hemisphereLight = new THREE.HemisphereLight(
  new THREE.Color("#ffffff"),
  new THREE.Color("#000000"),
  1
);
scene.add(hemisphereLight);

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
let left_door: THREE.Group;
gltfLoader.load("/box/16_door.gltf", (gltf) => {
  gltf.scene.name = "left_door";
  left_door = gltf.scene;
  gltf.scene.scale.set(0.03, 0.03, 0.03);
  gltf.scene.children[0].translateY(36);
  gltf.scene.children[0].translateX(18);
  gltf.scene.position.set(-0.5, 0, 1.08);
  scene.add(gltf.scene);
});

let squareHeight = 0;
let boxHelpers: Record<string, THREE.Object3D<THREE.Event>>[] = [];
function createSquare(
  row: number,
  column: number,
  square: THREE.Object3D<THREE.Event>,
  fridge: THREE.Object3D<THREE.Event>,
  rowSpan = 0.8,
  prefixName = "square",
  colSpan = 0.7
) {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      const _square = square.clone();
      _square.userData.id = `${i}_${j}`;
      boxHelpers.push({
        [_square.userData.id]: _square,
      });
      _square.name = `${prefixName}_${i}_${j}`;
      const box = new THREE.Box3().setFromObject(_square);
      const size = box.getSize(new THREE.Vector3());
      squareHeight = size.y;
      _square.position.setY(_square.position.y + size.y * i + rowSpan * i);
      _square.position.setZ(_square.position.z + size.z * j + colSpan * j);
      _square.receiveShadow = true;
      _square.userData.isContainer = true;
      fridge.add(_square);
    }
  }
}

function createLattice(
  row: number,
  square: THREE.Object3D<THREE.Event>,
  fridge: THREE.Object3D<THREE.Event>,
  prefixName = "lattice",
  span = 3.6
) {
  for (let i = 0; i < row; i++) {
    const _square = square.clone();
    _square.name = `${prefixName}_${i}`;
    const currentY = _square.position.y;
    _square.position.setY(currentY + squareHeight * i + span * (i + 1));
    _square.receiveShadow = true;
    fridge.add(_square);
  }
}

let fridge_door: THREE.Group;
let fridge: GLTF;
gltfLoader.load(
  "/box/32.gltf",
  (gltf) => {
    gltf.scene.scale.set(0.03, 0.03, 0.03);
    const doorLight = new THREE.PointLight("#ffffff", 1, 7);
    doorLight.position.set(0, 60, -10);
    // helper
    const doorLightHelper = new THREE.PointLightHelper(doorLight, 1);
    doorLight.castShadow = true;
    doorLight.shadow.camera.near = 1;
    doorLight.shadow.camera.far = 20;
    doorLight.shadow.mapSize.set(1024, 1024);
    doorLight.shadow.radius = 5;
    doorLight.shadow.bias = -0.0001;
    doorLight.shadow.normalBias = 0.02;
    doorLight.shadow.camera.updateProjectionMatrix();
    gltf.scene.add(doorLight);
    scene.add(doorLightHelper);

    // const _scene2 = gltf.scene.clone();
    // _scene2.name = "right_door";
    // // _scene2.rotation.y = -Math.PI;
    // _scene2.children[0].translateZ(1);
    // _scene2.position.set(0, 0, -2);
    // right_door = _scene2;
    // gltf.scene.add(doorLight);
    // scene.add(doorLightHelper);
    fridge = gltf;
    createSqureAndLattice(settings.rowCount, settings.colCount);
    scene.add(gltf.scene);
  },
  (error) => {
    console.log("error");
    console.log(error);
  }
);

function createSqureAndLattice(row: number, column: number) {
  boxHelpers = [];
  fridge.scene.traverse((item) => {
    if (item.name === "Cube") {
      item.castShadow = true;
      item.visible = true;
      createSquare(row, column, item, fridge.scene, 4.2);
      item.visible = false;
    }
  });

  fridge.scene.traverse((item) => {
    if (item.name === "Box033_Chrome_0001") {
      item.castShadow = true;
      item.visible = true;
      createLattice(row, item, fridge.scene);
      item.visible = false;
    }
  });
}

function hideBoxAndLattice() {
  fridge.scene.traverse((item) => {
    if (item.name.startsWith("square") || item.name.startsWith("lattice")) {
      item.visible = false;
    }
  });
}

// gltfLoader.load(
//   "/box/16_square_1.gltf",
//   (gltf) => {
//     gltf.scene.scale.set(0.03, 0.03, 0.03);
//     gltf.scene.position.x = 0.4;
//     // const _scene2 = gltf.scene.clone();
//     // _scene2.name = "right_door";
//     // // _scene2.rotation.y = -Math.PI;
//     // _scene2.children[0].translateZ(1);
//     // _scene2.position.set(0, 0, -2);
//     // right_door = _scene2;
//     scene.add(gltf.scene);
//   },
//   (progress) => {},
//   (error) => {
//     console.log("error");
//     console.log(error);
//   }
// );

// Controls
new OrbitControls(camera, renderer.domElement);

// 创建面板的几何体
const geometry = new THREE.PlaneGeometry(2, 2);
// 将面板的中心点移动到左侧边框
geometry.translate(1, 0, 0);
// 创建面板的材质（可以自定义颜色或纹理）
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});

// 坐标系
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 创建面板的网格，并设置初始位置和旋转角度
const panel = new THREE.Mesh(geometry, material);
panel.position.set(-1, 0, 0);
// panel.rotation.y = Math.PI / 2; // 初始旋转角度，这里使用弧度制
panel.name = "door";
// scene.add(panel);

// // 动画循环
// function animate() {
//   // 调用旋转动画函数
//   rotatePanel();
//   // 渲染场景
//   renderer.render(scene, camera);
//   update();
// }

// // 启动动画循环
// animate();

// var tween = new Tween(panel.position)
//   .to({ x: 100, y: 100, z: 100 }, 10000)
//   .onUpdate(function (this: { lv: number }) {
//     console.log(this);
//   })
//   .start();
// tween.start();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  update();
}
animate();

// 角度换算成弧度
function angleToRadian(angle: number) {
  return (angle * Math.PI) / 180;
}

// 创建gui单击按钮
const gui = new GUI({ width: 200 });
const folder = gui.addFolder("操作");
folder
  .add(
    {
      click: () =>
        new Tween(left_door.rotation)
          .to(
            {
              // 45度
              y: angleToRadian(160),
            },
            1000
          )
          // 打开冰箱门
          .easing(Easing.Linear.None)
          .start(),
    },
    "click"
  )
  .name("开门");

folder
  .add(
    {
      click: () =>
        new Tween(left_door.rotation)
          .to(
            {
              y: angleToRadian(0),
            },
            1000
          )
          // 打开冰箱门
          .easing(Easing.Linear.None)
          .start(),
    },
    "click"
  )
  .name("关门");

const settings = {
  rowCount: 3,
  colCount: 5,
  showModal: false,
};

const settingFolder = gui.addFolder("设置");

// rowCount改变时，重新渲染层数

settingFolder
  .add(settings, "rowCount", 1, 6, 1)
  .name("行数")
  .onChange((value: number) => {
    hideBoxAndLattice();
    settings.rowCount = value;
    createSqureAndLattice(settings.rowCount, settings.colCount);
  });

settingFolder
  .add(settings, "colCount", 1, 5, 1)
  .name("列数")
  .onChange((value: number) => {
    hideBoxAndLattice();
    settings.colCount = value;
    createSqureAndLattice(settings.rowCount, settings.colCount);
  });

// settingFolder添加一个CheckBox
settingFolder
  .add(settings, "showModal")
  .name("显示库存")
  .onChange((value: boolean) => {
    settings.showModal = value;
  });

function getContainerObjByChild(obj: any) {
  if (obj.userData.isContainer) return obj;
  else if (obj.parent != null) return getContainerObjByChild(obj.parent);
  else return null;
}
const bHelper = new THREE.BoxHelper(new THREE.Mesh(), 0x00ffff);
let curreentBox: THREE.Object3D<THREE.Event>;
function onWindowClick(event: any) {
  if (!fridge) return;
  const pointer = new THREE.Vector2();
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(fridge.scene.children, true);
  // Get the intersected object
  if (intersects && intersects.length > 0) {
    const intersectedObj = getContainerObjByChild(intersects[0].object);
    if (intersectedObj) {
      const id = intersectedObj.userData.id;
      if (id) {
        const boxHelper = boxHelpers.find((helper) => helper[id]);
        if (boxHelper) {
          const box = boxHelper[id];
          curreentBox = box;
          const helper = bHelper.setFromObject(box);
          if (box.userData.open) scene.remove(helper);
          else scene.add(helper);
        }
      } else {
        fridge.scene.remove(bHelper);
      }
    }
  }
}

window.addEventListener("mousemove", onWindowClick);

window.addEventListener("click", function (event: any) {
  if (!fridge) return;
  const pointer = new THREE.Vector2();
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(fridge.scene.children, true);
  // Get the intersected object
  if (intersects && intersects.length > 0) {
    const intersectedObj = getContainerObjByChild(intersects[0].object);
    if (intersectedObj) {
      const id = intersectedObj.userData.id;
      if (id) {
        const _x = curreentBox.userData.open ? -10 : -48;
        curreentBox.userData.open = !curreentBox.userData.open;
        fridge.scene.remove(bHelper);
        new Tween(curreentBox.position)
          .to(
            {
              // 45度
              x: _x,
            },
            1000
          )
          .easing(Easing.Linear.None)
          .start()
          .onComplete(() => {
            if (!curreentBox.userData.open || !settings.showModal) return;
            // 写一个模态框，显示数据
            const modal = document.createElement("div");
            modal.style.position = "absolute";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.backgroundColor = "rgba(0,0,0,0.5)";
            modal.style.zIndex = "999";
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            // paddingtop 30px
            modal.style.paddingTop = "30px";
            modal.style.alignItems = "top";
            modal.style.color = "#fff";
            modal.style.fontSize = "20px";
            modal.style.fontWeight = "bold";
            modal.style.cursor = "pointer";
            const id = curreentBox.userData.id;
            const row = id.split("_")[0];
            const col = id.split("_")[1];
            modal.innerText = `您查看的是${Number(row) + 1}行，第${
              Number(col) + 1
            }列的库位，`;
            document.body.appendChild(modal);
            modal.addEventListener("click", () => {
              document.body.removeChild(modal);
            });
          });
      } else {
        fridge.scene.remove(bHelper);
      }
    }
  }
});
