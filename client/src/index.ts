import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as Howler from "howler";
import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import { MirroredRepeatWrapping } from "three";

Kontra.init(document.createElement("canvas"));
Kontra.initKeys();

let loop = Kontra.GameLoop({
  update: update,
  render: render,
});

var client = new Colyseus.Client("ws://localhost:2567");
var room: Colyseus.Room;

var players: { [sessionId: string]: THREE.Mesh } = {};

function newCube() {
  var geometry = new THREE.SphereBufferGeometry(1, 20, 20);
  var material = new THREE.MeshPhongMaterial({
    color: "purple",
    reflectivity: 1,
    shininess: 140,
  });

  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1.7 / 2, 0);
  return cube;
}

client.joinOrCreate("game_room").then((init_room) => {
  console.log("connected");
  room = init_room;
  console.log(room.send);

  // room.send("test", {});

  room.state.players.onAdd = (player: any, sessionId: string) => {
    console.log("Joined", player, sessionId);
    players[sessionId] = newCube();
    scene.add(players[sessionId]);
  };

  room.state.players.onRemove = (player: any, sessionId: string) => {
    console.log("Left", player, sessionId);
    scene.remove(players[sessionId]);
    delete players[sessionId];
  };

  room.state.players.onChange = (player: any, sessionId: string) => {
    console.log(player);
    players[sessionId].position.set(player.x, player.y, player.z);
  };

  loop.start();

  window.addEventListener("keydown", function (e) {
    if (e.which == 38) {
      room.send("move", { y: -1 });
      console.log("moving");
    }
  });
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const ground_geo = new THREE.PlaneBufferGeometry(1000, 1000);
const ground_tex = new THREE.TextureLoader().load(
  require("../skybox/dirt.png").default
);
ground_tex.repeat.set(1000, 1000);
ground_tex.wrapS = THREE.RepeatWrapping;
ground_tex.wrapT = THREE.RepeatWrapping;
const ground_mat = new THREE.MeshPhongMaterial({
  map: ground_tex,
  dithering: true,
});
const ground = new THREE.Mesh(ground_geo, ground_mat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enablePan = false;
controls.enableZoom = false;

var ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(2, 10, 2);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.2;
spotLight.decay = 4;
spotLight.distance = 100;

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

var cube = newCube();
scene.add(cube);

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  require("../skybox/pos-x.png").default,
  require("../skybox/neg-x.png").default,
  require("../skybox/pos-y.png").default,
  require("../skybox/neg-y.png").default,
  require("../skybox/pos-z.png").default,
  require("../skybox/neg-z.png").default,
]);
scene.background = texture;

const direction = new THREE.Vector3();

function update(dt: number) {
  if (Kontra.keyPressed("a")) {
    room.send("move", { x: -0.1 });
  }
  if (Kontra.keyPressed("d")) {
    room.send("move", { x: 0.1 });
  }
  if (Kontra.keyPressed("w")) {
    room.send("move", { z: -0.1 });
  }
  if (Kontra.keyPressed("s")) {
    room.send("move", { z: 0.1 });
  }

  cube.getWorldPosition(controls.target);
  controls.update();
  // update the transformation of the camera so it has an offset position to the current target
  direction.subVectors(camera.position, controls.target);
  direction.normalize().multiplyScalar(10);
  camera.position.copy(direction.add(controls.target));
}

function render() {
  renderer.render(scene, camera);
}
