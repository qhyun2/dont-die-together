import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Howl, Howler } from "howler";
import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";

Kontra.init(document.createElement("canvas"));
Kontra.initKeys();

let loop = Kontra.GameLoop({
  update: update,
  render: render,
});

var client = new Colyseus.Client("ws://99.251.116.242:2567");
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
    room.send("move", { y: 0.1 });
  };

  room.state.players.onRemove = (player: any, sessionId: string) => {
    console.log("Left", player, sessionId);
    scene.remove(players[sessionId]);
    delete players[sessionId];
  };

  room.state.players.onChange = (player: any, sessionId: string) => {
    console.log(player);
    players[sessionId].position.set(player.x, player.y, player.z);
    if (room.sessionId === sessionId) {
    controls.getObject().position.set(player.x, player.y, player.z)
    }
  };

  loop.start();

  window.addEventListener("keydown", function (e) {
    if (e.which == 38) {
      room.send("move", { y: -1 });
      console.log("moving");
    }
  });
});

var label = document.getElementById("label")!;
var start = document.getElementById("start")!;

var sound1 = new Howl({
  src: [require("../audio/sound1.webm").default, require('../audio/sound1.mp3').default],
  volume: 0.1
});

var sound2 = new Howl({
  src: [require('../audio/sound2.webm').default, require('../audio/sound2.mp3').default],
  sprite: {
    one: [0, 450],
    two: [2000, 250],
    three: [4000, 350],
    four: [6000, 380],
    five: [8000, 340],
    beat: [10000, 11163]
  }
});

sound1.once('load', function() {
  start.removeAttribute('disabled');
  start.innerHTML = 'BEGIN SPATIAL TESTS';
  tests[0](chain(1));
});


// Define the tests to run.
var id;
var tests = [
  function (fn: any) {
    sound1.once("play", function () {
      label.innerHTML = "PLAYING";
      setTimeout(fn, 2000);
    });

    id = sound1.play();
  },

  function (fn) {
    sound1.stereo(-1, id);

    label.innerHTML = "LEFT STEREO";
    setTimeout(fn, 2000);
  },

  function (fn) {
    sound1.stereo(1, id);

    label.innerHTML = "RIGHT STEREO";
    setTimeout(function () {
      fn();
    }, 2000);
  },

  function (fn) {
    sound1.pos(-2, 0, -0.5, id);

    label.innerHTML = "LEFT POSITION";
    setTimeout(fn, 2000);
  },

  function (fn) {
    sound1.pos(2, 0, -0.5, id);

    label.innerHTML = "RIGHT POSITION";
    setTimeout(function () {
      sound1.stop();
      fn();
    }, 2000);
  },

  function (fn) {
    sound2.pos(-3, 0, -0.5, sound2.play("one"));
    sound2.once("end", function () {
      sound2.pos(0, 3, -0.5, sound2.play("two"));
      sound2.once("end", function () {
        sound2.pos(3, 0, -0.5, sound2.play("three"));
        sound2.once("end", function () {
          sound2.pos(0, -3, -0.5, sound2.play("four"));
          sound2.once("end", function () {
            sound2.stop();
            fn();
          });
        });
      });
    });

    label.innerHTML = "3D SURROUND";
  },
];

// Create a method that will call the next in the series.
var chain = function (i) {
  return function () {
    if (tests[i]) {
      tests[i](chain(++i));
    } else {
      label.innerHTML = "COMPLETE!";
      label.style.color = "#74b074";
    }
  };
};

start.addEventListener(
  "click",
  function () {
    tests[0](chain(1));
    start.style.display = "none";
  },
  false
);











































// Remus Audio Stuff
// @ts-ignore
// let sound = new Howl({
//   src: ['http://20423.live.streamtheworld.com/RADIO538.mp3'],
//   html5: true, // A live stream can only be played through HTML5 Audio.
//   format: ['mp3', 'aac'],
//   volume: 0.05
// });

// console.log(sound)

// const soundId = sound.play()
// sound.stereo(-1, soundId);

// Remus Audio Stuff

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

const blocker = document.getElementById("blocker")!;

const controls = new PointerLockControls(camera, document.body);
blocker.addEventListener(
  "click",
  () => {
    controls.lock();
  },
  false
);
controls.addEventListener("lock", () => {
  blocker.style.display = "none";
});
controls.addEventListener("unlock", () => {
  blocker.style.display = "block";
});
scene.add(controls.getObject());

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

let firstRun = 1;

function update(dt: number) {
  // Remus Audio Stuff
  // if (firstRun == 1) {
  //   let id = file.play();
  //   file.stereo(-1, id);
  // }
  // firstRun = 0;
  // Remus Audio Stuff

  const speed = 0.1;
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
}

function render() {
  camera.position.y = 1;
  renderer.render(scene, camera);
}
