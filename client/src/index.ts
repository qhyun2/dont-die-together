import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as Howler from "howler";
// import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import { MirroredRepeatWrapping } from "three";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 10;
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshPhysicalMaterial({ color: 0x013fcc });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ground_geo = new THREE.PlaneBufferGeometry(1000, 1000);
const ground_tex = new THREE.TextureLoader().load(
  require("../skybox/dirt.png").default
);
ground_tex.repeat.set(1000, 1000);
ground_tex.wrapS = THREE.RepeatWrapping;
ground_tex.wrapT = THREE.RepeatWrapping;
const ground_mat = new THREE.MeshPhysicalMaterial({ map: ground_tex });
const ground = new THREE.Mesh(ground_geo, ground_mat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
// controls.enablePan = false;

var spotLight = new THREE.DirectionalLight(0xffffff);
spotLight.position.set(6, 10, 8);
spotLight.castShadow = true;

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  require("../skybox/pos-x.png").default,
  require("../skybox/neg-x.png").default,
  require("../skybox/pos-y.png").default,
  require("../skybox/neg-y.png").default,
  require("../skybox/pos-z.png").default,
  require("../skybox/neg-z.png").default,
]);
texture;
scene.background = texture;

scene.add(spotLight);

Kontra.init(document.createElement("canvas"));
Kontra.initKeys();

let loop = Kontra.GameLoop({
  update: update,
  render: render,
});

loop.start();

function update(dt: number) {
  const speed = 0.1;
  if (Kontra.keyPressed("a")) {
    console.log("gang");
    cube.position.x -= speed;
  } else if (Kontra.keyPressed("d")) {
    cube.position.x += speed;
  } else if (Kontra.keyPressed("w")) {
    cube.position.z -= speed;
  } else if (Kontra.keyPressed("s")) {
    cube.position.z += speed;
  }
  camera.position.set(cube.position.x, cube.position.y, cube.position.z);
  camera.position.add(new THREE.Vector3(0, 2, 4));
}

function render() {
  renderer.render(scene, camera);
}
