import * as THREE from "three";
import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import "./Sound";
import { World } from "./graphics/World";
import { PlayerControls } from "./PlayerControls";
import { Network } from "./Network";

Kontra.init(document.createElement("canvas"));
Kontra.initKeys();

// main game loop
let loop = Kontra.GameLoop({
  update: update,
  render: render,
});

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// instantiate classes
const world = new World();
const networking = new Network(loop, world);
const playerControls = new PlayerControls(world, networking);

function update() {
  playerControls.update();
}

function render() {
  renderer.render(world.scene, playerControls.camera);
}
